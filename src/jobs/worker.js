const { Worker } = require('bullmq');
const prisma = require('../utils/prisma');
const Redis = require('ioredis');

const connection = new Redis(process.env.REDIS_URL,{
  maxRetriesPerRequest: null
});

const worker = new Worker(
  'file-processing',
  async job => {
    console.log(`Processing file ID: ${job.data.fileId}`);

    // simulate delay / checksum logic here
    await new Promise(resolve => setTimeout(resolve, 2000));

    await prisma.file.update({
      where: { id: job.data.fileId },
      data: {
        status: 'processed',
        extractedData: 'fake-checksum-hash-12345',
      },
    });

    console.log(`File ID ${job.data.fileId} processed`);
  },
  { connection }
);
