import status from 'http-status';
import catchAsync from '../../utils/CatchAsync';
import sendResponse from '../../utils/sendResponse';
import { CourseServices } from './course.service';

const createCourse = catchAsync(async (req, res) => {
	const result = await CourseServices.createCourseIntoDB(req.body);

	sendResponse(res, {
		statusCode: status.OK,
		success: true,
		message: 'Course created successfully',
		data: result,
	});
});

const getAllCourse = catchAsync(async (req, res) => {
	const result = await CourseServices.getAllCoursesFromDB(req.query);

	sendResponse(res, {
		statusCode: status.OK,
		success: true,
		message: 'Courses are retrieved successfully',
		data: result,
	});
});
const getSingleCourse = catchAsync(async (req, res) => {
	const { id } = req.params;
	const result = await CourseServices.getSingleCourseFromDB(id);

	sendResponse(res, {
		statusCode: status.OK,
		success: true,
		message: 'Course is retrieved successfully',
		data: result,
	});
});
const deleteCourse = catchAsync(async (req, res) => {
	const { id } = req.params;
	const result = await CourseServices.deleteCourseFromDB(id);

	sendResponse(res, {
		statusCode: status.OK,
		success: true,
		message: 'Course is deleted successfully',
		data: result,
	});
});
const updateCourse = catchAsync(async (req, res) => {
	const { id } = req.params;
	const result = await CourseServices.updateCourseIntoDB(id, req.body);

	sendResponse(res, {
		statusCode: status.OK,
		success: true,
		message: 'Course is updated successfully',
		data: result,
	});
});

export const courseController = {
	createCourse,
	getAllCourse,
	getSingleCourse,
	deleteCourse,
	updateCourse,
};
