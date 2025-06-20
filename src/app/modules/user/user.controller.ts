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

const createFaculty = catchAsync(async (req, res) => {
	const { password, faculty } = req.body;
	const result = await UserService.createFacultyIntoDB(password, faculty);

	sendResponse(res, {
		statusCode: status.OK,
		success: true,
		message: 'Faculty is Created successfully',
		data: result as unknown as TUser,
	});
});

const createAdmin = catchAsync(async (req, res) => {
	const { password, admin } = req.body;

	const result = await UserService.createAdminIntoDB(password, admin);

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: 'Admin is created successfully',
		data: result,
	});
});

export const UserControllers = {
	createStudent,
	createFaculty,
	createAdmin,
};
