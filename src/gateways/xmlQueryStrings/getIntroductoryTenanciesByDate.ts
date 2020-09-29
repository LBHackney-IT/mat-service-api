export default (date: Date): string => {
  return `
<fetch>
  <entity name='account'>
    <filter type='and'>
      <condition attribute='createdon' operator='gt' value='${date.toISOString()}'/>
      <condition attribute='housing_tenure' operator='eq' value='INT'/>
    </filter>
    <attribute name='accountid' />
    <attribute name='createdon' />
    <attribute name='housing_tenure' />
    <attribute name='housing_tag_ref' />
    <attribute name='housing_house_ref' />
    <attribute name='hackney_household_accountid' />
    <link-entity name='contact' from='parentcustomerid' to='accountid' link-type='inner' >
      <attribute name='fullname' />
      <attribute name='contactid' />
      <attribute name='address1_composite' />
      <attribute name='hackney_responsible' />
      <attribute name='hackney_personno' />
      <attribute name='hackney_title' />
      <attribute name='firstname' />
      <attribute name='lastname' />
      <attribute name='address1_postalcode' />
      <attribute name='address1_line3' />
      <attribute name='address1_line1' />
      <attribute name='address1_line2' />
      <link-entity name='hackney_propertyareapatch' from='hackney_postcode' to='address1_postalcode' type='inner'>
        <attribute name='hackney_estateaddress' />
        <attribute name='hackney_neighbourhoodofficedesc' />
        <attribute name='hackney_areaname' />
        <attribute name='hackney_managerpropertypatchid' />
        <link-entity name='hackney_estateofficerpatch' from='hackney_estateofficerpatchid' to='hackney_estateofficerpropertypatchid' link-type='inner' >
          <attribute name='hackney_estateofficerpatchid' />
          <link-entity name='hackney_estateofficer' from='hackney_estateofficerid' to='hackney_patchid' link-type='inner' >
            <attribute name='hackney_estateofficerid' alias='estateOfficerId' />
            <attribute name='hackney_name' alias='OfficerFullName' />
            <attribute name='hackney_lastname' alias='OfficerLastName' />
            <attribute name='hackney_firstname' alias='OfficerFirstName' />
            <attribute name='hackney_emailaddress' alias='OfficerEmailAddress' />
          </link-entity>
        </link-entity>
      </link-entity>
    </link-entity>
    <order attribute="createdon" descending="false" />
  </entity>
</fetch>`;
};
