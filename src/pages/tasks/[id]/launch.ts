import { ServerResponse, ServerRequest } from 'http';
import GetTaskProcessUrlUseCase from '../../../usecases/api/getTaskProcessUrl';

function Launch() {
  return null;
}

Launch.getInitialProps = async (context: AppContext) => {
  if (!context.req || !context.res) {
    return {};
  }

  const {
    req,
    res,
  }: {
    req: ServerRequest;
    res: ServerResponse;
  } = context;

  if (!process.env.PROCESS_TOKEN_ENCRYPTION_KEY) {
    res.writeHead(500);
    res.end();
    return {};
  }
  const getTaskProcessUrl = new GetTaskProcessUrlUseCase({
    encryptionKey: process.env.PROCESS_TOKEN_ENCRYPTION_KEY,
  });

  const url = await getTaskProcessUrl.execute(context.query.id);
  if (url.error) {
    res.writeHead(500);
    res.end();
    return {};
  }
  if (res) {
    res.writeHead(301, { Location: url.body });
    res.end();
  }

  return {};
};

export default Launch;
