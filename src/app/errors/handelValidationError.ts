import mongoose from 'mongoose';
import { TErrorSources, TGenericError } from '../Interface/error';

const handelValidationError = (
	err: mongoose.Error.ValidationError,
): TGenericError => {
	const errorSources: TErrorSources = Object.values(err.errors).map(
		(val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
			return {
				path: val.path || '',
				message: val.message || 'Invalid input',
			};
		},
	);

	const statusCode = 400;

	return {
		statusCode,
		message: 'Validation Error',
		errorSources,
	};
};

export default handelValidationError;
