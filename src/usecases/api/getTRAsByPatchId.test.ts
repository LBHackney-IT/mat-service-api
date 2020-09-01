import MatPostgresGateway from "../../gateways/matPostgresGateway";
import { TRA } from "../../interfaces/tra";
import GetTRAsByPatchId from "./getTRAsByPatchId";
import MockTRA from "../../tests/helpers/generateTRA";

jest.mock("../../gateways/matPostgresGateway");

describe("GetTRAsByPatchId", () => {
  beforeEach(() => {
    MatPostgresGateway.mockClear();
  })

  it("Returns a response when no errors are found", async () => {
    const mockResponse: TRA[] = [
      MockTRA(),
      MockTRA()
    ]

    MatPostgresGateway.mockImplementationOnce(() => {
      return {
        getTrasByPatchId: () => (
          {
            body: mockResponse,
            error: undefined
          }
        )
      }
    })

    const patchId = '9cd3823d-8653-e811-8126-70106faaf8c1'

    const getTRAsByPatchId = new GetTRAsByPatchId(patchId);
    const response = await getTRAsByPatchId.execute();

    expect(MatPostgresGateway).toHaveBeenCalledTimes(1);
    expect(response).toEqual({ body: mockResponse, error: undefined })
  })

  it("Returns a 500 error when errors are found", async () => {
    MatPostgresGateway.mockImplementationOnce(() => {
      return {
        getTRAsByPatchId: () => (
          {
            body: undefined,
            error: "Anything"
          }
        )
      }
    })
    const patchId = '9cd3823d-8653-e811-8126-70106faaf8c1'
    const getTRAsByPatchId = new GetTRAsByPatchId(patchId);
    const response = await getTRAsByPatchId.execute();

    expect(MatPostgresGateway).toHaveBeenCalledTimes(1);
    expect(response).toEqual({ body: undefined, error: 500 })
  })
})
