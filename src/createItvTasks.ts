import CreateITVTasks from './usecases/api/createITVTasks';

module.exports = async () => {
  const usecase = new CreateITVTasks();
  await usecase.execute();
};
