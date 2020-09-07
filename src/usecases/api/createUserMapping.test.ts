import MatPostgresGateway from "../../gateways/matPostgresGateway";
import faker from "faker";
import CreateUserMapping from "./createUserMapping";

jest.mock("../../gateways/matPostgresGateway");

describe("createUserMapping", () => {
  beforeEach(() => {
    MatPostgresGateway.mockClear();
  })

  it("Returns error undefined if the creation was successuly", async () => {
    MatPostgresGateway.mockImplementationOnce(() => {
      return {
        createUserMapping: () => ({
          error: undefined
        })
      }
    })

    const emailAddress = faker.internet.email()
    const randomUserMapping = {
      name: faker.lorem.word(),
      emailAddress,
      usercrmid: faker.lorem.word(),
      googleId: faker.lorem.word(),
    }

    const createUserMapping = new CreateUserMapping(randomUserMapping);
    const response = await createUserMapping.execute();

    expect(MatPostgresGateway).toHaveBeenCalledTimes(1);
    expect(response).toEqual({error: undefined});
  })

  it("Returns a 500 error if there is an issue with the creation", async () => {
    MatPostgresGateway.mockImplementationOnce(() => {
      return {
        createUserMapping: () => ({
          error: 500
        })
      }
    })

    const randomUserMapping = {
      name: faker.lorem.word(),
      usercrmid: faker.lorem.word(),
      googleId: faker.lorem.word(),
      emailAddress: undefined
    }

    const createUserMapping = new CreateUserMapping(randomUserMapping);
    const response = await createUserMapping.execute();

    expect(MatPostgresGateway).toHaveBeenCalledTimes(1);
    expect(response).toEqual({error: 500});
  })
})
