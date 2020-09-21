import CrmGateway, {
  CrmGatewayInterface,
  GetOfficersByAreaIdResponse,
  OfficerInterface,
} from '../../gateways/crmGateway';

interface GetUsersResponse {
  body?: OfficerInterface[];
  error?: number;
}

interface GetUsersInterface {
  execute(): Promise<GetUsersResponse>;
}

class GetUsers implements GetUsersInterface {
  crmGateway: CrmGatewayInterface;
  areaId: number;

  constructor(areaId: number) {
    this.crmGateway = new CrmGateway();
    this.areaId = areaId;
  }

  public async execute(): Promise<any> {
    // public async execute(): Promise<GetUsersResponse> {
    // const response: GetOfficersByAreaIdResponse = await this.crmGateway.getOfficersByAreaId(
    //   this.areaId
    // );

    const response = {
      body: [
        {
          name: 'Damian Donnelly',
          id: '1534af2a-ca41-ea11-a812-000d3a0ba110',
          patchid: '99dd7677-7154-e811-8126-70106faaf8c1',
        },
        {
          name: 'Ebenezer Newton-Mensah',
          id: '00f357b5-6254-e811-8126-70106faaf8c1',
          patchid: 'a521e922-7154-e811-8126-70106faaf8c1',
        },
        {
          name: 'Elli Papamichael',
          id: '6988b350-6354-e811-8126-70106faa6a31',
          patchid: 'ec130b35-7154-e811-8126-70106faaf8c1',
        },
        {
          name: 'Fahema Aktar',
          id: '2d11b8ba-6354-e811-8120-e0071b7fe041',
          patchid: '4401789b-7154-e811-8126-70106faaf8c1',
        },
        {
          name: 'Jackson Caines',
          id: '13c49376-6454-e811-8120-e0071b7fe041',
          patchid: '242e79a7-7154-e811-8126-70106faaf8c1',
        },
        {
          name: 'John Cundall',
          id: '6203f182-6554-e811-8126-70106faa6a31',
          patchid: 'bb967e89-7154-e811-8126-70106faaf8c1',
        },
        {
          name: 'Rachel King',
          id: 'fb22fbfc-c941-ea11-a812-000d3a0bad7c',
          patchid: '3cff91dc-9a0b-ea11-a811-000d3a0ba151',
        },
        {
          name: 'Surma Begum',
          id: '166830c4-2b9f-ea11-a812-000d3a0ba110',
          patchid: 'ac9bb5ce-9a0b-ea11-a811-000d3a0ba151',
        },
        {
          name: 'Tuomo Karki',
          id: '1ff0422f-1db2-ea11-a812-000d3a0ba110',
          patchid: 'cd1b725e-d9af-ea11-a812-000d3a0ba110',
        },
      ],
      error: undefined,
    };

    switch (response.error) {
      case undefined:
        if (response.body === undefined || response.body[0] === undefined) {
          return { body: undefined, error: 404 };
        }
        return {
          body: response.body[0],
          error: undefined,
        };
      case 'NotAuthorised':
        return {
          body: undefined,
          error: 401,
        };
      default:
        return {
          body: undefined,
          error: 500,
        };
    }
  }
}

export default GetUsers;
