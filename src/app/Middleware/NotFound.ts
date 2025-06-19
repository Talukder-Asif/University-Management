import { status } from 'http-status';
import { NextFunction, Request, Response } from 'express';

const NotFound = (req: Request, res: Response, next: NextFunction) => {
	return res.status(status.NOT_FOUND).json({
		success: false,
		message: `API not found - ${req.originalUrl}`,
		error: ` `,
	});
};

export default NotFound;
