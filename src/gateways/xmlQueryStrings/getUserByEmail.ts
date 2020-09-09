const getUserByEmail = (emailAddress: string) => {
  return `<fetch>
      <entity name="hackney_estateofficer" >
        <attribute name="hackney_estateofficerid" />
        <filter>
          <condition attribute="hackney_emailaddress" operator="eq" value="${emailAddress}" />
        </filter>
      </entity>
    </fetch>`;
};

export default getUserByEmail;
