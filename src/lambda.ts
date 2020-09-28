/* eslint-disable @typescript-eslint/no-var-requires */
import restana, { Protocol, RequestHandler } from 'restana';
import next from 'next';
import files from 'serve-static';
import path from 'path';
import serverlessHttp from 'serverless-http';
// import createItvTasks from './createItvTasks';

const server = restana();
const app = next({ dev: false });
const nextRequestHandler = app.getRequestHandler();

server.use(
  files(path.join(__dirname, 'build')) as RequestHandler<Protocol.HTTP>
);
server.use(
  files(path.join(__dirname, 'public')) as RequestHandler<Protocol.HTTP>
);

// api routes, auth is handled by the authorizer
server.all('/api/*', (req, res) => nextRequestHandler(req, res));

server.all('*', (req, res) => nextRequestHandler(req, res));

export const handler = serverlessHttp(server);
// export const createItvTasks = require('./createItvTasks');
