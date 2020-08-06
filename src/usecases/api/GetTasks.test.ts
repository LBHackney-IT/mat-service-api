import GetTasks from "./getTasks";
import TasksGateway from "../../gateways/tasksGateway";
import { Task, Stage } from "../../interfaces/task";
import MockTask from "../../tests/helpers/generateTask";
jest.mock("../../gateways/TasksGateway");

describe("GetTasks", () => {
  beforeEach(() => {
    TasksGateway.mockClear();
  })

  it("Returns a response when no errors are found", async () => {
    const mockResponse: Task[] = [
      MockTask(),
      MockTask()
    ]

    TasksGateway.mockImplementationOnce(() => {
      return {
        getTasks: () => (
          {
            body: mockResponse,
            error: undefined
          }
        )
      }
    })

    const getTasks = new GetTasks();
    const response = await getTasks.execute();

    expect(TasksGateway).toHaveBeenCalledTimes(1);
    expect(response).toEqual({ body: mockResponse, error: undefined })
  })

  it("Returns a 500 error when errors are found", async () => {
    TasksGateway.mockImplementationOnce(() => {
      return {
        getTasks: () => (
          {
            body: undefined,
            error: "Anything"
          }
        )
      }
    })

    const getTasks = new GetTasks();
    const response = await getTasks.execute();

    expect(TasksGateway).toHaveBeenCalledTimes(1);
    expect(response).toEqual({ body: undefined, error: 500 })
  })

  it("Returns a 401 error when errors is NotAuthorised", async () => {
    TasksGateway.mockImplementationOnce(() => {
      return {
        getTasks: () => (
          {
            body: undefined,
            error: "NotAuthorised"
          }
        )
      }
    })

    const getTasks = new GetTasks();
    const response = await getTasks.execute();

    expect(TasksGateway).toHaveBeenCalledTimes(1);
    expect(response).toEqual({ body: undefined, error: 401 })
  })
})
