import { TUserRole } from './../modules/user/user.interface';
import status from 'http-status';
import AppError from '../errors/AppError';
import catchAsync from '../utils/CatchAsync';
import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
const auth = (...requiredRoles: TUserRole[]) => {
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

				const role = (decoded as JwtPayload).role;
				if (requiredRoles && !requiredRoles.includes(role)) {
					throw new AppError(status.UNAUTHORIZED, 'You are not authorized!');
				}
				next();
			},
		);
	});
};

export default auth;
