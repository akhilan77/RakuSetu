import { Worker, Job } from 'bullmq';
import { QueueName } from '../constants/queues.js';
import { queueConnection } from '../queues/connection.js';
import { logger } from '../lib/logger.js';

export const dispatchWorker = new Worker(
  QueueName.DISPATCH,
  async (job: Job) => {
    logger.info({ jobId: job.id, jobName: job.name }, 'Processing wave dispatch job');
    // Foundation skeleton: no business logic implemented yet
    return { processed: true };
  },
  {
    connection: queueConnection,
    concurrency: 2,
    autorun: true,
  }
);

dispatchWorker.on('completed', (job) => {
  logger.info({ jobId: job.id }, 'Wave dispatch job completed successfully');
});

dispatchWorker.on('failed', (job, err) => {
  logger.error({ jobId: job?.id, error: err }, 'Wave dispatch job failed');
});
