import CrmGateway from "../../gateways/crmGateway";
import faker from "faker";
import GetUser from "./getUser";
jest.mock("../../gateways/crmGateway");

describe("GetUser", () => {
  beforeEach(() => {
    CrmGateway.mockClear();
  })

  it("returns 404 when no user exists", async () => {
    CrmGateway.mockImplementationOnce(() => {
      return {
        getUser: () => (
          {
            body: undefined,
            error: undefined
          }
        )
      }
    })

    const emailAddress = faker.internet.email();

    const getUser = new GetUser(emailAddress);
    const response = await getUser.execute();

    expect(CrmGateway).toHaveBeenCalledTimes(1);
    expect(response).toEqual({body: undefined, error: 404});
  })

  it("returns a 401 if the error is NotAuthorised", async () => {
    CrmGateway.mockImplementationOnce(() => {
      return {
        getUser: () => (
          {
            body: undefined,
            error: "NotAuthorised"
          }
        )
      }
    })

    const emailAddress = faker.internet.email();

    const getUser = new GetUser(emailAddress);
    const response = await getUser.execute();

    expect(CrmGateway).toHaveBeenCalledTimes(1);
    expect(response).toEqual({body: undefined, error: 401});
  })

  it("returns a 500 for any other error", async () => {
    CrmGateway.mockImplementationOnce(() => {
      return {
        getUser: () => (
          {
            body: undefined,
            error: faker.lorem.word()
          }
        )
      }
    })

    const emailAddress = faker.internet.email();

    const getUser = new GetUser(emailAddress);
    const response = await getUser.execute();

    expect(CrmGateway).toHaveBeenCalledTimes(1);
    expect(response).toEqual({body: undefined, error: 500});
  })

  it("returns a user guid when the user exists", async () => {
    const crmUserGuid = faker.lorem.word();
    CrmGateway.mockImplementationOnce(() => {
      return {
        getUser: () => (
          {
            body: [{"hackney_estateofficerid": crmUserGuid}],
            error: undefined
          }
        )
      }
    })

    const emailAddress = faker.internet.email();

    const getUser = new GetUser(emailAddress);
    const response = await getUser.execute();

    expect(CrmGateway).toHaveBeenCalledTimes(1);
    expect(response).toEqual({body: crmUserGuid, error: undefined});
  })
})
