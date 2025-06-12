import express from 'express';

const router = express.Router();

router.get('/hello/en', (req, res) => {
  const name = req.query.name;

  if (!name) {
    return res.status(400).json({ message: 'Name query parameter is required' });
  }

  return res.json({
    message: `Hello, ${name}!`
  });
});

router.get('/hello/pt/:name', (req, res) => {
  const name = req.params.name;

  if (!name) {
    return res.status(400).json({ message: 'Name query parameter is required' });
  }

  return res.json({
    message: `Olá, ${name}!`
  });
});

router.post('/hello/es', (req, res) => {
  const name = req.body.name;

  if (!name) {
    return res.status(400).json({ message: 'Name query parameter is required' });
  }

  return res.json({
    message: `Hola, ${name}!`
  });
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
