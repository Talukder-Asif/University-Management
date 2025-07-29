import express from 'express';
import { FacultyController } from './faculty.controller';
import validateRequest from '../../Middleware/validateRequest';
import { FacultyValidation } from './faculty.validation';
import auth from '../../Middleware/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.get(
	'/',
	auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.superAdmin),
	FacultyController.getAllFaculty,
);
router.get(
	'/:id',
	auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.superAdmin),
	FacultyController.getSingleFaculty,
);
router.patch(
	'/:id',
	auth(USER_ROLE.admin, USER_ROLE.superAdmin),
	validateRequest(FacultyValidation.updateFacultyValidationSchema),
	FacultyController.updateSingleFaculty,
);
router.delete(
	'/:id',
	auth(USER_ROLE.admin, USER_ROLE.superAdmin),
	FacultyController.deleteFaculty,
);
export const FacultyRoutes = router;
