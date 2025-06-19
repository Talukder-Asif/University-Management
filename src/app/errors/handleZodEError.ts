import { ZodError, ZodIssue } from 'zod';
import { TErrorSources, TGenericError } from '../Interface/error';

const handleZodError = (err: ZodError): TGenericError => {
	const errorSources: TErrorSources = err.issues.map((issue: ZodIssue) => {
		return {
			path: issue?.path[issue.path.length - 1] || '',
			message: issue?.message || 'Invalid input',
		};
	});

	const statusCode = 400;
	return {
		statusCode,
		message: 'Validation Error',
		errorSources,
	};
};

export default handleZodError;
