import { Officer } from './crmToOfficersDetails';
import MockCrmOfficersPerAreaIdResponse from '../tests/helpers/generateMockCrmOfficersPerAreaIdResponse';
import { crmToOfficersDetails } from '../mappings/crmToOfficersDetails';

describe('crmToOfficerDetails', () => {
  it('returns a valid list of officers when given an apiResponse', () => {
    const apiResponse = MockCrmOfficersPerAreaIdResponse();

    const convertedOfficers: Officer[] = crmToOfficersDetails(
      apiResponse
    ).sort((a, b) => (a.name > b.name ? 1 : -1));

    apiResponse.value.sort((a, b) =>
      a['estateOfficerId@OData.Community.Display.V1.FormattedValue'] >
      b['estateOfficerId@OData.Community.Display.V1.FormattedValue']
        ? 1
        : -1
    );

    let officerIndex = 0;

    convertedOfficers.forEach((officer: Officer) => {
      const officerValue = apiResponse.value[officerIndex];

      expect(officer.name).toEqual(
        officerValue[
          'estateOfficerId@OData.Community.Display.V1.FormattedValue'
        ]
      );
      expect(officer.id).toEqual(officerValue.estateOfficerId);
      expect(officer.patchid).toEqual(officerValue.estateOfficerPatchId);
      officerIndex += 1;
    });
  });
});
