import express from 'express';
import { SemesterRegistrationController } from './semesterRegistration.controller';
import validateRequest from '../../Middleware/validateRequest';
import { semesterRegistrationValidation } from './semesterRegistration.validation';

const router = express.Router();

router.post(
	'/create-semester-registration',
	validateRequest(
		semesterRegistrationValidation.createSemesterRegistrationSchema,
	),
	SemesterRegistrationController.createSemesterRegistration,
);

router.get(
	'/:id',
	SemesterRegistrationController.getSingleSemesterRegistration,
);

router.patch(
	'/:id',
	validateRequest(
		semesterRegistrationValidation.updateSemesterRegistrationSchema,
	),
	SemesterRegistrationController.updateSemesterRegistration,
);

router.get(
	'/:id',
	SemesterRegistrationController.getSingleSemesterRegistration,
);

router.delete(
	'/:id',
	SemesterRegistrationController.deleteSemesterRegistration,
);

router.get('/', SemesterRegistrationController.getAllSemesterRegistrations);

export const semesterRegistrationRoutes = router;
