import getCrmUserGuid from "./getCrmUserGuid";
import axios from "axios";
import faker from "faker";
jest.mock("axios");

describe("getCrmUserGuid", () => {
  beforeEach(() => {
    axios.mockClear();
  })

  it("returns undefined when no env var is set", async () => {
    const response = await getCrmUserGuid(faker.internet.email());

    expect(response).toEqual(undefined);
  })

  it("successfully fetches data from an API", async () => {
    process.env.NEXT_PUBLIC_API_PATH = "http://localhost:3000/api";
    const guid = faker.lorem.word()

    axios.get.mockResolvedValue(guid);

    const response = await getCrmUserGuid(faker.internet.email());

    expect(response).toEqual(guid);
  })
})
