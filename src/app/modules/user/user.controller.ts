import { TUser } from './user.interface';
import { UserService } from './user.service';
import sendResponse from '../../utils/sendResponse';
import status from 'http-status';
import catchAsync from '../../utils/CatchAsync';

// use RequestHandler from express to define the type for the request handler
const createStudent = catchAsync(async (req, res) => {
	const { password, student } = req.body;

	const result = await UserService.createStudentIntoDB(
		password,
		student,
		req?.file,
	);

	sendResponse(res, {
		statusCode: status.OK,
		success: true,
		message: 'Student is Created successfully',
		data: result,
		// data: null,
	});
});

const createFaculty = catchAsync(async (req, res) => {
	const { password, faculty } = req.body;
	const result = await UserService.createFacultyIntoDB(
		password,
		faculty,
		req?.file,
	);

	sendResponse(res, {
		statusCode: status.OK,
		success: true,
		message: 'Faculty is Created successfully',
		data: result as unknown as TUser,
	});
});

const createAdmin = catchAsync(async (req, res) => {
	const { password, admin } = req.body;

	const result = await UserService.createAdminIntoDB(
		password,
		admin,
		req?.file,
	);

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: 'Admin is created successfully',
		data: result,
	});
});

const getMe = catchAsync(async (req, res) => {
	const { userId, role } = req.user;
	const result = await UserService.getMeFromDB(userId, role);

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: 'Data is retrieved successfully',
		data: result,
	});
});

const changeStatus = catchAsync(async (req, res) => {
	const result = await UserService.changeStatusIntoDB(req.params.id, req.body);

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: 'Data is retrieved successfully',
		data: result,
	});
});

export const UserControllers = {
	createStudent,
	createFaculty,
	createAdmin,
	getMe,
	changeStatus,
};
