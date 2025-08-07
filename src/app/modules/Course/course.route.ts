import express from 'express';
import validateRequest from '../../Middleware/validateRequest';
import { CourseValidations } from './course.validation';
import { courseController } from './course.controller';
import auth from '../../Middleware/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
	'/create-course',
	auth(USER_ROLE.admin, USER_ROLE.superAdmin),
	validateRequest(CourseValidations.createCourseValidationSchema),
	courseController.createCourse,
);

router.get(
	'/',
	auth(
		USER_ROLE.admin,
		USER_ROLE.superAdmin,
		USER_ROLE.faculty,
		USER_ROLE.student,
	),
	courseController.getAllCourse,
);

router.get(
	'/:id',
	auth(
		USER_ROLE.admin,
		USER_ROLE.superAdmin,
		USER_ROLE.faculty,
		USER_ROLE.student,
	),
	courseController.getSingleCourse,
);

router.patch(
	'/:id',
	auth(USER_ROLE.admin, USER_ROLE.superAdmin),
	validateRequest(CourseValidations.updateCourseValidationSchema),
	courseController.updateCourse,
);

router.delete(
	'/:id',
	auth(USER_ROLE.admin, USER_ROLE.superAdmin),
	courseController.deleteCourse,
);

// Add and remove faculties from the Course
router.put(
	'/:courseId/assign-faculties',
	auth(USER_ROLE.admin, USER_ROLE.superAdmin),
	validateRequest(CourseValidations.facultyWithCourseValidationSchema),
	courseController.assignFacultiesWithCourse,
);
router.get(
	'/:courseId/get-faculties',
	auth(
		USER_ROLE.admin,
		USER_ROLE.superAdmin,
		USER_ROLE.faculty,
		USER_ROLE.student,
	),
	courseController.getFacultiesWithCourse,
);

router.delete(
	'/:courseId/remove-faculties',
	auth(USER_ROLE.admin, USER_ROLE.superAdmin),
	validateRequest(CourseValidations.facultyWithCourseValidationSchema),
	courseController.removeFacultiesFromCourse,
);

export const CourseRouters = router;
