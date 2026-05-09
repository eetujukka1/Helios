import { Queue } from 'bullmq';
import { connection } from './connection.js';

export const pageLoadQueue = new Queue('page-load', {
  connection: connection
})

export const pageParseQueue = new Queue('page-parse', {
  connection: connection
})