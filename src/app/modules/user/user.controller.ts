import { TUser } from './user.interface';
import { UserService } from './user.service';
import sendResponse from '../../utils/sendResponse';
import status from 'http-status';
import catchAsync from '../../utils/CatchAsync';

// use RequestHandler from express to define the type for the request handler
const createStudent = catchAsync(async (req, res) => {
	const { password, student } = req.body;
	// const zodParsedData =  userValidation?.userValidationSchema.parse(student);

	const result = await UserService.createStudentIntoDB(password, student);

	sendResponse(res, {
		statusCode: status.OK,
		success: true,
		message: 'Student is Created successfully',
		data: result as unknown as TUser,
	});
});

export const UserControllers = {
	createStudent,
};
