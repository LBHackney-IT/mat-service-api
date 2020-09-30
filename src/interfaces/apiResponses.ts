import { NextApiResponse } from 'next';
import Contact from './contact';
import Note from './note';
import { Task } from './task';

export interface ErrorResponse {
  error: string;
}

export interface TaskList {
  tasks: Task[];
}

export interface NoteList {
  notes: Note[];
}

export interface ContactList {
  contacts: Contact[];
}

export type ApiResponse<T> = NextApiResponse<T | ErrorResponse>;
