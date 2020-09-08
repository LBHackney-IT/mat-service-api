import { v1MatAPIGatewayInterface } from '../../gateways/v1MatAPIGateway';
import { TenancyManagementInteraction } from '../../interfaces/tenancyManagementInteraction';
import { tenancyToITVTask } from '../../mappings/tenancyToITVTask';

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
  execute(): Promise<CreateManualTaskResponse>;
}

interface CreateManualTaskData {
  tagRef: string;
  uprn: string;
  process: string;
  subProcess?: number;
}

class CreateManualTaskUseCase implements CreateManualTaskInterface {
  v1MatAPIGateway: v1MatAPIGatewayInterface;

  constructor(options: CreateManualTaskOptions) {
    this.v1MatAPIGateway = options.gateway;
  }

  public async execute(
    processData: CreateManualTaskData
  ): Promise<CreateManualTaskResponse> {
    const contact = await this.v1MatAPIGateway.getContactsByUprn(
      processData.uprn
    );

    const tmi: TenancyManagementInteraction = {
      enquirySubject: tmiLookup[processData.process].enquirySubject,
      reasonForStartingProcess: processData.subProcess,
      subject: 'c1f72d01-28dc-e711-8115-70106faa6a11',
      natureofEnquiry: '15',
      source: '1',
      contactId: contact.contactId,
      estateOfficerId: 'TBC',
      estateOfficerName: 'TBC',
      officerPatchId: 'TBC',
      areaName: 0,
      householdId: 'TBC',
      serviceRequest: {
        title: tmiLookup[processData.process].title,
        description: tmiLookup[processData.process].description,
        contactId: 'TBC',
        subject: 'c1f72d01-28dc-e711-8115-70106faa6a11',
        enquiryType: 'TBC',
        createdBy: 'TBC',
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
