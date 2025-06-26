import express from 'express';
import validateRequest from '../../Middleware/validateRequest';
import { offeredCourseValidation } from './offeredCourse.validation';
import { offeredCourseControllers } from './offeredCourse.controller';

const router = express.Router();

router.post(
	'/create-offered-course',
	validateRequest(offeredCourseValidation.createOfferedCourseValidationSchema),
	offeredCourseControllers.createOfferedCourse,
);

router.get('/', offeredCourseControllers.getAllOfferedCourses);

router.get('/:id', offeredCourseControllers.getSingleOfferedCourses);

router.patch(
	'/:id',
	validateRequest(offeredCourseValidation.updateOfferedCourseValidationSchema),
	offeredCourseControllers.updateOfferedCourse,
);

router.delete('/:id', offeredCourseControllers.deleteOfferedCourseFromDB);

export const offeredCourseRoutes = router;
