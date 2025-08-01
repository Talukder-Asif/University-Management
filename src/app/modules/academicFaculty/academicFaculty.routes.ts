import express from 'express';
import { AcademicFacultyController } from './academicFaculty.controller';
import validateRequest from '../../Middleware/validateRequest';
import { AcademicFacultyValidation } from './academicFaculty.validation';
import auth from '../../Middleware/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
	'/create-academic-faculty',
	auth(USER_ROLE.superAdmin, USER_ROLE.admin),
	validateRequest(
		AcademicFacultyValidation.createAcademicFacultyValidationSchema,
	),
	AcademicFacultyController.createAcademicFaculty,
);

router.get('/', AcademicFacultyController.getAllAcademicFaculties);

router.get('/:id', AcademicFacultyController.getSingleAcademicFacultyFormDB);

router.patch(
	'/:id',
	validateRequest(
		AcademicFacultyValidation.updateAcademicFacultyValidationSchema,
	),
	AcademicFacultyController.updateAcademicFaculty,
);

export const AcademicFacultyRoutes = router;
