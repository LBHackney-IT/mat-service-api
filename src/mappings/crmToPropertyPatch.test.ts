import crmToPropertyPatch from '../mappings/crmToPropertyPatch';
import faker from 'faker';

describe('crmToPropertyPatch', () => {
  it('returns a valid property patch when given a crm response', () => {
    const crmResponse = {
      '@odata.context': faker.random.word(),
      value: [
        {
          '@odata.etag': faker.random.word(),
          '_hackney_estateofficerpropertypatchid_value@OData.Community.Display.V1.FormattedValue': faker.random.word(),
          hackney_estateofficerpropertypatchid_value: faker.random.word(),
          hackney_propertyareapatchid: faker.random.word(),
          'hackney_areaname@OData.Community.Display.V1.FormattedValue': faker.random.word(),
          hackney_areaname: faker.random.number(),
          'hackney_ward@OData.Community.Display.V1.FormattedValue': faker.random.word(),
          hackney_ward: faker.random.number(),
          ManagerFullName: faker.random.word(),
          OfficerFullName: faker.random.word(),
        },
      ],
    };

    const convertedPropertyPatch = crmToPropertyPatch(crmResponse);

    expect(convertedPropertyPatch.patchCode).toEqual(
      crmResponse.value[0][
        '_hackney_estateofficerpropertypatchid_value@OData.Community.Display.V1.FormattedValue'
      ]
    );
    expect(convertedPropertyPatch.areaName).toEqual(
      crmResponse.value[0][
        'hackney_areaname@OData.Community.Display.V1.FormattedValue'
      ]
    );
    expect(convertedPropertyPatch.ward).toEqual(
      crmResponse.value[0][
        'hackney_ward@OData.Community.Display.V1.FormattedValue'
      ]
    );

    expect(convertedPropertyPatch.officerFullName).toEqual(
      crmResponse.value[0].OfficerFullName
    );
  });
});
