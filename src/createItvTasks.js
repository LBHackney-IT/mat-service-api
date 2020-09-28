import CreateITVTasksUseCase from './usecases/api/createITVTasks';
import V1MatAPIGateway from './gateways/v1MatAPIGateway';
import { isError } from 'cypress/types/lodash';

module.exports = async () => {
  if (!process.env.V1_MAT_API_URL || !process.env.V1_MAT_API_TOKEN) {
    throw new Error('Missing environment variable for createItvTasks');
  }
  const v1MatAPIGateway = new V1MatAPIGateway({
    v1MatApiUrl: process.env.V1_MAT_API_URL,
    v1MatApiToken: process.env.V1_MAT_API_TOKEN,
  });
  const crmGateway = new CrmGateway();
  const matPostgresGateway = new MatPostgresGateway();
  const usecase = new CreateITVTasksUseCase({
    v1MatAPIGateway,
    crmGateway,
    matPostgresGateway,
  });

  const result = await usecase.execute();
  if (isError(result)) console.log(result.message);
};
