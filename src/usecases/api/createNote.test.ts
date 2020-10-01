import { use } from 'chai';
import { V1MatAPIGatewayInterface } from '../../gateways/v1MatAPIGateway';
import { NewNote } from '../../interfaces/note';
import MockCreateNote from '../../tests/helpers/generateCreateNote';
import { mockV1MatApiGateway } from '../../tests/helpers/mockGateways';
import CreateTaskNote from './createNote';

describe('CreateNote', () => {
  let usecase: CreateTaskNote;
  let dummyGateway: V1MatAPIGatewayInterface;
  let dummyCallData: NewNote;

  beforeEach(() => {
    dummyCallData = MockCreateNote();
    dummyGateway = mockV1MatApiGateway();
    usecase = new CreateTaskNote({ gateway: dummyGateway });
  });

  it('Returns true when a success response is received from the gateway', async () => {
    dummyGateway.createTaskNote.mockResolvedValue(Promise.resolve({}));
    const result = await usecase.execute(dummyCallData);
    expect(dummyGateway.createTaskNote).toHaveBeenCalledWith(dummyCallData);
    expect(result).toEqual(true);
  });

  it('Returns false when an error response is received from the gateway', async () => {
    dummyGateway.createTaskNote.mockResolvedValue(Promise.reject(new Error()));
    const result = await usecase.execute(dummyCallData);
    expect(dummyGateway.createTaskNote).toHaveBeenCalledWith(dummyCallData);
    expect(result).toEqual(false);
  });
});
