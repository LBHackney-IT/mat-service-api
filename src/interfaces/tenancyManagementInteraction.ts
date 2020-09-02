export interface TenancyManagementInteraction {
  interactionId: string | undefined;
  contactId: string;
  enquirySubject: string;
  estateOfficerId: string;
  subject: string;
  adviceGiven: string | undefined;
  estateOffice: string | undefined;
  source: string;
  natureofEnquiry: string;
  estateOfficerName: string;
  officerPatchId: string;
  areaName: number;
  managerId: string | undefined;
  assignedToPatch: boolean | undefined;
  assignedToManager: boolean | undefined;
  transferred: boolean | undefined;
  serviceRequest: {
    id: string | undefined;
    title: string;
    description: string;
    contactId: string;
    parentCaseId: string | undefined;
    subject: string;
    createdDate: string | undefined;
    enquiryType: string | undefined;
    ticketNumber: string | undefined;
    requestCallback: boolean | undefined;
    transferred: boolean | undefined;
    createdBy: string | undefined;
    childRequests: [] | undefined;
  };
  status: number | undefined;
  parentInteractionId: string | undefined;
  processType: number | undefined;
  householdId: string | undefined;
  processStage: number | undefined;
  reasonForStartingProcess: number | undefined;
}
