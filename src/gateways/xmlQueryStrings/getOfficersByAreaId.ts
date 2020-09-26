export default (areaId: number): string => `
<fetch mapping='logical' distinct='true'>
  <entity name='hackney_propertyareapatch'>
  <filter type='and'>
    <condition attribute='hackney_areaname' operator='eq' value='${areaId}'/>
  </filter>
  <link-entity name='hackney_estateofficerpatch' from='hackney_estateofficerpatchid' to='hackney_estateofficerpropertypatchid' link-type='inner' >
    <filter>
        <condition attribute = 'statecode' operator= 'eq' value = '0'/>
    </filter>
    <attribute name='hackney_patchid' alias='estateOfficerId' />
    <attribute name='hackney_estateofficerpatchid' alias='estateOfficerPatchId'/>
  </link-entity>  
  </entity>
</fetch>`;
