export interface TenancyManagementInteraction {
  interactionId?: string;
  contactId: string;
  enquirySubject: string;
  estateOfficerId: string;
  subject: string;
  adviceGiven?: string;
  estateOffice?: string;
  source: string;
  natureofEnquiry: string;
  estateOfficerName: string;
  officerPatchId: string;
  areaName: number;
  managerId?: string;
  assignedToPatch?: boolean;
  assignedToManager?: boolean;
  transferred?: boolean;
  serviceRequest: {
    id?: string;
    title: string;
    description: string;
    contactId: string;
    parentCaseId?: string;
    subject: string;
    createdDate?: string;
    enquiryType?: string;
    ticketNumber?: string;
    requestCallback?: boolean;
    transferred?: boolean;
    createdBy?: string;
    childRequests: [] | undefined;
  };
  status?: number;
  parentInteractionId?: string;
  processType: number;
  householdId?: string | null;
  processStage?: number;
  reasonForStartingProcess?: number;
}
