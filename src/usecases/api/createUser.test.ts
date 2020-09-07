import CrmGateway from "../../gateways/crmGateway";
import faker from "faker";
import CreateUser from "./createUser";

jest.mock("../../gateways/crmGateway");

describe("createUser", () => {
  beforeEach(() => {
    CrmGateway.mockClear();
  })

  it("Returns a guid and error undefined if the creation was successful", async () => {
    const crmId = faker.lorem.word();
    CrmGateway.mockImplementationOnce(() => {
      return {
        createUser: () => ({
          body: crmId,
          error: undefined,
        })
      }
    })

    const firstName = faker.name.firstName()
    const familyName = faker.name.lastName()
    const user = {
      firstName: firstName,
      familyName: familyName,
      fullName: `${firstName} ${familyName}`,
      emailAddress: faker.internet.email()
    }

    const createUser = new CreateUser(user);
    const response  = await createUser.execute();

    expect(CrmGateway).toHaveBeenCalledTimes(1);
    expect(response).toEqual({body: crmId, error: undefined})
  })
})
