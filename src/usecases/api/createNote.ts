import { truncate } from 'cypress/types/lodash';
import v1MatAPIGateway, {
  v1MatAPIGatewayInterface,
  v1MatAPIGatewayOptions,
} from '../../gateways/v1MatAPIGateway';
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

  public execute = async (note: NewNote): Promise<boolean> => {
    const response = await this.v1MatAPIGateway
      .createTaskNote(note)
      .then((response) => {
        return true;
      })
      .catch((error) => {
        return false;
      });

    return response;
  };
}

export default CreateTaskNote;

// const CreateNote = async (note: NewNote, options: v1MatAPIGatewayOptions): Promise<boolean> => {
//   const v1MatApiGateway = new v1MatAPIGateway(options);

//   const response = await v1MatApiGateway.createTaskNote(note)
//     .then(response => {
//       return true;
//     })
//     .catch(error => {
//       return false;
//     })

//   return response;
// }
