import { NextApiResponse } from 'next';
import { Task } from './task';

export interface ErrorResponse {
  error: string;
}

export interface TaskList {
  tasks: Task[];
}

export type ApiResponse<T> = NextApiResponse<T | ErrorResponse>;
