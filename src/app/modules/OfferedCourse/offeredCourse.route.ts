import express from 'express';
import validateRequest from '../../Middleware/validateRequest';
import { offeredCourseValidation } from './offeredCourse.validation';
import { offeredCourseControllers } from './offeredCourse.controller';
import auth from '../../Middleware/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
	'/create-offered-course',
	auth(USER_ROLE.admin, USER_ROLE.superAdmin),
	validateRequest(offeredCourseValidation.createOfferedCourseValidationSchema),
	offeredCourseControllers.createOfferedCourse,
);

router.get(
	'/',
	auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.faculty),
	offeredCourseControllers.getAllOfferedCourses,
);

router.get(
	'/my-offered-courses',
	auth(USER_ROLE.student),
	offeredCourseControllers.getMyOfferedCourses,
);

router.get(
	'/:id',
	auth(
		USER_ROLE.admin,
		USER_ROLE.superAdmin,
		USER_ROLE.faculty,
		USER_ROLE.student,
	),
	offeredCourseControllers.getSingleOfferedCourses,
);

router.patch(
	'/:id',
	auth(USER_ROLE.admin, USER_ROLE.superAdmin),
	validateRequest(offeredCourseValidation.updateOfferedCourseValidationSchema),
	offeredCourseControllers.updateOfferedCourse,
);

router.delete(
	'/:id',
	auth(USER_ROLE.admin, USER_ROLE.superAdmin),
	offeredCourseControllers.deleteOfferedCourseFromDB,
);

export const offeredCourseRoutes = router;
