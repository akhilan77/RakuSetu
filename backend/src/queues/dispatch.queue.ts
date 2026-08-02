import { Queue } from 'bullmq';
import { QueueName } from '../constants/queues.js';
import { queueConnection } from './connection.js';

export const dispatchQueue = new Queue(QueueName.DISPATCH, {
  connection: queueConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: true,
  },
});
