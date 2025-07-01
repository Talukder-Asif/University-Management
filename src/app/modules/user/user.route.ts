import express from 'express';
import { UserControllers } from './user.controller';
import { studentValidations } from '../student/student.validation';
import validateRequest from '../../Middleware/validateRequest';
import { FacultyValidation } from '../faculty/faculty.validation';
import { adminValidation } from '../admin/admin.validation';
import auth from '../../Middleware/auth';
import { USER_ROLE } from './user.constant';

const router = express.Router();

router.post(
	'/create-student',
	auth(USER_ROLE.admin),
	validateRequest(studentValidations.createStudentValidationSchema),
	UserControllers.createStudent,
);

router.post(
	'/create-faculty',
	auth(USER_ROLE.admin),
	validateRequest(FacultyValidation.createFacultyValidationSchema),
	UserControllers.createFaculty,
);

router.post(
	'/create-admin',
	// auth(USER_ROLE.admin),
	validateRequest(adminValidation.createAdminValidationSchema),
	UserControllers.createAdmin,
);

export const UserRoutes = router;
