export default (uprn: string) => {
  return `
  <fetch top="50" >
    <entity name="contact" >
      <attribute name="contactid" />
      <attribute name="emailaddress1" />
      <attribute name="hackney_uprn" />
      <attribute name="address1_line1" />
      <attribute name="address1_line2" />
      <attribute name="address1_line3" />
      <attribute name="firstname" />
      <attribute name="lastname" />
      <attribute name="hackney_larn" />
      <attribute name="address1_addressid" />
      <attribute name="address2_addressid" />
      <attribute name="address3_addressid" />
      <attribute name="telephone1" />
      <attribute name="telephone2" />
      <attribute name="telephone3" />
      <attribute name="hackney_cautionaryalert" />
      <attribute name="hackney_propertycautionaryalert" />
      <attribute name="housing_house_ref" />
      <attribute name="hackney_title" />
      <attribute name="address1_composite" />
      <attribute name="address1_name" />
      <attribute name="address1_postalcode" />
      <attribute name="birthdate" />
      <attribute name="hackney_hackneyhomesid" />
      <attribute name="hackney_membersid" />
      <attribute name="hackney_personno" />
      <attribute name="hackney_relationship" />
      <attribute name="hackney_household_contactid" />
      <filter>
        <condition attribute="hackney_uprn" operator="eq" value="${uprn}" />
      </filter>
    </entity>
  </fetch>`;
};
