import { v1MatAPIGateway } from '../../gateways';
import { CrmGatewayInterface } from '../../gateways/crmGateway';
import { V1MatAPIGatewayInterface } from '../../gateways/v1MatAPIGateway';
import HackneyToken from '../../interfaces/hackneyToken';
import { NewNote } from '../../interfaces/note';
import { Task } from '../../interfaces/task';
import MockCreateNote from '../../tests/helpers/generateCreateNote';
import MockHackneyToken from '../../tests/helpers/generateHackneyToken';
import MockTask from '../../tests/helpers/generateTask';
import {
  mockCrmGateway,
  mockV1MatApiGateway,
} from '../../tests/helpers/mockGateways';
import CreateNote, { CreateNoteInterface } from './createNote';

describe('CreateNote', () => {
  let usecase: CreateNoteInterface;
  let v1MatAPIGateway: V1MatAPIGatewayInterface;
  let crmGateway: CrmGatewayInterface;
  let dummyTask: Task;
  let dummyCallData: NewNote;
  let dummyHackneyToken: HackneyToken;

  beforeEach(() => {
    dummyCallData = MockCreateNote();
    dummyHackneyToken = MockHackneyToken();
    dummyTask = MockTask();
    v1MatAPIGateway = mockV1MatApiGateway();
    crmGateway = mockCrmGateway();
    crmGateway.getUserId = () => Promise.resolve({ body: 'fakeUserId' });
    crmGateway.getTask = () => Promise.resolve({ body: dummyTask });
    usecase = new CreateNote(v1MatAPIGateway, crmGateway);
  });

  it('Creates the note with the correct data', async () => {
    const result = await usecase.execute(
      'fakeInteractionId',
      dummyHackneyToken,
      'this is a note'
    );

    expect(result).toEqual(true);
    expect(v1MatAPIGateway.createTaskNote).toHaveBeenCalledWith({
      ServiceRequest: {
        Id: dummyTask.incidentId,
        description: 'this is a note',
        requestCallback: false,
      },
      estateOfficerId: 'fakeUserId',
      estateOfficerName: dummyHackneyToken.name,
      interactionId: 'fakeInteractionId',
      status: 1,
    });
  });

  it('Returns true when a success response is received from the gateway', async () => {
    v1MatAPIGateway.createTaskNote.mockResolvedValue(Promise.resolve({}));
    const result = await usecase.execute(
      'fakeInteractionId',
      dummyHackneyToken,
      'this is a note'
    );
    expect(result).toEqual(true);
  });

  it('Returns false when an error response is received from the gateway', async () => {
    v1MatAPIGateway.createTaskNote.mockResolvedValue(
      Promise.reject(new Error())
    );
    const result = await usecase.execute(
      'fakeInteractionId',
      dummyHackneyToken,
      'this is a note'
    );
    expect(result).toEqual(new Error());
  });
});
