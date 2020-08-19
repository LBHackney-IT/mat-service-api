import getTasks from "./getTasks";
import axios from "axios";
import mockApiTaskResponse from "../../tests/helpers/generateApiTaskResponse";
import apiTaskToUiTask from "../../mappings/apiTaskToUiTask";
jest.mock('axios');

describe("getTasks", () => {
  beforeEach(() => {
    axios.mockClear();
  })

  it("returns an empty array when no env var is set", async () => {
    const response = await getTasks();

    expect(response).toEqual([]);
  })

  it('successfully fetches data from an API', async () => {
    process.env.NEXT_PUBLIC_API_PATH = "http://localhost:3000/api"

    const data = mockApiTaskResponse()

    axios.get.mockResolvedValue(data);

    const response  = await getTasks();

    expect(response).toEqual(apiTaskToUiTask(data.data));
  })
})