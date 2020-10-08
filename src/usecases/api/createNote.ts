import { CrmGatewayInterface } from '../../gateways/crmGateway';
import { V1MatAPIGatewayInterface } from '../../gateways/v1MatAPIGateway';
import HackneyToken from '../../interfaces/hackneyToken';
import { NewNote } from '../../interfaces/note';
import { isError, Result } from '../../lib/utils';

export interface CreateNoteInterface {
  execute(
    interactionId: string,
    officerToken: HackneyToken,
    note: string
  ): Promise<Result<boolean>>;
}

export default class CreateNote implements CreateNoteInterface {
  v1MatAPIGateway: V1MatAPIGatewayInterface;
  crmGateway: CrmGatewayInterface;

  constructor(
    v1MatAPIGateway: V1MatAPIGatewayInterface,
    crmGateway: CrmGatewayInterface
  ) {
    this.v1MatAPIGateway = v1MatAPIGateway;
    this.crmGateway = crmGateway;
  }

  public async execute(
    interactionId: string,
    officerToken: HackneyToken,
    note: string
  ): Promise<Result<boolean>> {
    const estateOfficerId = await this.crmGateway.getUserId(officerToken.email);
    if (!estateOfficerId || !estateOfficerId.body) {
      return new Error('Could not find estate officer ID');
    }

    const task = await this.crmGateway.getTask(interactionId);
    if (isError(task) || !task.incidentId) {
      return new Error('Error fetching task to create note');
    }

    const newNote: NewNote = {
      interactionId: interactionId,
      estateOfficerName: officerToken.name,
      ServiceRequest: {
        description: note,
        requestCallback: false,
        Id: task.incidentId,
      },
      status: 1,
      estateOfficerId: estateOfficerId.body,
    };

    return await this.v1MatAPIGateway
      .createTaskNote(newNote)
      .then(() => true)
      .catch((e) => e);
  }
}
