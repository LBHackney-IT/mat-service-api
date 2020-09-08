import createUserMapping from "./createUserMapping";
import axios from "axios";
import faker from "faker";
jest.mock("axios");

describe("createUserMapping", () => {
  beforeEach(() => {
    axios.mockClear();
  })

  const userMapping = {
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    emailAddress: faker.internet.email(),
    usercrmid: faker.lorem.word(),
    googleId: faker.lorem.word(),
  }

  it("returns false when no env var is set", async () => {
    const response = await createUserMapping(userMapping);

    expect(response).toEqual(false);
  })

  it("returns true on a success response from the API", async () => {
    process.env.NEXT_PUBLIC_API_PATH = "http://localhost:3000/api";

    axios.post.mockResolvedValue(true);

    const response = await createUserMapping(userMapping);

    expect(response).toEqual(true);
  })

  it("returns false on a fail response from the API", async () => {
    process.env.NEXT_PUBLIC_API_PATH = "http://localhost:3000/api";

    axios.post.mockImplementationOnce(() => Promise.reject(new Error()));

    const response = await createUserMapping(userMapping);

    expect(response).toEqual(false);
  })
})
