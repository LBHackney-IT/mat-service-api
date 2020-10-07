import { NextApiResponse } from 'next';
import { Officer } from '../mappings/crmToOfficersDetails';
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

export interface OfficerList {
  users: Officer[];
}

export interface ContactList {
  contacts: Contact[];
}

export type ApiResponse<T> = NextApiResponse<T | ErrorResponse>;
