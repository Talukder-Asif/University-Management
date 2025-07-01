import { TUserRole } from './../modules/user/user.interface';
import status from 'http-status';
import AppError from '../errors/AppError';
import catchAsync from '../utils/CatchAsync';
import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import User from '../modules/user/user.model';
const auth = (...requiredRoles: TUserRole[]) => {
	return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const token = req.headers.authorization;

		// Check the token is send from the client
		if (!token) {
			throw new AppError(status.UNAUTHORIZED, 'You are not authorized!');
		}

		// Check the token is valid
		const decoded = jwt.verify(
			token,
			config.jwt_access_secret as string,
		) as JwtPayload;

		// Check the user is authorized
		const { role, userId, iat } = decoded;

		// at first check if the user exist or not
		const user = await User.checkUserExistByCustomId(userId);
		if (!user) {
			throw new AppError(status.NOT_FOUND, 'This user is not Found');
		}

		// Checking if the user is already deleted
		if (user?.isDeleted) {
			throw new AppError(status.FORBIDDEN, 'This user is Deleted');
		}

		// Checking if the user is  blocked
		if (user?.status === 'blocked') {
			throw new AppError(status.FORBIDDEN, 'This user is Blocked');
		}

		// Checking the role
		if (requiredRoles && !requiredRoles.includes(role)) {
			throw new AppError(status.UNAUTHORIZED, 'You are not authorized!');
		}

		if (
			user.passwordChangedDate &&
			(await User.isJWTIssuedBeforePasswordChanged(
				user.passwordChangedDate,
				iat as number,
			))
		) {
			throw new AppError(status.UNAUTHORIZED, 'You are not authorized!');
		}

		// Send decoded data with Request
		req.user = decoded;

		next();
	});
};

export default auth;
