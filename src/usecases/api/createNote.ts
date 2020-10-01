import { V1MatAPIGatewayInterface } from '../../gateways/v1MatAPIGateway';
import { NewNote } from '../../interfaces/note';

interface CreateTaskNoteOptions {
  gateway: V1MatAPIGatewayInterface;
}

interface CreateTaskNote {
  execute(note: NewNote): Promise<boolean>;
}

class CreateTaskNote implements CreateTaskNote {
  v1MatAPIGateway: V1MatAPIGatewayInterface;

  constructor(options: CreateTaskNoteOptions) {
    this.v1MatAPIGateway = options.gateway;
  }

  public async execute(note: NewNote): Promise<boolean> {
    return await this.v1MatAPIGateway
      .createTaskNote(note)
      .then(() => true)
      .catch(() => false);
  }
}

export default CreateTaskNote;
