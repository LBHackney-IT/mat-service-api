import GetTasks from "./getTasksByPatchId";
import CrmGateway from "../../gateways/crmGateway";
import { Task } from "../../interfaces/task";
import MockTask from "../../tests/helpers/generateTask";
import { getTasksByPatchId } from "../../gateways/xmlQueryStrings/getTasksByPatchId";
import GetTasksByPatchId from "./getTasksByPatchId";
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
        getTasksByPatchId: () => (
          {
            body: mockResponse,
            error: undefined
          }
        )
      }
    })

    const patchId = '9cd3823d-8653-e811-8126-70106faaf8c1'

    const getTasksByPatchId = new GetTasksByPatchId(patchId);
    const response = await getTasksByPatchId.execute();

    expect(CrmGateway).toHaveBeenCalledTimes(1);
    expect(response).toEqual({ body: mockResponse, error: undefined })
  })

  it("Returns a 500 error when errors are found", async () => {
    CrmGateway.mockImplementationOnce(() => {
      return {
        getTasksByPatchId: () => (
          {
            body: undefined,
            error: "Anything"
          }
        )
      }
    })
    const patchId = '9cd3823d-8653-e811-8126-70106faaf8c1'
    const getTasksByPatchId = new GetTasksByPatchId(patchId);
    const response = await getTasksByPatchId.execute();

    expect(CrmGateway).toHaveBeenCalledTimes(1);
    expect(response).toEqual({ body: undefined, error: 500 })
  })

  it("Returns a 401 error when errors is NotAuthorised", async () => {
    CrmGateway.mockImplementationOnce(() => {
      return {
        getTasksByPatchId: () => (
          {
            body: undefined,
            error: "NotAuthorised"
          }
        )
      }
    })
    const patchId = '9cd3823d-8653-e811-8126-70106faaf8c1'
    const getTasksByPatchId = new GetTasksByPatchId(patchId);
    const response = await getTasksByPatchId.execute();

    expect(CrmGateway).toHaveBeenCalledTimes(1);
    expect(response).toEqual({ body: undefined, error: 401 })
  })
  
})
