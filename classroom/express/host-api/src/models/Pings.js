import prisma from '../database/database.js';

async function create({ icmps, stats, host, userId }) {
  if (!icmps || !stats || !host || !userId) {
    throw new Error('Error when passing parameters');
  }

  const createdPing = await prisma.ping.create({
    data: {
      icmps: {
        create: icmps,
      },
      stats: {
        create: stats,
      },
      host: {
        connect: {
          id: host.id,
        },
      },
      user: {
        connect: {
          id: userId,
        },
      },
    },
    include: {
      icmps: true,
      stats: true,
      host: true,
    },
  });

  return createdPing;
}

async function read(where = {}) {
  const pings = await prisma.ping.findMany({
    where,
    include: {
      icmps: true,
      stats: true,
      host: true,
    },
  });

  return pings;
}

export default { create, read };
