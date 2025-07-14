import status from 'http-status';
import catchAsync from '../../utils/CatchAsync';
import sendResponse from '../../utils/sendResponse';
import { enrolledCourseService } from './enrolledCourse.service';

const createEnrolledCourse = catchAsync(async (req, res) => {
	const result = await enrolledCourseService.createEnrolledCourseIntoDB(
		req?.body,
	);

	sendResponse(res, {
		statusCode: status.CREATED,
		success: true,
		message: 'Course has enrolled successfully',
		data: result,
	});
});

export const enrolledCourseController = {
	createEnrolledCourse,
};
