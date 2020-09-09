import httpMocks from 'node-mocks-http';
import { NextApiRequest, NextApiResponse } from 'next';
import Tasks from '../../../pages/api/tasks';

describe('GetTasksAPI', () => {
  it('Returns an error response if an invalid id is provided', async () => {
    const req = httpMocks.createRequest<NextApiRequest>();
    const res = httpMocks.createResponse<NextApiResponse>();

    res.status = jest.fn(function () {
      return this;
    });

    await Tasks(req, res);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  //TODO: add test for valid id
  //      it('Returns a valid response if an valid id is provided', async () => {
  //     const req = httpMocks.createRequest<NextApiRequest>({query: {patchId: '9cd3823d-8653-e811-8126-70106faaf8c1'}});
  //     const res = httpMocks.createResponse<NextApiResponse>();

  //     res.status = jest.fn(function () {
  //       return this;
  //     })

  //     await Tasks(req, res);

  //     expect(res.status).toHaveBeenCalledTimes(1)
  //     expect(res.status).toHaveBeenCalledWith(200)
  //   });
});
