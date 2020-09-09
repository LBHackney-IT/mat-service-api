import mockApiTRAResponse from '../tests/helpers/generateApiTRAResponse';
import apiTRAToUiTRA from './apiTRAToUiTRA';
import { TRA } from '../interfaces/tra';

describe('apiTRAToUiTRA', () => {
  it('returns a valid task when given an apiResponse', () => {
    const apiResponse = mockApiTRAResponse();

    const convertedTRA: TRA[] = apiTRAToUiTRA(apiResponse.data);

    let traIndex = 0;

    convertedTRA.forEach((tra: TRA) => {
      const traValue = apiResponse.data[traIndex];

      expect(tra.id).toEqual(traValue.traid);
      expect(tra.name).toEqual(traValue.name);
      expect(tra.patchid).toEqual(traValue.patchcrmid);
    });
  });
});
