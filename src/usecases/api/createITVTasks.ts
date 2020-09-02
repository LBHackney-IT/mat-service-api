import v1MatAPIGateway, {
  v1MatAPIGatewayInterface,
} from '../../gateways/v1MatAPIGateway';
import { Tenancy } from '../../interfaces/tenancy';
import { TenancyManagementInteraction } from '../../interfaces/tenancyManagementInteraction';

interface CreateITVTasksResponse {
  body: any | undefined;
  error: number | undefined;
}

interface CreateITVTasksInterface {
  execute(): Promise<CreateITVTasksResponse>;
}

class CreateITVTasks implements CreateITVTasksInterface {
  v1MatAPIGateway: v1MatAPIGatewayInterface;

  constructor() {
    this.v1MatAPIGateway = new v1MatAPIGateway();
  }

  public async execute(): Promise<CreateITVTasksResponse> {
    const tenancies = await this.v1MatAPIGateway.getNewTenancies();

    // Check if no error
    if (tenancies.error) {
      switch (tenancies.error) {
        case 'NotAuthorised':
          return {
            body: undefined,
            error: 401,
          };
        default:
          return {
            body: undefined,
            error: 500,
          };
      }
    }
    if (!tenancies.body) {
      return {
        body: undefined,
        error: 500,
      };
    }

    // Filter out all non-introductory tenancies
    let introductoryTenancies = tenancies.body.filter((tenancy) => {
      return tenancy.housingTenure === 'INT';
    });

    // Loop over the remaining introductory tenancies, convert to tmi objects
    const tmiObjects: TenancyManagementInteraction[] = introductoryTenancies.map(
      (tenancy) => {
        return {
          transferred: undefined,
          status: undefined,
          parentInteractionId: undefined,
          householdId: undefined,
          processStage: undefined,
          reasonForStartingProcess: undefined,
          assignedToPatch: undefined,
          assignedToManager: undefined,
          managerId: undefined,
          estateOffice: undefined,
          adviceGiven: undefined,
          interactionId: undefined,
          contactId: tenancy.contacts[0].contactId,
          enquirySubject: '100000060',
          estateOfficerId: tenancy.officerId,
          subject: 'c1f72d01-28dc-e711-8115-70106faa6a11',
          source: '1',
          natureofEnquiry: '15',
          estateOfficerName: tenancy.officerName,
          officerPatchId: tenancy.patchId,
          areaName: tenancy.areaId,
          serviceRequest: {
            id: undefined,
            title: 'Initial tenancy visit',
            description: 'Starting an initial tenancy visit',
            contactId: tenancy.contacts[0].contactId,
            parentCaseId: undefined,
            createdDate: undefined,
            enquiryType: undefined,
            ticketNumber: undefined,
            requestCallback: undefined,
            transferred: undefined,
            createdBy: undefined,
            childRequests: undefined,
            subject: 'c1f72d01-28dc-e711-8115-70106faa6a11',
            householdId: tenancy.householdId,
          },
          processType: 1,
        };
      }
    );

    // Send to the api endpoint to create a tmi
    // Which api... to AWS as a Lambda function...and then where to?
    tmiObjects.forEach(async (tmi) => {
      // console.log(
      //   'CreateTenancyManagementInteraction call',
      //   await this.v1MatAPIGateway.createTenancyManagementInteraction(tmi)
      // );
      await this.v1MatAPIGateway.createTenancyManagementInteraction(tmi);
    });
  }
}

export default CreateITVTasks;
