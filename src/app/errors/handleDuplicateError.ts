import { status } from 'http-status';
import { TGenericError } from './../Interface/error';

const handleDuplicateError = (err: any): TGenericError => {
	const statusCode = status.CONFLICT;
	const message = 'Duplicate field value entered';

	const match = err.message.match(/"([^"]*)"/);

	const extractedMessage = match && match[1];

	const errorSources = [
		{
			path: '',
			message: `Duplicate value entered for ${extractedMessage}`,
		},
	];

	return {
		statusCode,
		message,
		errorSources,
	};
};

export default handleDuplicateError;
