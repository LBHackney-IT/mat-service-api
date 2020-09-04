const getPatchIdByOfficerId = (officerId: string) => {
    return(
        `<fetch>
        <entity name='hackney_estateofficerpatch' >
          <attribute name='hackney_name' />
          <attribute name='hackney_patchid' />
          <filter>
            <condition attribute='hackney_patchid' operator='eq' value='${officerId}' />
          </filter>
          <link-entity name='hackney_estateofficer' from='hackney_estateofficerid' to='hackney_patchid' />
        </entity>
      </fetch>`
    )
}

export default getPatchIdByOfficerId;