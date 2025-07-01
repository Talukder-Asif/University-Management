import express from 'express';
import { FacultyController } from './faculty.controller';
import validateRequest from '../../Middleware/validateRequest';
import { FacultyValidation } from './faculty.validation';
import auth from '../../Middleware/auth';

const router = express.Router();

router.get('/', auth(), FacultyController.getAllFaculty);
router.get('/:id', FacultyController.getSingleFaculty);
router.patch(
	'/:id',
	validateRequest(FacultyValidation.updateFacultyValidationSchema),
	FacultyController.updateSingleFaculty,
);
router.delete('/:id', FacultyController.deleteFaculty);
export const FacultyRoutes = router;
