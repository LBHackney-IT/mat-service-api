import { CrmGatewayInterface } from '../../gateways/crmGateway';
import AngularProcessToken from '../../interfaces/angularProcessToken';
import { encrypt } from '../../lib/encryption';
import MatPostgresGateway from '../../gateways/matPostgresGateway';
import UserMapping from '../../interfaces/userMapping';
import { Task, ProcessType } from '../../interfaces/task';
import { PatchDetailsInterface } from '../../mappings/crmToPatchDetails';
import moment from 'moment';

const urls = {
  thc: 'https://thc.manageatenancy.gov.uk/',
  itv: 'https://thc.manageatenancy.gov.uk/',
  homecheck: 'https://thc.manageatenancy.gov.uk/',
};

const processIds: { [key: string]: number } = {
  [ProcessType.thc]: 1,
  [ProcessType.homecheck]: 2,
  [ProcessType.itv]: 3,
};

const processTypeIdLookup = (
  processType: ProcessType | null
): number | null => {
  if (!processType) return null;
  return processIds[processType] || null;
};

interface GetExternalAngularProcessUrlResponse {
  body?: string;
  error?: string;
}

interface GetExternalAngularProcessUrlOptions {
  encryptionKey: string;
  crmGateway: CrmGatewayInterface;
  matPostgresGateway: MatPostgresGateway;
}

interface GetExternalAngularProcessUrlInterface {
  execute(
    taskId: string,
    officerEmail: string
  ): Promise<GetExternalAngularProcessUrlResponse>;
}

class GetExternalAngularProcessUrlUseCase
  implements GetExternalAngularProcessUrlInterface {
  encryptionKey: string;
  crmGateway: CrmGatewayInterface;
  matPostgresGateway: MatPostgresGateway;

  constructor(options: GetExternalAngularProcessUrlOptions) {
    this.encryptionKey = options.encryptionKey;
    this.crmGateway = options.crmGateway;
    this.matPostgresGateway = options.matPostgresGateway;
  }

  public async execute(
    taskId: string,
    officerEmail: string
  ): Promise<GetExternalAngularProcessUrlResponse> {
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
      contactDOB: moment(task.resident.dateOfBirth).format('DD/MM/YYYY'),
      contactMobile: task.resident.mobileNumber || '',
      uprn: task.tenancy.uprn,
      patchId: patchData.patchId || '',
      subjectId: 'c1f72d01-28dc-e711-8115-70106faa6a11',
      areaId: `${patchData.areaId}`,
      processId: `${processTypeIdLookup(task.processType)}`,
      IsStarting: false,
      HouseholdID: task.householdId,
      ManagerId: patchData.areaManagerId || '',
      TMProcessId: taskId,
      IncidentId: task.incidentId,
      ProcessStage: `${task.stage}`,
      IsManager: patchData.isManager,
      ProcessCRMReference: task.referenceNumber,
    };
    console.log(tokenData);
    const token = encrypt(JSON.stringify(tokenData), this.encryptionKey);
    return { body: `${urls.itv}?data=${token}` };
  }
}

export default GetExternalAngularProcessUrlUseCase;
