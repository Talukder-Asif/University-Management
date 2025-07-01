import status from 'http-status';
import AppError from '../../errors/AppError';
import { TLoginUsers } from './auth.interface';
import User from '../user/user.model';
import jwt from 'jsonwebtoken';
import config from '../../config';

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

	const jswPayload = {
		userId: user.id,
		role: user.role,
	};
	const accessToken = jwt.sign(jswPayload, config.jwt_access_secret as string, {
		expiresIn: '10d',
	});

	return {
		accessToken,
		needsPasswordChange: user.needsChangePassword,
	};
};

export const AuthServices = {
	loginUser,
};
