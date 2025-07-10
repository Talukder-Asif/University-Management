import status from 'http-status';
import catchAsync from '../../utils/CatchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';
import config from '../../config';

const loginUser = catchAsync(async (req, res) => {
	const result = await AuthServices.loginUser(req.body);

	const { refreshToken, accessToken, needsPasswordChange } = result;

	res.cookie('refreshToken', refreshToken, {
		secure: config.node_env === 'production',
		httpOnly: true,
	});

	sendResponse(res, {
		statusCode: status.OK,
		success: true,
		message: 'User is logged in successfully',
		data: {
			accessToken,
			needsPasswordChange,
		},
	});
});

const changePassword = catchAsync(async (req, res) => {
	const { ...passwordData } = req.body;
	const result = await AuthServices.changePassword(req?.user, passwordData);

	sendResponse(res, {
		statusCode: status.OK,
		success: true,
		message: 'Password is updated successfully',
		data: result,
	});
});

const refreshToken = catchAsync(async (req, res) => {
	const { refreshToken } = req.cookies;
	const result = await AuthServices.refreshToken(refreshToken);

	sendResponse(res, {
		statusCode: status.OK,
		success: true,
		message: 'Access Token updated successfully',
		data: result,
	});
});

const forgetPassword = catchAsync(async (req, res) => {
	const userId = req.body.id;
	const result = await AuthServices.forgetPassword(userId);

	sendResponse(res, {
		statusCode: status.OK,
		success: true,
		message: 'Reset link is generated successfully!',
		data: result,
	});
});

const resetPassword = catchAsync(async (req, res) => {
	const token = req.headers.authorization;
	const result = await AuthServices.resetPassword(req.body, token as string);

	sendResponse(res, {
		statusCode: status.OK,
		success: true,
		message: 'Password updated successfully',
		data: result,
	});
});

export const AuthControllers = {
	loginUser,
	changePassword,
	refreshToken,
	forgetPassword,
	resetPassword,
};
