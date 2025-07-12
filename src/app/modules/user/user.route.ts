import express, { NextFunction, Request, Response } from 'express';
import { UserControllers } from './user.controller';
import { studentValidations } from '../student/student.validation';
import validateRequest from '../../Middleware/validateRequest';
import { FacultyValidation } from '../faculty/faculty.validation';
import { adminValidation } from '../admin/admin.validation';
import auth from '../../Middleware/auth';
import { USER_ROLE } from './user.constant';
import { userValidation } from './user.validation';
import { upload } from '../../utils/sendImageToCloudinary';

const router = express.Router();

router.post(
	'/create-student',
	auth(USER_ROLE.admin),
	upload.single('file'),
	(req: Request, res: Response, next: NextFunction) => {
		req.body = JSON.parse(req.body.data);
		next();
	},
	validateRequest(studentValidations.createStudentValidationSchema),
	UserControllers.createStudent,
);

router.post(
	'/create-faculty',
	auth(USER_ROLE.admin),
	upload.single('file'),
	(req: Request, res: Response, next: NextFunction) => {
		req.body = JSON.parse(req.body.data);
		next();
	},
	validateRequest(FacultyValidation.createFacultyValidationSchema),
	UserControllers.createFaculty,
);

router.post(
	'/create-admin',
	// auth(USER_ROLE.admin),
	validateRequest(adminValidation.createAdminValidationSchema),
	UserControllers.createAdmin,
);

router.get(
	'/me',
	auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
	UserControllers.getMe,
);

router.post(
	'/change-status/:id',
	auth(USER_ROLE.admin),
	validateRequest(userValidation.changeStatusValidationSchema),
	UserControllers.changeStatus,
);

export const UserRoutes = router;
