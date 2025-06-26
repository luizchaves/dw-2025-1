import express from 'express';
import morgan from 'morgan';
import router from './routes.js';
import { specs, swaggerUi } from './swagger.js';

const app = express();

app.use(morgan('tiny'));

app.use(express.json());

app.use(express.static('public'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/api', router);

app.listen(3000, () => console.log('Server is running'));

export default app;
