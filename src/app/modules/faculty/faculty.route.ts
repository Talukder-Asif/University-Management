import express from 'express';
import { FacultyController } from './faculty.controller';
import validateRequest from '../../Middleware/validateRequest';
import { FacultyValidation } from './faculty.validation';

const router = express.Router();

router.get('/', FacultyController.getAllFaculty);
router.get('/:id', FacultyController.getSingleFaculty);
router.patch('/:id', FacultyController.updateSingleFaculty);
router.delete(
	'/:id',
	validateRequest(FacultyValidation.updateFacultyValidationSchema),
	FacultyController.deleteFaculty,
);
export const FacultyRoutes = router;
