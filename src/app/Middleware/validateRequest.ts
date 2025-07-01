import { AnyZodObject } from 'zod';
import catchAsync from '../utils/CatchAsync';

const validateRequest = (schema: AnyZodObject) => {
	return catchAsync(async (req, res, next) => {
		await schema.parseAsync({
			body: req.body,
		});

		return next();
	});
};

export default validateRequest;
