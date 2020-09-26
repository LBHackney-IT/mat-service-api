export default (tag_ref: string): string => `
<fetch>
   <entity name="hackney_tenancymanagementinteractions">
      <attribute name="statecode" />
      <attribute name="createdon" />
      <attribute name="hackney_enquirysubject" />
      <attribute name="hackney_processtype" />
      <filter type="and">
         <condition attribute="hackney_household_interactionidname" value="${tag_ref}" operator="eq" />
      </filter>
   </entity>
</fetch>`;
