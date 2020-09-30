import CrmGateway from '../../gateways/crmGateway';
import Note from '../../interfaces/note';

interface GetNotesForTaskResponse {
  body?: Note[];
  error?: number;
}

const getNotesForTask = async (
  taskId: string
): Promise<GetNotesForTaskResponse> => {
  const crmGateway = new CrmGateway();

  const response = await crmGateway.getNotesForTask(taskId);

  switch (response.error) {
    case undefined:
      return {
        body: response.body,
        error: undefined,
      };
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
};

export default getNotesForTask;
