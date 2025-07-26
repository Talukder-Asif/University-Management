import status from 'http-status';
import catchAsync from '../../utils/CatchAsync';
import sendResponse from '../../utils/sendResponse';
import { enrolledCourseService } from './enrolledCourse.service';

const createEnrolledCourse = catchAsync(async (req, res) => {
	const { userId } = req.user;
	const result = await enrolledCourseService.createEnrolledCourseIntoDB(
		req?.body,
		userId,
	);

	sendResponse(res, {
		statusCode: status.CREATED,
		success: true,
		message: 'Course has enrolled successfully',
		data: result,
	});
});
const updateEnrolledCourseMarks = catchAsync(async (req, res) => {
	const { userId } = req.user;
	const data = req.body;
	const result = await enrolledCourseService.updateEnrolledCourseMarksIntoDB(
		userId,
		data,
	);

	sendResponse(res, {
		statusCode: status.CREATED,
		success: true,
		message: 'Successfully update the enrolled course',
		data: result,
	});
});

export const enrolledCourseController = {
	createEnrolledCourse,
	updateEnrolledCourseMarks,
};
