import CrmGateway from '../../gateways/crmGateway';
import CrmTokenGateway from '../../gateways/crmTokenGateway';
import Note from '../../interfaces/note';

interface GetNotesForTaskResponse {
  body?: Note[];
  error?: number;
}

const getNotesForTask = async (
  taskId: string
): Promise<GetNotesForTaskResponse> => {
  const crmTokenGateway = new CrmTokenGateway();
  const crmGateway = new CrmGateway(
    `${process.env.CRM_API_URL}`,
    crmTokenGateway
  );

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
