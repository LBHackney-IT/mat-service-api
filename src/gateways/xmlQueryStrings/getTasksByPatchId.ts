const getTasksByPatchIdQuery = (patchId: string) => { 

return(
        `
        <fetch top="10">
        <entity name="hackney_tenancymanagementinteractions">
            <attribute name="hackney_contactid" />
            <attribute name="hackney_handleby" />
            <attribute name="hackney_areaname" />
            <attribute name="hackney_name" />
            <attribute name="statecode" />
            <attribute name="hackney_estateofficerpatchid" />
            <attribute name="hackney_natureofenquiry" />
            <attribute name="createdon" />
            <attribute name="hackney_estateofficer_createdbyid" />
            <attribute name="hackney_estateofficer_updatedbyid" />
            <attribute name="hackney_tenancymanagementinteractionsid" />
            <attribute name="hackney_enquirysubject" />
            <attribute name="hackney_managerpropertypatchid" />
            <attribute name="hackney_contactid" />
            <attribute name="hackney_handlebyname" />
            <attribute name="hackney_incidentid" />
            <attribute name="hackney_transferred" />
            <attribute name="hackney_process_stage" />
            <attribute name="hackney_household_interactionid" />
            <attribute name="hackney_parent_interactionid" />
            <attribute name="hackney_traid" />
            <attribute name="hackney_issuelocation" />
            <filter>
                <condition attribute="hackney_estateofficerpatchid" operator="eq" value="${patchId}" />
            </filter>
            <link-entity name="contact" from="contactid" to="hackney_contactid" link-type="outer">
                <attribute name="address1_line3" />
                <attribute name="address1_postalcode" />
                <attribute name="address1_city" />
                <attribute name="emailaddress1" />
                <attribute name="telephone1" />
                <attribute name="address1_line1" />
                <attribute name="hackney_larn" />
                <attribute name="hackney_uprn" />
                <attribute name="address1_line2" />
            </link-entity>
        </entity>
        </fetch>
        `
    )
}

export default getTasksByPatchIdQuery;