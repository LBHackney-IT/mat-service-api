import { CrmGatewayInterface } from '../../gateways/crmGateway';
import AngularProcessToken from '../../interfaces/angularProcessToken';
import { encrypt } from '../../lib/encryption';
import { MatPostgresGatewayInterface } from '../../gateways/matPostgresGateway';
import { ProcessType } from '../../interfaces/task';
import moment from 'moment';
import {
  GetExternalProcessUrlInterface,
  GetExternalProcessUrlResponse,
} from './getExternalProcessUrl';
import externalProcessUrls from './externalProcessUrls.json';
import { isError } from '../../lib/utils';

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

export default class GetExternalAngularProcessUrl
  implements GetExternalProcessUrlInterface {
  encryptionKey: string;
  crmGateway: CrmGatewayInterface;
  matPostgresGateway: MatPostgresGatewayInterface;

  constructor(
    encryptionKey: string,
    crmGateway: CrmGatewayInterface,
    matPostgresGateway: MatPostgresGatewayInterface
  ) {
    this.encryptionKey = encryptionKey;
    this.crmGateway = crmGateway;
    this.matPostgresGateway = matPostgresGateway;
  }

  public async execute(
    taskId: string,
    officerEmail: string
  ): Promise<GetExternalProcessUrlResponse> {
    const task = await this.crmGateway.getTask(taskId);
    if (isError(task)) return new Error('Could not load task from crm');
    if (!task.processType) {
      return new Error('Task does not have a process type');
    }

    const userMapping = await this.matPostgresGateway.getUserMapping(
      officerEmail
    );
    if (isError(userMapping) || !userMapping) {
      return new Error('Could not load user mapping');
    }

    const patchData = await this.crmGateway.getPatchByOfficerId(
      userMapping.usercrmid
    );
    if (isError(patchData)) {
      return new Error('Could not load officer patch data');
    }

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

    const url = (externalProcessUrls as Record<
      string,
      Record<string, unknown>
    >)[process.env.NODE_ENV][task.processType];
    if (!url) return new Error('Could not load external URL');

    const token = encrypt(JSON.stringify(tokenData), this.encryptionKey);
    return `${url}?data=${encodeURIComponent(token)}`;
  }
}
