export interface TenancyManagementInteraction {
  interactionId: string;
  contactId: string;
  enquirySubject: string;
  estateOfficerId: string;
  subject: string;
  adviceGiven: string;
  estateOffice: string;
  source: string;
  natureofEnquiry: string;
  estateOfficerName: string;
  officerPatchId: string;
  areaName: string;
  managerId: string;
  assignedToPatch: true;
  assignedToManager: true;
  transferred: true;
  serviceRequest: {
    id: string;
    title: string;
    description: string;
    contactId: string;
    parentCaseId: string;
    subject: string;
    createdDate: string;
    enquiryType: string;
    ticketNumber: string;
    requestCallback: true;
    transferred: true;
    createdBy: string;
    childRequests: [
      null
    ]
  };
  status: 0;
  parentInteractionId: string;
  processType: string;
  householdId: string;
  processStage: 0;
  reasonForStartingProcess: 0
}
