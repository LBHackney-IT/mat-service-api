import { v1MatAPIGatewayInterface } from '../../gateways/v1MatAPIGateway';
import { NewNote } from '../../interfaces/note';

interface CreateTaskNoteOptions {
  gateway: v1MatAPIGatewayInterface;
}

interface CreateTaskNote {
  execute(note: NewNote): Promise<boolean>;
}

class CreateTaskNote implements CreateTaskNote {
  v1MatAPIGateway: v1MatAPIGatewayInterface;

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
