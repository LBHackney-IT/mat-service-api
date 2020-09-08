import CreateITVTasks from './usecases/api/createITVTasks';
import v1MatAPIGateway from './gateways/v1MatAPIGateway';

module.exports = async () => {
  if (!process.env.V1_MAT_API_URL || !process.env.V1_MAT_API_TOKEN) {
    throw new Error('Missing environment variable for createItvTasks');
  }

  const gateway: v1MatAPIGateway = new v1MatAPIGateway({
    v1MatApiUrl: process.env.V1_MAT_API_URL,
    v1MatApiToken: process.env.V1_MAT_API_TOKEN,
  });
  const usecase = new CreateITVTasks({ gateway });

  await usecase.execute();
};
