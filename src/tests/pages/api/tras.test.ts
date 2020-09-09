import httpMocks from 'node-mocks-http';
import { NextApiRequest, NextApiResponse } from 'next';
import TRAs from '../../../pages/api/tras';

describe('GetTrasAPI', () => {
  it('Returns an error respoonse if an invalid id is provided', async () => {
    const req = httpMocks.createRequest<NextApiRequest>();
    const res = httpMocks.createResponse<NextApiResponse>();

    res.status = jest.fn(function () {
      return this;
    });

    await TRAs(req, res);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
