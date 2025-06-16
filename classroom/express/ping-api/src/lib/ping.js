import ping from 'ping';

export async function pingHost(host, count = 1) {
  try {
    const res = await ping.promise.probe(host, {
      min_reply: count,
    });

    return res;
  } catch (error) {
    throw new Error(`Ping failed for host ${host}: ${error.message}`);
  }
}
