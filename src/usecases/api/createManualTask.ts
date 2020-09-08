import { v1MatAPIGatewayInterface } from '../../gateways/v1MatAPIGateway';
import { TenancyManagementInteraction } from '../../interfaces/tenancyManagementInteraction';
import GetUser from './getUser';

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
  body: any | undefined;
  error: number | undefined;
}

interface CreateManualTaskOptions {
  gateway: v1MatAPIGatewayInterface;
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
  v1MatAPIGateway: v1MatAPIGatewayInterface;

  constructor(options: CreateManualTaskOptions) {
    this.v1MatAPIGateway = options.gateway;
  }

  public async execute(
    processData: CreateManualTaskData
  ): Promise<CreateManualTaskResponse> {
    const contacts = await this.v1MatAPIGateway.getContactsByUprn(
      processData.uprn
    );
    if (contacts.error) return contacts as CreateManualTaskResponse;
    if (
      (contacts && contacts.body && contacts.body.length === 0) ||
      !contacts ||
      !contacts.body
    ) {
      return { error: 404, body: undefined };
    }

    const contact = contacts.body[0];
    const getUser = new GetUser(processData.officerEmail);
    const officerId = await getUser.execute();
    if (!officerId.body) return { error: 404, body: undefined };

    const tmi: TenancyManagementInteraction = {
      enquirySubject: tmiLookup[processData.process].enquirySubject,
      reasonForStartingProcess: processData.subProcess,
      subject: 'c1f72d01-28dc-e711-8115-70106faa6a11',
      natureofEnquiry: '15',
      source: '1',
      contactId: contact.contactId,
      estateOfficerId: officerId.body, // Needs checking
      estateOfficerName: processData.officerName,
      officerPatchId: 'TBC', // Needs checking
      areaName: 0, // Needs setting
      householdId: contact.houseRef,
      serviceRequest: {
        title: tmiLookup[processData.process].title,
        description: tmiLookup[processData.process].description,
        contactId: contact.contactId,
        subject: 'c1f72d01-28dc-e711-8115-70106faa6a11',
        enquiryType: 'TBC', // Needs setting
        createdBy: officerId.body, // Needs checking
        childRequests: [],
      },
    };

    // Send to the api endpoint to create a tmi
    await this.v1MatAPIGateway.createTenancyManagementInteraction(tmi);

    return {
      body: true,
      error: undefined,
    };
  }
}

export default CreateManualTaskUseCase;
