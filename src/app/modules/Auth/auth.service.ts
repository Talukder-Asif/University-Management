import status from 'http-status';
import AppError from '../../errors/AppError';
import { TLoginUsers } from './auth.interface';
import User from '../user/user.model';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import bcrypt from 'bcrypt';
import { createToken } from './auth.utils';

const loginUser = async (payload: TLoginUsers) => {
	// Using Local methods

	// // Checking if the user exist on the database
	// const isUserExists = await User.findOne({ id: payload?.id });
	// if (!isUserExists) {
	// 	throw new AppError(status.NOT_FOUND, 'This user is not Found');
	// }

	// Using Static Method

	const user = await User.checkUserExistByCustomId(payload?.id);

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

	// Checking If the password is correct
	if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
		throw new AppError(status.FORBIDDEN, 'Wrong Password');
	}
	// Access granted, send AccessToken, RefreshToken

	// Create token and send to the client

	const jwtPayload = {
		userId: user.id,
		role: user.role,
	};

	// Access Token
	const accessToken = createToken(
		jwtPayload,
		config.jwt_access_secret as string,
		config.jwt_access_expires_in as string,
	);

	// Refresh token
	const refreshToken = createToken(
		jwtPayload,
		config.jwt_refresh_secret as string,
		config.jwt_refresh_expires_in as string,
	);

	return {
		accessToken,
		refreshToken,
		needsPasswordChange: user.needsChangePassword,
	};
};

const changePassword = async (
	userData: JwtPayload,
	payload: { oldPassword: string; newPassword: string },
) => {
	// at first check if the user exist or not
	const user = await User.checkUserExistByCustomId(userData.userId);
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

	// Checking If the password is correct
	if (!(await User.isPasswordMatched(payload?.oldPassword, user?.password))) {
		throw new AppError(status.FORBIDDEN, 'Wrong Password');
	}

	// Now convert new password to hashedPassword

	const newHashedPassword = await bcrypt.hash(
		payload.newPassword,
		Number(config.salt_rounds),
	);

	await User.findOneAndUpdate(
		{
			id: userData.userId,
			role: userData.role,
		},
		{
			password: newHashedPassword,
			needsChangePassword: false,
			passwordChangedDate: new Date(),
		},
	);

	return null;
};

const refreshToken = async (token: string) => {
	// Check the token is send from the client
	if (!token) {
		throw new AppError(status.UNAUTHORIZED, 'You are not authorized!');
	}

	// Check the token is valid
	const decoded = jwt.verify(
		token,
		config.jwt_refresh_secret as string,
	) as JwtPayload;

	// Check the user is authorized
	const { userId, iat } = decoded;

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

	if (
		user.passwordChangedDate &&
		(await User.isJWTIssuedBeforePasswordChanged(
			user.passwordChangedDate,
			iat as number,
		))
	) {
		throw new AppError(status.UNAUTHORIZED, 'You are not authorized!');
	}

	const jwtPayload = {
		userId: user.id,
		role: user.role,
	};

	// Access Token
	const accessToken = createToken(
		jwtPayload,
		config.jwt_access_secret as string,
		config.jwt_access_expires_in as string,
	);

	return {
		accessToken,
	};
};

export const AuthServices = {
	loginUser,
	changePassword,
	refreshToken,
};
