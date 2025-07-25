import express from 'express';
import validateRequest from '../../Middleware/validateRequest';
import { EnrolledCourseValidations } from './enrolledCourse.validaton';
import { enrolledCourseController } from './enrolledCourse.controller';
import auth from '../../Middleware/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
	'/create',
	auth(USER_ROLE.student),
	validateRequest(
		EnrolledCourseValidations.createEnrolledCourseValidationZodSchema,
	),
	enrolledCourseController.createEnrolledCourse,
);

router.patch(
	'/update-enrolled-course-marks',
	auth(USER_ROLE.faculty),
	validateRequest(
		EnrolledCourseValidations.updateEnrolledCourseMarksValidationZodSchema,
	),
	enrolledCourseController.updateEnrolledCourseMarks,
);

export const EnrolledCourseRouter = router;
