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

export const AuthControllers = {
	loginUser,
};
