import { CrmGatewayInterface } from '../../gateways/crmGateway';
import AngularProcessToken from '../../interfaces/angularProcessToken';
import { encrypt } from '../../lib/encryption';
import MatPostgresGateway from '../../gateways/matPostgresGateway';
import UserMapping from '../../interfaces/userMapping';
import { Task } from '../../interfaces/task';
import { PatchDetailsInterface } from '../../mappings/crmToPatchDetails';

const urls = {
  thc: 'https://thc.manageatenancy.gov.uk/',
  itv: 'https://thc.manageatenancy.gov.uk/',
  homecheck: 'https://thc.manageatenancy.gov.uk/',
};

interface GetTaskProcessUrlResponse {
  body?: string;
  error?: string;
}

interface GetTaskProcessUrlOptions {
  encryptionKey: string;
  crmGateway: CrmGatewayInterface;
  matPostgresGateway: MatPostgresGateway;
}

interface GetTaskProcessUrlInterface {
  execute(
    taskId: string,
    officerEmail: string
  ): Promise<GetTaskProcessUrlResponse>;
}

class GetTaskProcessUrlUseCase implements GetTaskProcessUrlInterface {
  encryptionKey: string;
  crmGateway: CrmGatewayInterface;
  matPostgresGateway: MatPostgresGateway;

  constructor(options: GetTaskProcessUrlOptions) {
    this.encryptionKey = options.encryptionKey;
    this.crmGateway = options.crmGateway;
    this.matPostgresGateway = options.matPostgresGateway;
  }

  public async execute(
    taskId: string,
    officerEmail: string
  ): Promise<GetTaskProcessUrlResponse> {
    const task: Task | undefined = (await this.crmGateway.getTask(taskId)).body;
    if (!task) return { error: 'Could not load task from crm' };

    const userMapping: UserMapping | undefined = (
      await this.matPostgresGateway.getUserMapping(officerEmail)
    ).body;
    if (!userMapping) return { error: 'Could not load user mapping' };

    const patchData: PatchDetailsInterface | undefined = (
      await this.crmGateway.getPatchByOfficerId(userMapping.usercrmid)
    ).body;
    if (!patchData) return { error: 'Could not load officer patch data' };

    const tokenData: AngularProcessToken = {
      contactId: task.resident.contactCrmId,
      officerId: userMapping.usercrmid,
      officerFullName: userMapping.username,
      contactFullName: task.resident.presentationName,
      contactAddress: task.address.presentationShort,
      officerUsername: 'TBC',
      contactDOB: task.resident.dateOfBirth.toISOString().substring(0, 10),
      contactMobile: task.resident.mobileNumber || '',
      uprn: task.tenancy.uprn,
      patchId: patchData.patchId || '',
      subjectId: 'c1f72d01-28dc-e711-8115-70106faa6a11',
      areaId: `${patchData.areaId}`,
      processId: `${task.categoryId}`,
      IsStarting: false,
      HouseholdID: task.householdId,
      ManagerId: patchData.areaManagerId || '',
      TMProcessId: taskId,
      IncidentId: task.incidentId,
      ProcessStage: `${task.stage}`,
      IsManager: patchData.isManager,
      ProcessCRMReference: task.referenceNumber,
    };

    const token = encrypt(JSON.stringify(tokenData), this.encryptionKey);
    return { body: `${urls.itv}?data=${token}` };
  }
}

export default GetTaskProcessUrlUseCase;
