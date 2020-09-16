import crmToPatchDetails, {
  PatchDetailsInterface,
} from '../mappings/crmToPatchDetails';
import faker from 'faker';

describe('crmToPatchDetails', () => {
  it('returns a valid patch details for an officer when given a crm response', () => {
    const crmResponse = {
      '@odata.context': faker.random.word(),
      value: [
        {
          hackney_name: faker.random.word(),
          hackney_estateofficerid: faker.random.uuid(),
          'officermanagerId@OData.Community.Display.V1.FormattedValue': faker.random.word(),
          officerManagerId: faker.random.uuid(),
          officerPatchId: faker.random.uuid(),
          'officerAreaId@OData.Community.Display.V1.FormattedValue': faker.random.uuid(),
          officerAreaId: faker.random.number(),
          officerPatchName: faker.random.word(),
          areadId: undefined,
          managerId: undefined,
        },
      ],
    };

    const convertedPatchDetails: PatchDetailsInterface = crmToPatchDetails(
      crmResponse
    );

    expect(convertedPatchDetails.officerName).toEqual(
      crmResponse.value[0].hackney_name
    );
    expect(convertedPatchDetails.officerId).toEqual(
      crmResponse.value[0].hackney_estateofficerid
    );
    expect(convertedPatchDetails.areaManagerId).toEqual(
      crmResponse.value[0].officerManagerId
    );

    expect(convertedPatchDetails.patchId).toEqual(
      crmResponse.value[0].officerPatchId
    );
    expect(convertedPatchDetails.areaId).toEqual(
      crmResponse.value[0].officerAreaId
    );
    expect(convertedPatchDetails.patchName).toEqual(
      crmResponse.value[0].officerPatchName
    );
    expect(convertedPatchDetails.areaId).toEqual(
      crmResponse.value[0].officerAreaId
    );
    expect(convertedPatchDetails.areaManagerId).toEqual(
      crmResponse.value[0].officerManagerId
    );
  });

  it('returns a valid area details for a manager when given a crm response', () => {
    const crmResponse = {
      '@odata.context': faker.random.word(),
      value: [
        {
          hackney_name: faker.random.word(),
          hackney_estateofficerid: faker.random.uuid(),
          'officermanagerId@OData.Community.Display.V1.FormattedValue': undefined,
          officerManagerId: undefined,
          officerPatchId: undefined,
          officerAreaId: undefined,
          officerPatchName: undefined,
          'officerAreaId@OData.Community.Display.V1.FormattedValue': undefined,
          'areaId@OData.Community.Display.V1.FormattedValue': faker.random.word(),
          areaId: faker.random.number(),
          managerId: faker.random.uuid(),
        },
      ],
    };

    const convertedPatchDetails: PatchDetailsInterface = crmToPatchDetails(
      crmResponse
    );
    expect(convertedPatchDetails.patchId).toEqual(
      crmResponse.value[0].officerPatchId
    );

    expect(convertedPatchDetails.patchName).toEqual(undefined);

    expect(convertedPatchDetails.officerName).toEqual(
      crmResponse.value[0].hackney_name
    );

    expect(convertedPatchDetails.officerId).toEqual(
      crmResponse.value[0].hackney_estateofficerid
    );

    expect(convertedPatchDetails.isManager).toEqual(true);

    expect(convertedPatchDetails.areaManagerId).toEqual(
      crmResponse.value[0].managerId
    );

    expect(convertedPatchDetails.patchId).toEqual(undefined);

    expect(convertedPatchDetails.areaId).toEqual(crmResponse.value[0].areaId);
  });
});
