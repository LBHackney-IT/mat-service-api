// import GetTasks from "./getTasksByPatchId";
// import MaTDatabaseGateway from "../../gateways/matDatabaseGateway";
// import { TRA } from "../../interfaces/tra";
// import GetTRAsByPatchId from "./getTasksByPatchId";
// import MockTRA from "../../tests/helpers/generateTRA";

// jest.mock("../../gateways/matDatabaseGateway");

// describe("GetTRAs", () => {
//   beforeEach(() => {
//     MaTDatabaseGateway.mockClear();
//   })

//   it("Returns a response when no errors are found", async () => {
//     const mockResponse: TRA[] = [
//       MockTRA(),
//       MockTRA()
//     ]

//     MaTDatabaseGateway.mockImplementationOnce(() => {
//       return {
//         getTRAsByPatchId: () => (
//           {
//             body: mockResponse,
//             error: undefined
//           }
//         )
//       }
//     })

//     const patchId = '9cd3823d-8653-e811-8126-70106faaf8c1'

//     const getTRAsByPatchId = new GetTRAsByPatchId(patchId);
//     const response = await getTRAsByPatchId.execute();

//     expect(MaTDatabaseGateway).toHaveBeenCalledTimes(1);
//     expect(response).toEqual({ body: mockResponse, error: undefined })
//   })

//   it("Returns a 500 error when errors are found", async () => {
//     MaTDatabaseGateway.mockImplementationOnce(() => {
//       return {
//         getTRAsByPatchId: () => (
//           {
//             body: undefined,
//             error: "Anything"
//           }
//         )
//       }
//     })
//     const patchId = '9cd3823d-8653-e811-8126-70106faaf8c1'
//     const getTRAsByPatchId = new GetTRAsByPatchId(patchId);
//     const response = await getTRAsByPatchId.execute();

//     expect(MaTDatabaseGateway).toHaveBeenCalledTimes(1);
//     expect(response).toEqual({ body: undefined, error: 500 })
//   })

//   it("Returns a 401 error when errors is NotAuthorised", async () => {
//     MaTDatabaseGateway.mockImplementationOnce(() => {
//       return {
//         getTRAsByPatchId: () => (
//           {
//             body: undefined,
//             error: "NotAuthorised"
//           }
//         )
//       }
//     })
//     const patchId = '9cd3823d-8653-e811-8126-70106faaf8c1'
//     const getTRAsByPatchId = new GetTRAsByPatchId(patchId);
//     const response = await getTRAsByPatchId.execute();

//     expect(MaTDatabaseGateway).toHaveBeenCalledTimes(1);
//     expect(response).toEqual({ body: undefined, error: 401 })
//   })
  
// })
