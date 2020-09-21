import { V1MatAPIGatewayInterface } from '../../gateways/v1MatAPIGateway';
import { TenancyManagementInteraction } from '../../interfaces/tenancyManagementInteraction';
import GetUser from './getUser';
import GetOfficerPatch from './getOfficerPatch';
import MatPostgresGateway from '../../gateways/matPostgresGateway';
import CrmGateway, { CrmGatewayInterface } from '../../gateways/crmGateway';

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

interface CreateManualTaskResponse {
  body?: TenancyManagementInteraction;
  error?: string;
}

interface CreateManualTaskOptions {
  v1MatAPIGateway: V1MatAPIGatewayInterface;
  crmGateway: CrmGatewayInterface;
}

interface CreateManualTaskInterface {
  execute(processData: CreateManualTaskData): Promise<CreateManualTaskResponse>;
}

interface CreateManualTaskData {
  tagRef: string;
  uprn: string;
  process: string;
  subProcess?: number;
  officerEmail: string;
  officerName: string;
}

class CreateManualTaskUseCase implements CreateManualTaskInterface {
  v1MatAPIGateway: V1MatAPIGatewayInterface;
  crmGateway: CrmGatewayInterface;

  constructor(options: CreateManualTaskOptions) {
    this.v1MatAPIGateway = options.v1MatAPIGateway;
    this.crmGateway = options.crmGateway;
  }

  public async execute(
    processData: CreateManualTaskData
  ): Promise<CreateManualTaskResponse> {
    const contacts = await this.crmGateway.getContactsByUprn(processData.uprn);
    if (
      contacts.error ||
      (contacts && contacts.body && contacts.body.length === 0) ||
      !contacts ||
      !contacts.body
    ) {
      return { error: 'Error fetching contacts', body: undefined };
    }
    const contact = contacts.body[0];

    const matPostgresGateway = new MatPostgresGateway();
    const getOfficerPatchId = new GetOfficerPatch({
      emailAddress: processData.officerEmail,
      crmGateway: this.crmGateway,
      matPostgresGateway,
    });

    const officerDetails = await getOfficerPatchId.execute();
    if (
      !officerDetails.body ||
      officerDetails.error ||
      !officerDetails.body.areaId ||
      !officerDetails.body.patchId
    ) {
      return { error: 'Error fetching officer patch details', body: undefined };
    }

    let tmi: TenancyManagementInteraction;

    tmi = {
      enquirySubject: tmiLookup[processData.process].enquirySubject,
      reasonForStartingProcess: processData.subProcess,
      subject: 'c1f72d01-28dc-e711-8115-70106faa6a11',
      natureofEnquiry: '15',
      source: '1',
      contactId: contact.crmContactId,
      estateOfficerId: officerDetails.body.officerId,
      estateOfficerName: processData.officerName,
      officerPatchId: officerDetails.body.patchId,
      areaName: officerDetails.body.areaId,
      householdId: contact.crmHouseholdId,
      processType: 1,
      serviceRequest: {
        title: tmiLookup[processData.process].title,
        description: tmiLookup[processData.process].description,
        contactId: contact.crmContactId,
        subject: 'c1f72d01-28dc-e711-8115-70106faa6a11',
        createdBy: officerDetails.body.officerId,
        childRequests: [],
      },
    };
    // Send to the api endpoint to create a tmi
    return await this.v1MatAPIGateway.createTenancyManagementInteraction(tmi);
  }
}

export default CreateManualTaskUseCase;
