import status from 'http-status';
import AppError from '../../errors/AppError';
import { TLoginUsers } from './auth.interface';
import User from '../user/user.model';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import bcrypt from 'bcrypt';
import { createToken } from './auth.utils';
import { sendEmail } from '../../utils/sendEmail';

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

const forgetPassword = async (userId: string) => {
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

	const jwtPayload = {
		userId: user.id,
		role: user.role,
	};

	// reset Token
	const resetToken = createToken(
		jwtPayload,
		config.jwt_reset_password_token as string,
		'10m',
	);

	const resetUILink = `${config.reset_pass_ui_link}?id=${user?.id}&token=${resetToken}`;

	const html = `<body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color: #f4f4f7;">
  <table align="center" width="100%" cellpadding="0" cellspacing="0" style="padding: 30px 0;">
    <tr>
      <td>
        <table align="center" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
          <tr>
            <td align="center" style="padding-bottom: 20px;">
              <!-- Optional Logo -->
              <img src="https://yourwebsite.com/logo.png" alt="Logo" width="100" style="display:block;" />
            </td>
          </tr>
          <tr>
            <td>
              <h2 style="color: #333333; margin: 0 0 20px;">Reset Your Password</h2>
              <p style="color: #555555; font-size: 16px; line-height: 1.5; margin: 0 0 20px;">
  				Hi Dear ${user.role.charAt(0).toUpperCase() + user.role.slice(1)},
				</p>

              <p style="color: #555555; font-size: 16px; line-height: 1.5; margin: 0 0 20px;">
                We received a request to reset your password. Click the button below to choose a new one:
              </p>
              <p style="text-align: center; margin: 30px 0;">
                <a href=${resetUILink} style="background-color: #007bff; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                  Reset Password
                </a>
              </p>
              <p style="color: #555555; font-size: 14px; line-height: 1.5; margin: 0 0 20px;">
                If you didn’t request a password reset, please ignore this email. Your password will remain unchanged.
              </p>
              <p style="color: #555555; font-size: 16px; line-height: 1.5;">
                Thanks,<br/>
                The IT Team
              </p>
              <hr style="border: none; border-top: 1px solid #eeeeee; margin: 30px 0;">
              <p style="color: #999999; font-size: 12px; text-align: center;">
                &copy; 2025 University. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>`;

	sendEmail(user.email, html);

	return null;
};

const resetPassword = async (
	payload: { id: string; newPassword: string },
	token: string,
) => {
	// at first check if the user exist or not
	const user = await User.checkUserExistByCustomId(payload.id as string);
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

	// Check the token is send from the client
	if (!token) {
		throw new AppError(status.UNAUTHORIZED, 'You are not authorized!');
	}

	// Check the token is valid
	const decoded = jwt.verify(
		token,
		config.jwt_reset_password_token as string,
	) as JwtPayload;

	//check the request come from correct person
	if (user.id !== decoded.userId) {
		console.log(user.id, payload.id, decoded.userId);
		throw new AppError(status.FORBIDDEN, 'You are forbidden!');
	}

	// Now convert new password to hashedPassword
	const newHashedPassword = await bcrypt.hash(
		payload.newPassword,
		Number(config.salt_rounds),
	);

	await User.findOneAndUpdate(
		{
			id: decoded.userId,
			role: decoded.role,
		},
		{
			password: newHashedPassword,
			passwordChangedDate: new Date(),
		},
	);

	return;
};

export const AuthServices = {
	loginUser,
	changePassword,
	refreshToken,
	forgetPassword,
	resetPassword,
};
