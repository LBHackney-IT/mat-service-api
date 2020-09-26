import { NextApiRequest, NextApiResponse } from 'next';
import CheckUserMappingExists, {
  CheckUserMappingExistsResponse,
} from '../../usecases/api/checkUserMappingExists';
import CreateUserMapping from '../../usecases/api/createUserMapping';

type Data = CheckUserMappingExistsResponse;

const doGet = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
): Promise<void> => {
  const emailAddress = req.query.emailAddress
    ? Array.isArray(req.query.emailAddress)
      ? req.query.emailAddress[0]
      : req.query.emailAddress
    : undefined;

  if (emailAddress !== undefined) {
    const checkUserMappingExists = new CheckUserMappingExists(emailAddress);
    const getResponse = await checkUserMappingExists.execute();
    if (getResponse.error === undefined) {
      return res.status(200).json(getResponse);
    }
    return res.status(getResponse.error).end();
  }

  res.status(400).end();
};

const doPost = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
): Promise<void> => {
  const userMapping = {
    username: req.body.username,
    emailAddress: req.body.emailAddress,
    usercrmid: req.body.usercrmid,
    googleId: req.body.googleId,
  };

  const createUserMapping = new CreateUserMapping(userMapping);
  const postResponse = await createUserMapping.execute();
  if (postResponse.error === undefined) {
    return res.status(201).end();
  }
  res.status(postResponse.error).end();
};

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  switch (req.method) {
    case 'GET':
      await doGet(req, res);
      break;

    case 'POST':
      await doPost(req, res);
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
