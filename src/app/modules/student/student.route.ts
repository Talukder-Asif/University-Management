import express from 'express';
import { StudentControllers } from './student.controller';
import validateRequest from '../../Middleware/validateRequest';
import { studentValidations } from './student.validation';
import auth from '../../Middleware/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.get(
	'/',
	auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.faculty),
	StudentControllers.getAllStudents,
);

router.get(
	'/:studentId',
	auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.faculty),
	StudentControllers.getSingleStudent,
);

router.delete(
	'/:studentId',
	auth(USER_ROLE.admin, USER_ROLE.superAdmin),
	StudentControllers.deleteStudent,
);

router.patch(
	'/:studentId',
	auth(USER_ROLE.admin, USER_ROLE.superAdmin),

	validateRequest(studentValidations.updateStudentValidationSchema),
	StudentControllers.updateStudent,
);

export const StudentRoutes = router;
