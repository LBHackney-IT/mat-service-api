export default (tagRef: string): string => `
<fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="false">
  <entity name="contact">
    <attribute name="contactid" />
    <attribute name="hackney_personno" />
    <attribute name="hackney_title" />
    <attribute name="firstname" />
    <attribute name="lastname" />
    <attribute name="birthdate" />
    <attribute name="emailaddress1" />
    <attribute name="address1_line1" />
    <attribute name="address1_line2" />
    <attribute name="address1_line3" />
    <attribute name="address1_postalcode" />
    <attribute name="telephone1" />
    <attribute name="telephone2" />
    <attribute name="telephone3" />
    <attribute name="hackney_disabled" />
    <attribute name="hackney_relationship" />
    <attribute name="hackney_responsible" />
    <order attribute="fullname" descending="false" />
    <filter>
      <condition entityname="hackney_household" attribute="hackney_tag_ref" operator="eq" value="${tagRef}" />
    </filter>
    <link-entity name="hackney_household" from="hackney_householdid" to="hackney_household_contactid" >
      <attribute name="hackney_householdid" />
      <attribute name="hackney_tag_ref" />
    </link-entity>
  </entity>
</fetch>`;
