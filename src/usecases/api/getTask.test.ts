import GetTask from "./getTask";
import CrmGateway from "../../gateways/crmGateway";
import { Task } from "../../interfaces/task";
import MockTask from "../../tests/helpers/generateTask";
jest.mock("../../gateways/crmGateway");

describe("GetTask", () => {
  beforeEach(() => {
    CrmGateway.mockClear();
  })

  it("Returns a response when no errors are found", async () => {
    const mockResponse: Task = MockTask();

    CrmGateway.mockImplementationOnce(() => {
      return {
        getTask: () => (
          {
            body: mockResponse,
            error: undefined
          }
        )
      }
    })

    const taskId = "d881edaa-c825-404b-a066-99ab6874dd2f";

    const getTask = new GetTask(taskId);
    const response = await getTask.execute();

    expect(CrmGateway).toHaveBeenCalledTimes(1);
    expect(response).toEqual({ body: mockResponse, error: undefined })
  })

  it("Returns a 500 error when errors are found", async () => {
    CrmGateway.mockImplementationOnce(() => {
      return {
        getTask: () => (
          {
            body: undefined,
            error: "Anything"
          }
        )
      }
    })

    const taskId = "d881edaa-c825-404b-a066-99ab6874dd2f";

    const getTask = new GetTask(taskId);
    const response = await getTask.execute();

    expect(CrmGateway).toHaveBeenCalledTimes(1);
    expect(response).toEqual({ body: undefined, error: 500 })
  })

  it("Returns a 401 error when errors is NotAuthorised", async () => {
    CrmGateway.mockImplementationOnce(() => {
      return {
        getTask: () => (
          {
            body: undefined,
            error: "NotAuthorised"
          }
        )
      }
    })

    const taskId = "d881edaa-c825-404b-a066-99ab6874dd2f";
    
    const getTask = new GetTask(taskId);
    const response = await getTask.execute();

    expect(CrmGateway).toHaveBeenCalledTimes(1);
    expect(response).toEqual({ body: undefined, error: 401 })
  })
  
})
