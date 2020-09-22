const getNotesForTaskById = (taskId: string) => {
  return `
  <fetch>
    <entity name="hackney_tenancymanagementinteractions">
      <filter>
        <condition attribute="hackney_tenancymanagementinteractionsid" operator="eq" value="${taskId}"/>
      </filter>
      <link-entity name='incident' from='incidentid' to='hackney_incidentid' link-type='outer'>
        <attribute name='housing_requestcallback' />
        <attribute name='incidentid' />
          <link-entity name='annotation' from='objectid' to='incidentid' link-type='outer' >
            <attribute name='subject' />
            <attribute name='createdby' />
            <attribute name='notetext' />
            <attribute name='createdon' />
            <attribute name='annotationid' />
          </link-entity>
      </link-entity>
    </entity>
  </fetch>
  `;
};

export default getNotesForTaskById;
