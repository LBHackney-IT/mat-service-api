import { V1MatAPIGatewayInterface } from '../../gateways/v1MatAPIGateway';
import { NewNote } from '../../interfaces/note';
import { Result } from '../../lib/utils';

export interface CreateNoteInterface {
  execute(note: NewNote): Promise<Result<boolean>>;
}

export default class CreateNote implements CreateNoteInterface {
  v1MatAPIGateway: V1MatAPIGatewayInterface;

  constructor(v1MatAPIGateway: V1MatAPIGatewayInterface) {
    this.v1MatAPIGateway = v1MatAPIGateway;
  }

  public async execute(note: NewNote): Promise<Result<boolean>> {
    return await this.v1MatAPIGateway
      .createTaskNote(note)
      .then(() => true)
      .catch((e) => e);
  }
}
