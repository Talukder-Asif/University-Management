import express from 'express';
import { AcademicSemesterControllers } from './academicSemester.controller';
import validateRequest from '../../Middleware/validateRequest';
import { AcademicSemesterValidation } from './academicSemester.validation';

const router = express.Router();

router.post(
	'/create-semester',
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
