import GetOfficerPatch from "./getOfficerPatch"
import faker from 'faker'

const mockEmailAddress = faker.internet.email()
const mockName = `${faker.name.firstName()} ${faker.name.lastName()}` 
const mockOfficerCrmId = faker.random.uuid()
const mockOfficerGoogleId = faker.random.uuid()
const mockPatchId = faker.random.uuid()
        
//dummy function for gateway methods that don't require implementation in tests
const dummyMock = jest.fn(async() => ({}))

describe("GetOfficerPatch", () => {
    it("Should retrieve user mapping details and get the id for the associated patch", async () =>{
        const getUserMapping = jest.fn(async() => (
        {
            body: {
                name: mockName,
                emailAddress: mockEmailAddress,
                usercrmid: mockOfficerCrmId,
                googleId: mockOfficerGoogleId,
            },
                error: undefined
            }
        ))

        const matPostgresGateway = {
            getTrasByPatchId: <jest.Mock>(dummyMock),
            getUserMapping: <jest.Mock>(getUserMapping),
            createUserMapping: <jest.Mock>(dummyMock)
        }

        const getPatchByOfficerId = jest.fn(async() => (
        {
            body: {
                officercrmid: mockOfficerCrmId,
                patchid: mockPatchId
            },
            error: undefined
        }))

        const crmGateway = {
            getPatchByOfficerId: <jest.Mock>(getPatchByOfficerId),
            getTasksForAPatch: <jest.Mock>(dummyMock),
            getTask: <jest.Mock>(dummyMock),
            getUser: <jest.Mock>(dummyMock),
            createUser: <jest.Mock>(dummyMock),
        };
        const emailAddress = mockEmailAddress;

        const getOfficerPatchUseCase = new GetOfficerPatch({emailAddress, crmGateway, matPostgresGateway});
        
        const response = await getOfficerPatchUseCase.execute();
        
        expect(getUserMapping).toHaveBeenCalledTimes(1);
        expect(getPatchByOfficerId).toHaveBeenCalledTimes(1);

        expect(response.body?.officerCrmId).toEqual(mockOfficerCrmId);
        expect(response.body?.patchId).toEqual(mockPatchId);
    })

    it("Should return undefined when user doesn't have a crmid", async () =>{
        //mock responce form mat gw
        const getUserMapping = jest.fn(async() => (
        {
            body: {
                name: mockName,
                emailAddress: mockEmailAddress,
                usercrmid: undefined,
                googleId: mockOfficerGoogleId,
            },
                error: undefined
            }
        ))

        const matPostgresGateway = {
            getTrasByPatchId: <jest.Mock>(dummyMock),
            getUserMapping: <jest.Mock>(getUserMapping),
            createUserMapping: <jest.Mock>(dummyMock)
        }

        //mock response from crm gw method
        const getPatchByOfficerId = jest.fn(async() => (
        {
            body: {
                officercrmid: undefined,
                patchid: undefined
            },
            error: undefined
        }))

        const crmGateway = {
            getPatchByOfficerId: <jest.Mock>(getPatchByOfficerId),
            getTasksForAPatch: <jest.Mock>(dummyMock),
            getTask: <jest.Mock>(dummyMock),
            getUser: <jest.Mock>(dummyMock),
            createUser: <jest.Mock>(dummyMock),
        };
        const emailAddress = mockEmailAddress;

        const getOfficerPatchUseCase = new GetOfficerPatch({emailAddress, crmGateway, matPostgresGateway});
        
        const response = await getOfficerPatchUseCase.execute();
        
        expect(getUserMapping).toHaveBeenCalledTimes(1);
        expect(getPatchByOfficerId).toHaveBeenCalledTimes(0);

        expect(response.body?.officerCrmId).toEqual(undefined);
        expect(response.body?.patchId).toEqual(undefined);
    })

    it("Should return undefined patch id when officer is not associated with a patch in CRM", async () =>{
        //mock responce form mat gw
        const getUserMapping = jest.fn(async() => (
        {
            body: {
                name: mockName,
                emailAddress: mockEmailAddress,
                usercrmid: mockOfficerCrmId,
                googleId: mockOfficerGoogleId,
            },
                error: undefined
            }
        ))

        const matPostgresGateway = {
            getTrasByPatchId: <jest.Mock>(dummyMock),
            getUserMapping: <jest.Mock>(getUserMapping),
            createUserMapping: <jest.Mock>(dummyMock)
        }

        //mock response from crm gw method
        const getPatchByOfficerId = jest.fn(async() => (
        {
            body: {
                officercrmid: mockOfficerCrmId,
                patchid: undefined
            },
            error: undefined
        }))

        const crmGateway = {
            getPatchByOfficerId: <jest.Mock>(getPatchByOfficerId),
            getTasksForAPatch: <jest.Mock>(dummyMock),
            getTask: <jest.Mock>(dummyMock),
            getUser: <jest.Mock>(dummyMock),
            createUser: <jest.Mock>(dummyMock),
        };
        const emailAddress = mockEmailAddress;

        const getOfficerPatchUseCase = new GetOfficerPatch({emailAddress, crmGateway, matPostgresGateway});
        
        const response = await getOfficerPatchUseCase.execute();
        
        expect(getUserMapping).toHaveBeenCalledTimes(1);
        expect(getPatchByOfficerId).toHaveBeenCalledTimes(1);

        expect(response.body?.officerCrmId).toEqual(mockOfficerCrmId);
        expect(response.body?.patchId).toEqual(undefined);
    })
})