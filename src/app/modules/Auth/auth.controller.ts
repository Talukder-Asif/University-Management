import status from 'http-status';
import catchAsync from '../../utils/CatchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';

const loginUser = catchAsync(async (req, res) => {
	const result = await AuthServices.loginUser(req.body);

	sendResponse(res, {
		statusCode: status.OK,
		success: true,
		message: 'User is logged in successfully',
		data: result,
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

export const AuthControllers = {
	loginUser,
	changePassword,
};
