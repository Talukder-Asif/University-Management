import express from 'express';
import { SemesterRegistrationController } from './semesterRegistration.controller';
import validateRequest from '../../Middleware/validateRequest';
import { semesterRegistrationValidation } from './semesterRegistration.validation';
import auth from '../../Middleware/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
	'/create-semester-registration',
	auth(USER_ROLE.admin, USER_ROLE.superAdmin),
	validateRequest(
		semesterRegistrationValidation.createSemesterRegistrationSchema,
	),
	SemesterRegistrationController.createSemesterRegistration,
);

router.get(
	'/:id',
	auth(
		USER_ROLE.admin,
		USER_ROLE.faculty,
		USER_ROLE.student,
		USER_ROLE.superAdmin,
	),
	SemesterRegistrationController.getSingleSemesterRegistration,
);

router.patch(
	'/:id',
	auth(USER_ROLE.admin, USER_ROLE.superAdmin),
	validateRequest(
		semesterRegistrationValidation.updateSemesterRegistrationSchema,
	),
	SemesterRegistrationController.updateSemesterRegistration,
);

router.get(
	'/:id',
	auth(
		USER_ROLE.admin,
		USER_ROLE.faculty,
		USER_ROLE.student,
		USER_ROLE.superAdmin,
	),
	SemesterRegistrationController.getSingleSemesterRegistration,
);

router.delete(
	'/:id',
	auth(USER_ROLE.admin, USER_ROLE.superAdmin),
	SemesterRegistrationController.deleteSemesterRegistration,
);

router.get(
	'/',
	auth(
		USER_ROLE.admin,
		USER_ROLE.faculty,
		USER_ROLE.student,
		USER_ROLE.superAdmin,
	),
	SemesterRegistrationController.getAllSemesterRegistrations,
);

export const semesterRegistrationRoutes = router;
