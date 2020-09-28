export default (officerId: string): string => `
<fetch top='1'>
    <entity name='hackney_estateofficer' from='hackney_estateofficerid' to='hackney_officerloginid'>
      <attribute name='hackney_estateofficerid' />
      <attribute name='hackney_name' />
      <filter type='and'>
        <condition attribute='hackney_estateofficerid' operator='eq' value='${officerId}' />
      </filter>
      <link-entity name='hackney_estateofficerpatch' from='hackney_patchid' to='hackney_estateofficerid' link-type='outer'>
        <attribute name='hackney_estateofficerpatchid' alias='officerPatchId'/>
        <attribute name='hackney_name' alias='officerPatchName'/>
        <link-entity name='hackney_propertyareapatch' from='hackney_estateofficerpropertypatchid' to='hackney_estateofficerpatchid' link-type='outer'>
          <attribute name='hackney_areaname' alias='officerAreaId' />
          <attribute name='hackney_managerpropertypatchid' alias='officerManagerId'/>
        </link-entity>
      </link-entity>
      <link-entity name='hackney_estatemanagerarea' from='hackney_managerareaid' to='hackney_estateofficerid' link-type='outer'>
        <attribute name='hackney_estatemanagerareaid' alias='managerId' />
          <link-entity name='hackney_propertyareapatch' from='hackney_managerpropertypatchid' to='hackney_estatemanagerareaid' link-type='outer'>
            <attribute name='hackney_areaname' alias='areaId'/>
          </link-entity>
      </link-entity>
    </entity>
</fetch>`;
