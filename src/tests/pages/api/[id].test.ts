import httpMocks from 'node-mocks-http';
import { NextApiRequest, NextApiResponse } from 'next';
import GetTask from '../../../pages/api/tasks/[id]';
import { Task } from '../../../interfaces/task';

describe('GetTask API', () => {
  it('Returns an error response if an invalid id is provided', () => {
    const req = httpMocks.createRequest<NextApiRequest>();
    const res = httpMocks.createResponse<NextApiResponse>();

    GetTask(req, res);

    expect(res.statusCode).toBe(400);
  });

  it('Returns a valid response if an valid id is provided', () => {
    const req = httpMocks.createRequest<NextApiRequest>({query: {id: 'ccb76f4c-87dc-4ef4-92e1-bf850c5efead'}});
    const res = httpMocks.createResponse<NextApiResponse>();

    GetTask(req, res);

    expect(res.statusCode).toBe(200);
  });
});
