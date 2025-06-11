import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import globalErrorHandler from './app/Middleware/globalErrorHandler';
import NotFound from './app/Middleware/NotFound';
import router from './app/Router';

const app: Application = express();

//parsers
app.use(express.json());
app.use(cors());

// application routes
app.use('/api/v1', router);

const getAController = (req: Request, res: Response) => {
	const a = 10;
	res.status(200).send({ value: a });
};

app.get('/', getAController);

app.use(globalErrorHandler);

app.use(NotFound);

export default app;
