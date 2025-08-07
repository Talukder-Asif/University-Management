import status from 'http-status';
import catchAsync from '../../utils/CatchAsync';
import sendResponse from '../../utils/sendResponse';
import { offeredCourseServices } from './offeredCourse.service';

const createOfferedCourse = catchAsync(async (req, res) => {
	const result = await offeredCourseServices.createOfferedCourseIntoDB(
		req.body,
	);

	sendResponse(res, {
		statusCode: status.OK,
		success: true,
		message: 'OfferedCourse created Successfully',
		data: result,
	});
});

const getAllOfferedCourses = catchAsync(async (req, res) => {
	const result = await offeredCourseServices.getAllOfferedCourseFromDB(
		req.query,
	);
	sendResponse(res, {
		statusCode: status.OK,
		success: true,
		message: 'OfferedCourses retrieved successfully !',
		data: result,
	});
});

const getMyOfferedCourses = catchAsync(async (req, res) => {
	const userId = req.user.userId;
	const result = await offeredCourseServices.getMyOfferedCoursesFromDB(userId);
	sendResponse(res, {
		statusCode: status.OK,
		success: true,
		message: 'OfferedCourses retrieved successfully !',
		data: result,
	});
});

const getSingleOfferedCourses = catchAsync(async (req, res) => {
	const { id } = req.params;
	const result = await offeredCourseServices.getSingleOfferedCourseFromDB(id);
	sendResponse(res, {
		statusCode: status.OK,
		success: true,
		message: 'OfferedCourse fetched successfully',
		data: result,
	});
});

const updateOfferedCourse = catchAsync(async (req, res) => {
	const { id } = req.params;

	const result = await offeredCourseServices.updateOfferedCourseIntoDB(
		id,
		req.body,
	);
	sendResponse(res, {
		statusCode: status.OK,
		success: true,
		message: 'OfferedCourse updated successfully',
		data: result,
	});
});

const deleteOfferedCourseFromDB = catchAsync(async (req, res) => {
	const { id } = req.params;
	const result = await offeredCourseServices.deleteOfferedCourseFromDB(id);
	sendResponse(res, {
		statusCode: status.OK,
		success: true,
		message: 'OfferedCourse deleted successfully',
		data: result,
	});
});

export const offeredCourseControllers = {
	createOfferedCourse,
	getAllOfferedCourses,
	getMyOfferedCourses,
	deleteOfferedCourseFromDB,
	updateOfferedCourse,
	getSingleOfferedCourses,
};
