import express from 'express';
import validateRequest from '../../Middleware/validateRequest';
import { CourseValidations } from './course.validation';
import { courseController } from './course.controller';

const router = express.Router();

router.post(
	'/create-course',
	validateRequest(CourseValidations.createCourseValidationSchema),
	courseController.createCourse,
);

router.get('/', courseController.getAllCourse);

router.get('/:id', courseController.getSingleCourse);

router.patch(
	'/:id',
	validateRequest(CourseValidations.updateCourseValidationSchema),
	courseController.updateCourse,
);

router.delete('/:id', courseController.deleteCourse);

// Add and remove faculties from the Course
router.put(
	'/:courseId/assign-faculties',
	validateRequest(CourseValidations.facultyWithCourseValidationSchema),
	courseController.assignFacultiesWithCourse,
);

router.delete(
	'/:courseId/remove-faculties',
	validateRequest(CourseValidations.facultyWithCourseValidationSchema),
	courseController.removeFacultiesFromCourse,
);

export const CourseRouters = router;
