import { Tenancy } from '../interfaces/tenancy';
import { TenancyManagementInteraction } from '../interfaces/tenancyManagementInteraction';

export const tenancyToITVTask = (
  tenancy: Tenancy
): TenancyManagementInteraction => {
  return {
    contactId: tenancy.contacts[0].contactId,
    enquirySubject: '100000060',
    estateOfficerId: tenancy.officerId,
    subject: 'c1f72d01-28dc-e711-8115-70106faa6a11',
    source: '1',
    natureofEnquiry: '15',
    estateOfficerName: tenancy.officerName,
    officerPatchId: tenancy.patchId,
    areaName: tenancy.areaId,
    householdId: tenancy.householdId,
    serviceRequest: {
      id: undefined,
      title: 'Initial tenancy visit',
      description: 'Starting an initial tenancy visit',
      contactId: tenancy.contacts[0].contactId,
      parentCaseId: undefined,
      createdDate: undefined,
      enquiryType: undefined,
      ticketNumber: undefined,
      requestCallback: undefined,
      transferred: undefined,
      createdBy: undefined,
      childRequests: undefined,
      subject: 'c1f72d01-28dc-e711-8115-70106faa6a11',
    },
    processType: 1,
  };
};
