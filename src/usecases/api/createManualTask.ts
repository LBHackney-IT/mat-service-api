import { V1MatAPIGatewayInterface } from '../../gateways/v1MatAPIGateway';
import { TenancyManagementInteraction } from '../../interfaces/tenancyManagementInteraction';
import GetOfficerPatch from './getOfficerPatch';
import { MatPostgresGatewayInterface } from '../../gateways/matPostgresGateway';
import { CrmGatewayInterface } from '../../gateways/crmGateway';
import { Result, isError } from '../../lib/utils';

interface TmiData {
  title: string;
  description: string;
  enquirySubject: string;
}

const tmiLookup: { [key: string]: TmiData } = {
  homecheck: {
    enquirySubject: '100000052',
    title: 'Home Check',
    description: 'Starting a home check',
  },
  itv: {
    enquirySubject: '100000060',
    title: 'Introductory Tenancy Visit',
    description: 'Starting an introductory tenancy visit',
  },
  thc: {
    enquirySubject: '100000156',
    title: 'Tenancy & Household Check',
    description: 'Starting a tenancy & household check',
  },
};

export interface CreateManualTaskInterface {
  execute(
    processData: CreateManualTaskData
  ): Promise<Result<TenancyManagementInteraction>>;
}

interface CreateManualTaskData {
  tagRef: string;
  process: string;
  subProcess?: number;
  officerEmail: string;
  officerName: string;
}

class CreateManualTaskUseCase implements CreateManualTaskInterface {
  v1MatAPIGateway: V1MatAPIGatewayInterface;
  crmGateway: CrmGatewayInterface;
  matPostgresGateway: MatPostgresGatewayInterface;

  constructor(
    crmGateway: CrmGatewayInterface,
    v1MatAPIGateway: V1MatAPIGatewayInterface,
    matPostgresGateway: MatPostgresGatewayInterface
  ) {
    this.v1MatAPIGateway = v1MatAPIGateway;
    this.crmGateway = crmGateway;
    this.matPostgresGateway = matPostgresGateway;
  }

  public async execute(
    processData: CreateManualTaskData
  ): Promise<Result<TenancyManagementInteraction>> {
    const contacts = await this.crmGateway.getContactsByTagRef(
      processData.tagRef.replace('-', '/')
    );

    if (isError(contacts) || contacts.length === 0) {
      return new Error('Error fetching contacts');
    }

    const responsibleContacts = contacts
      .filter(
        (contact) => contact.responsible && contact.uhPersonNo !== undefined
      )
      .sort((a, b) => <number>a.uhPersonNo - <number>b.uhPersonNo);
    if (responsibleContacts.length === 0) {
      return new Error('Error - no responsible contacts found for tenancy');
    }
    const contact = responsibleContacts[0];

    const getOfficerPatch = new GetOfficerPatch(
      this.crmGateway,
      this.matPostgresGateway
    );

    const officerPatch = await getOfficerPatch.execute(
      processData.officerEmail
    );
    if (
      isError(officerPatch) ||
      !officerPatch.areaId ||
      !officerPatch.patchId
    ) {
      return new Error('Error fetching officer patch details');
    }

    const tmi: TenancyManagementInteraction = {
      enquirySubject: tmiLookup[processData.process].enquirySubject,
      reasonForStartingProcess: processData.subProcess,
      subject: 'c1f72d01-28dc-e711-8115-70106faa6a11',
      natureofEnquiry: '15',
      source: '1',
      contactId: contact.crmContactId,
      estateOfficerId: officerPatch.officerId,
      estateOfficerName: processData.officerName,
      officerPatchId: officerPatch.patchId,
      areaName: officerPatch.areaId,
      householdId: contact.crmHouseholdId,
      processType: 1,
      serviceRequest: {
        title: tmiLookup[processData.process].title,
        description: tmiLookup[processData.process].description,
        contactId: contact.crmContactId,
        subject: 'c1f72d01-28dc-e711-8115-70106faa6a11',
        createdBy: officerPatch.officerId,
        childRequests: [],
      },
    };
    // Send to the api endpoint to create a tmi
    const result = await this.v1MatAPIGateway.createTenancyManagementInteraction(
      tmi
    );
    if (result.body) return result.body;

    return new Error('Error creating task');
  }
}

export default CreateManualTaskUseCase;
