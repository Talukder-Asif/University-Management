import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { TErrorSources } from '../Interface/error';
import handleZodError from '../errors/handleZodEError';
import handelValidationError from '../errors/handelValidationError';
import handleCastError from '../errors/handleCastError';
import handleDuplicateError from '../errors/handleDuplicateError';
import AppError from '../errors/AppError';

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
	// Setting Default Value
	let statusCode = 500;
	let message = 'Something went wrong';

	let errorSources: TErrorSources = [
		{
			path: '',
			message: 'Something went wrong',
		},
	];

	// Checking the error from Zod
	if (err instanceof ZodError) {
		const simplifiedError = handleZodError(err);
		statusCode = simplifiedError.statusCode;
		message = simplifiedError.message;
		errorSources = simplifiedError.errorSources;

		// Handle Mongoose Validation Error
	} else if (err.name === 'ValidationError') {
		const simplifiedError = handelValidationError(err);

		statusCode = simplifiedError.statusCode;
		message = simplifiedError.message;
		errorSources = simplifiedError.errorSources;

		// Handle Mongoose Cast Error
	} else if (err.name === 'CastError') {
		const simplifiedError = handleCastError(err);
		statusCode = simplifiedError.statusCode;
		message = simplifiedError.message;
		errorSources = simplifiedError.errorSources;

		// Handle Mongoose Duplicate Key Error
	} else if (err.code === 11000) {
		const simplifiedError = handleDuplicateError(err);
		statusCode = simplifiedError.statusCode;
		message = simplifiedError.message;
		errorSources = simplifiedError.errorSources;
	} else if (err instanceof AppError) {
		statusCode = err?.statusCode;
		message = err?.message;
		errorSources = [
			{
				path: '',
				message: err?.message,
			},
		];
	} else if (err instanceof Error) {
		message = err?.message;
		errorSources = [
			{
				path: '',
				message: err?.message,
			},
		];
	}

	return res.status(statusCode).json({
		success: false,
		message,
		errorSources,
		// err,
		stack: process.env.NODE_ENV === 'development' ? err.stack : null,
	});
};

export default globalErrorHandler;

/*
Pattern: Global Error Handler
success
message
errorSources:[
	path:
	message:
]
stack
*/
