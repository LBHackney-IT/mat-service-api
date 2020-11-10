import { NextApiRequest, NextApiResponse } from 'next';
//import { isSuccess } from '../../lib/utils';
import {
  //crmTokenGateway,
  //crmGateway,
  //v1MatAPIGateway,
  matPostgresGateway,
} from '../../gateways';

type Data = {
  result: string;
  messages?: string[];
};

export type CheckResult = {
  success: boolean;
  message?: string;
};

type AllResults = {
  success: boolean;
  messages?: string[];
};

let CheckFn: () => Promise<CheckResult>;

// const promiseTimeout = function (
//   ms: number,
//   promise: Promise<unknown>
// ): Promise<unknown> {
//   // Create a promise that rejects in <ms> milliseconds
//   const timeout = new Promise((resolve, reject) => {
//     const id = setTimeout(() => {
//       clearTimeout(id);
//       reject('Timed out in ' + ms + 'ms.');
//     }, ms);
//   });

//   // Returns a race between our timeout and the passed in promise
//   return Promise.race([promise, timeout]);
// };

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
): Promise<void> => {
  if (req.method === 'GET') {
    const result = await runChecks(checks);
    if (result.success) {
      res.status(200).json({ result: 'success' });
    } else {
      res.status(500).json({ result: 'failure', messages: result.messages });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

const runChecks = async (checks: typeof CheckFn[]): Promise<AllResults> => {
  const promises: Promise<CheckResult>[] = checks.map((check) => check());
  const results = await Promise.all(promises);
  const messages = results.reduce((acc, result) => {
    if (!result.success && result.message) acc.push(result.message);
    return acc;
  }, [] as string[]);
  if (messages.length == 0) {
    return { success: true };
  } else {
    return { success: false, messages };
  }
};

const checkEnvVars: typeof CheckFn = async (): Promise<CheckResult> => {
  const vars = [
    'NODE_ENV',
    'DB_NAME',
    'DB_USER',
    'DB_HOST',
    'DB_PASSWORD',
    'UI_PATH',
    'ALLOWED_GROUPS',
    'NEXT_PUBLIC_API_PATH',
    'V1_MAT_API_URL',
    'V1_MAT_API_TOKEN',
    'CRM_API_URL',
    'CRM_TOKEN_API_KEY',
    'CRM_TOKEN_API_URL',
    'PROCESS_TOKEN_ENCRYPTION_KEY',
  ];
  const failures = [];
  for (const envVar of vars) {
    if (process.env[envVar] === undefined) {
      failures.push(envVar);
    }
  }
  if (failures.length > 0) {
    return {
      success: false,
      message: `Environment variables not set: ${failures.join(', ')}`,
    };
  } else {
    return { success: true };
  }
};

// const checkDynamicsToken: typeof CheckFn = async (): Promise<CheckResult> => {
//   const checkPromise = new Promise((resolve, reject) => {
//     const response = crmTokenGateway.getToken();
//     isSuccess(response) ? resolve() : reject();
//   });
//   return promiseTimeout(5000, checkPromise)
//     .then(() => {
//       return { success: true };
//     })
//     .catch(() => {
//       return {
//         success: false,
//         message: `Could not fetch dynamics token`,
//       };
//     });
// };

// const checkDynamics: typeof CheckFn = async (): Promise<CheckResult> => {
//   return crmGateway.healthCheck();
// };

const checkPostgres: typeof CheckFn = async (): Promise<CheckResult> => {
  return matPostgresGateway.healthCheck();
};

// const checkV1MatApi: typeof CheckFn = async (): Promise<CheckResult> => {
//   if (!process.env.V1_MAT_API_URL || !process.env.V1_MAT_API_TOKEN) {
//     return {
//       success: false,
//       message: `MaT API env vars not configured`,
//     };
//   }

//   return v1MatAPIGateway.healthCheck();
// };

const checks = [
  checkEnvVars,
  //checkDynamicsToken,
  //checkDynamics,
  checkPostgres,
  //checkV1MatApi,
];
