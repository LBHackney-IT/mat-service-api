import crmToPatchDetails from '../mappings/crmToPatchDetails';
import faker from 'faker';

describe('crmToPatchDetails', () => {
  it('returns a valid patch details when given an crm response', () => {
    const crmResponse = {
      '@odata.context': 'crm context',
      value: [
        {
          '@odata.etag': 'W/"105032638"',
          hackney_name: 'SD9',
          '_hackney_patchid_value@OData.Community.Display.V1.FormattedValue': `${faker.name.firstName()} ${faker.name.lastName()}`,
          _hackney_patchid_value: faker.random.uuid(),
          hackney_estateofficerpatchid: faker.random.uuid(),
        },
      ],
    };

    const convertedPatchDetails = crmToPatchDetails(crmResponse);

    expect(convertedPatchDetails.officername).toEqual(
      crmResponse.value[0][
        '_hackney_patchid_value@OData.Community.Display.V1.FormattedValue'
      ]
    );
    expect(convertedPatchDetails.patchid).toEqual(
      crmResponse.value[0].hackney_estateofficerpatchid
    );
    expect(convertedPatchDetails.patchname).toEqual(
      crmResponse.value[0].hackney_name
    );
  });
});
