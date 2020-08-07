import GetTasks from "./getTasks";
import CrmGateway from "../../gateways/crmGateway";
import { Task } from "../../interfaces/task";
import MockTask from "../../tests/helpers/generateTask";
jest.mock("../../gateways/crmGateway");

describe("GetTasks", () => {
  beforeEach(() => {
    CrmGateway.mockClear();
  })

  it("Returns a response when no errors are found", async () => {
    const mockResponse: Task[] = [
      MockTask(),
      MockTask()
    ]

    CrmGateway.mockImplementationOnce(() => {
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

    expect(CrmGateway).toHaveBeenCalledTimes(1);
    expect(response).toEqual({ body: mockResponse, error: undefined })
  })

  it("Returns a 500 error when errors are found", async () => {
    CrmGateway.mockImplementationOnce(() => {
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

    expect(CrmGateway).toHaveBeenCalledTimes(1);
    expect(response).toEqual({ body: undefined, error: 500 })
  })

  it("Returns a 401 error when errors is NotAuthorised", async () => {
    CrmGateway.mockImplementationOnce(() => {
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

    expect(CrmGateway).toHaveBeenCalledTimes(1);
    expect(response).toEqual({ body: undefined, error: 401 })
  })
})
