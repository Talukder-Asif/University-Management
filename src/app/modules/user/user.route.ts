import express from 'express';
import { UserControllers } from './user.controller';
import { studentValidations } from '../student/student.validation';
import validateRequest from '../../Middleware/validateRequest';
import { FacultyValidation } from '../faculty/faculty.validation';
import { adminValidation } from '../admin/admin.validation';

const router = express.Router();

router.post(
	'/create-student',
	validateRequest(studentValidations.createStudentValidationSchema),
	UserControllers.createStudent,
);

router.post(
	'/create-faculty',
	validateRequest(FacultyValidation.createFacultyValidationSchema),
	UserControllers.createFaculty,
);

router.post(
	'/create-admin',
	validateRequest(adminValidation.createAdminValidationSchema),
	UserControllers.createAdmin,
);

export const UserRoutes = router;
