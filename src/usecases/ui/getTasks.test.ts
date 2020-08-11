import getTasks from "./getTasks";
import axios from "axios";
import mockApiTaskResponse from "../../tests/helpers/generateApiTaskResponse";
import apiTaskToUiTask from "../../mappings/apiTaskToUiTask";
jest.mock('axios');

describe("getTasks", () => {
  beforeEach(() => {
    axios.mockClear();
  })

  it('successfully fetches data from an API', async () => {
    const data = mockApiTaskResponse()

    axios.get.mockResolvedValue(data);

    const response  = await getTasks();

    expect(response).toEqual(apiTaskToUiTask(data.data));
  })
})
