import userMappingExists from "./userMappingExists";
import axios from "axios";
import faker from "faker";
jest.mock("axios");

describe("userMappingExists", () => {
  beforeEach(() => {
    axios.mockClear();
  })

  it("returns false when no env var is set", async () => {
    const response = await userMappingExists(faker.internet.email());

    expect(response).toEqual(false);
  })

  it("successfully fetches data from an API", async() => {
    process.env.NEXT_PUBLIC_API_PATH = "http://localhost:3000/api";

    axios.get.mockResolvedValue({data: {body: true}});

    const response = await userMappingExists(faker.internet.email());

    expect(response).toEqual(true);
  })
})
