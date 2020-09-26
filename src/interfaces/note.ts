export interface Note {
  text: string;
  createdBy: string;
  createdOn: string;
  incidentId: string;
}

export interface NewNote {
  interactionId: string; //TMI ID
  estateOfficerName: string; //officer's full name
  ServiceRequest: {
    description: string; //note
    requestCallback: false; //leave as false for now, call backs need to be supported later/separately
    Id: string; //CRM incident/case Id
  };
  status: 1; //this will update the ticket, important to leave as 1
  estateOfficerId: string; //officer's CRM id
}

export type CrmNote = {
  '@odata.etag': string;
  hackney_tenancymanagementinteractionsid: string;
  'incident1_x002e_housing_requestcallback@OData.Community.Display.V1.FormattedValue': string;
  incident1_x002e_housing_requestcallback: boolean;
  annotation2_x002e_notetext: string;
  //notetext is the body text for the note
  'annotation2_x002e_createdby@OData.Community.Display.V1.FormattedValue': string;
  //createdBy OData is the name of the user that created the note
  annotation2_x002e_createdby: string;
  'annotation2_x002e_createdon@OData.Community.Display.V1.FormattedValue': string;
  //createdOn OData version is in the format of DD/MM/YYYY HH:MM AM/PM
  annotation2_x002e_createdon: string;
  //createdOn is in the format YYYY-MM-DDTHH:MM:SSZ
  incident1_x002e_incidentid: string;
  annotation2_x002e_annotationid: string;
};
