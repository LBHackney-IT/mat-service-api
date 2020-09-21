export default (uprn: string) => {
  return `
  <fetch>
  <entity name='hackney_propertyareapatch' >
      <attribute name='hackney_areaname' />
      <attribute name='hackney_ward' />
      <attribute name='hackney_estateofficerpropertypatchid' />
      <filter type='and' >
          <condition attribute='hackney_llpgref' operator='eq' value='${uprn}' />
      </filter>
      <link-entity name='hackney_estateofficerpatch' from='hackney_estateofficerpatchid' to='hackney_estateofficerpropertypatchid' link-type='outer' >
          <link-entity name='hackney_estateofficer' from='hackney_estateofficerid' to='hackney_patchid' link-type='outer' >
              <attribute name='hackney_name' alias='OfficerFullName' />
          </link-entity>
      </link-entity>
      <link-entity name='hackney_estatemanagerarea' from='hackney_estatemanagerareaid' to='hackney_managerpropertypatchid' link-type='outer' >
          <link-entity name='hackney_estateofficer' from='hackney_estateofficerid' to='hackney_managerareaid' link-type='outer' >
              <attribute name='hackney_name' alias='ManagerFullName' />
          </link-entity>
      </link-entity>
  </entity>
</fetch>`;
};
