import express from 'express';
import morgan from 'morgan';

const app = express();

app.use(morgan('tiny'));

app.get('/', (req, res) => {
  return res.send('Hello API');
});

app.listen(3000, () => console.log('Server is running'));
