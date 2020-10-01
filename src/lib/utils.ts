/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Logger {
  log(message?: any, ...optionalParams: any[]): void;
}

export type Result<T> = T | Error;

export function isError<T>(result: Result<T>): result is Error {
  return result instanceof Error;
}

export function isSuccess<T>(result: Result<T>): result is T {
  return !isError(result);
}
