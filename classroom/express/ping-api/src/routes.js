import express from 'express';
import { pingHost } from './lib/ping.js';

const router = express.Router();

router.get('/ping', async (req, res) => {
  const { host, count } = req.query;

  if (!host) {
    return res.status(400).json({ message: 'Host query parameter is required' });
  }

  const ping = await pingHost(host, count || 3);

  if (!ping.alive) {
    return res.status(400).json({ message: `Host ${host} is not reachable` });
  }

  return res.json(ping);
});

// Error handling for 404
router.use((req, res, next) => {
  return res.status(404).json({ message: 'Not Found' });
});

// Error handling middleware
router.use((err, req, res, next) => {
  // console.error(err.stack);
  return res.status(500).json({ message: 'Something broke!' });
});

export default router;
