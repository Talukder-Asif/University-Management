import express from 'express';
import { FacultyController } from './faculty.controller';
import validateRequest from '../../Middleware/validateRequest';
import { FacultyValidation } from './faculty.validation';
import auth from '../../Middleware/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.get(
	'/',
	auth(USER_ROLE.admin, USER_ROLE.faculty),
	FacultyController.getAllFaculty,
);
router.get('/:id', FacultyController.getSingleFaculty);
router.patch(
	'/:id',
	validateRequest(FacultyValidation.updateFacultyValidationSchema),
	FacultyController.updateSingleFaculty,
);
router.delete('/:id', FacultyController.deleteFaculty);
export const FacultyRoutes = router;
