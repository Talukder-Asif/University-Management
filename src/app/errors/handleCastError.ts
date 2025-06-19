import mongoose from 'mongoose';
import { TErrorSources, TGenericError } from '../Interface/error';

const handleCastError = (err: mongoose.Error.CastError): TGenericError => {
	const statusCode = 400;

	const errorSources: TErrorSources = [
		{
			path: err.path || '',
			message: err.message || '',
		},
	];

	return {
		statusCode,
		message: 'Invalid ID',
		errorSources,
	};
};

export default handleCastError;
