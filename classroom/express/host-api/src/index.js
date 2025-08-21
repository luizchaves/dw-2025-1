import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import { specs, swaggerUi } from './swagger.js';
import router from './routes.js';

const app = express();

app.use(morgan('tiny'));

app.use(express.json());

app.use(express.static('public'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/api', router);

app.get('/', (req, res) => {
  res.redirect('/signin.html');
});

app.listen(3000, () => console.log('Server is running'));

export default app;
