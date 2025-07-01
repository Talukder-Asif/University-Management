import status from 'http-status';
import AppError from '../errors/AppError';
import catchAsync from '../utils/CatchAsync';
import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
const auth = () => {
	return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const token = req.headers.authorization;

		// Check the token is send from the client
		if (!token) {
			throw new AppError(status.UNAUTHORIZED, 'You are not authorized!');
		}

		// Check the token is valid
		// invalid token
		jwt.verify(
			token,
			config.jwt_access_secret as string,
			function (err, decoded) {
				// err
				if (err) {
					throw new AppError(status.UNAUTHORIZED, 'You are not authorized!');
				}

				// decoded undefined
				req.user = decoded as JwtPayload;
				next();
			},
		);
	});
};

export default auth;
