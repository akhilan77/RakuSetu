import { Queue } from 'bullmq';
import { QueueName } from '../constants/queues.js';
import { queueConnection } from './connection.js';

export const notificationQueue = new Queue(QueueName.NOTIFICATION, {
  connection: queueConnection,
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: true,
  },
});
