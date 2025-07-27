import express from 'express';
import { AcademicDepartmentController } from './academicDepartment.controller';
import validateRequest from '../../Middleware/validateRequest';
import { AcademicDepartmentValidation } from './academicDepartment.validation';
import auth from '../../Middleware/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
	'/create-academic-department',
	auth(USER_ROLE.admin, USER_ROLE.superAdmin),
	validateRequest(
		AcademicDepartmentValidation.createAcademicDepartmentValidationSchema,
	),
	AcademicDepartmentController.createAcademicDepartment,
);

router.get('/', AcademicDepartmentController.getAllAcademicDepartments);

router.get('/:id', AcademicDepartmentController.getSingleAcademicDepartment);

router.patch(
	'/:id',
	validateRequest(
		AcademicDepartmentValidation.updateAcademicDepartmentValidationSchema,
	),
	AcademicDepartmentController.updateAcademicDepartment,
);

export const AcademicDepartmentRoutes = router;
