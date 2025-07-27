import express from 'express';
import { AcademicSemesterControllers } from './academicSemester.controller';
import validateRequest from '../../Middleware/validateRequest';
import { AcademicSemesterValidation } from './academicSemester.validation';
import auth from '../../Middleware/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
	'/create-semester',
	auth(USER_ROLE.admin, USER_ROLE.superAdmin),
	validateRequest(AcademicSemesterValidation.createAcademicSemesterZodSchema),
	AcademicSemesterControllers.createAcademicSemester,
);
router.get('/', AcademicSemesterControllers.getAllAcademicSemester);

router.get('/:id', AcademicSemesterControllers.getSingleAcademicSemester);

router.patch(
	'/:id',
	validateRequest(AcademicSemesterValidation.updateAcademicSemesterZodSchema),
	AcademicSemesterControllers.updateAcademicSemester,
);

export const AcademicSemesterRoutes = router;
