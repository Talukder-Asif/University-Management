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

export const EnrolledCourseRouter = router;
