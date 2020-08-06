import GetCrmCloudToken from "./GetCrmCloudToken";
import CrmTokenGateway from "../../gateways/CrmTokenGateway";
import faker from "faker";
jest.mock("../../gateways/CrmTokenGateway");

describe("GetTasks", () => {
  beforeEach(() => {
    CrmTokenGateway.mockClear();
  })

  it("Returns a response when no errors are found", async () => {
    const token = faker.lorem.word();
    CrmTokenGateway.mockImplementationOnce(() => {
      return {
        getCloudToken: () => (
          {
            token: token
          }
        )
      }
    })

    const getCrmCloudToken = new GetCrmCloudToken();
    const response = await getCrmCloudToken.execute();

    expect(CrmTokenGateway).toHaveBeenCalledTimes(1);
    expect(response).toEqual({token: token})
  })

  it("Returns undefined when a token is not received", async () => {
    CrmTokenGateway.mockImplementationOnce(() => {
      return {
        getCloudToken: () => (
          {
            token: undefined
          }
        )
      }
    })

    const getCrmCloudToken = new GetCrmCloudToken();
    const response = await getCrmCloudToken.execute();

    expect(CrmTokenGateway).toHaveBeenCalledTimes(1);
    expect(response).toEqual({token: undefined})
  })
})
