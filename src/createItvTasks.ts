import CreateITVTasks from './usecases/api/createITVTasks';
import V1MatAPIGateway from './gateways/v1MatAPIGateway';

module.exports = async () => {
  if (!process.env.V1_MAT_API_URL || !process.env.V1_MAT_API_TOKEN) {
    throw new Error('Missing environment variable for createItvTasks');
  }

  const gateway: V1MatAPIGateway = new V1MatAPIGateway({
    v1MatApiUrl: process.env.V1_MAT_API_URL,
    v1MatApiToken: process.env.V1_MAT_API_TOKEN,
  });
  const usecase = new CreateITVTasks({ gateway });

  await usecase.execute();
};
