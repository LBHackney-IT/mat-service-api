import { tenancyToITVTask } from "./tenancyToITVTask";
import MockTenancy from "../tests/helpers/generateTenancy";
import { TenancyManagementInteraction } from "../interfaces/tenancyManagementInteraction";

describe("tenancyToITVTask", () => {
  it("returns a valid ITV task when given a Tenancy", () => {
    const tenancy = MockTenancy(true);

    const ITVTask: TenancyManagementInteraction = tenancyToITVTask(tenancy);

    expect(ITVTask.enquirySubject).toEqual('100000060');
    expect(ITVTask.estateOfficerId).toEqual(tenancy.officerId);
    expect(ITVTask.subject).toEqual('c1f72d01-28dc-e711-8115-70106faa6a11');
    expect(ITVTask.source).toEqual('1');
    expect(ITVTask.natureofEnquiry).toEqual('15');
    expect(ITVTask.estateOfficerName).toEqual(tenancy.officerName);
    expect(ITVTask.officerPatchId).toEqual(tenancy.patchId);
    expect(ITVTask.areaName).toEqual(tenancy.areaId);
    expect(ITVTask.processType).toEqual(1);
    expect(ITVTask.serviceRequest.title).toEqual('Initial tenancy visit');
    expect(ITVTask.serviceRequest.description).toEqual('Starting an initial tenancy visit');
    expect(ITVTask.serviceRequest.contactId).toEqual(tenancy.contacts[0].contactId);
    expect(ITVTask.serviceRequest.subject).toEqual('c1f72d01-28dc-e711-8115-70106faa6a11');

  })
})
