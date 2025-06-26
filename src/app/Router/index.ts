import { Router } from 'express';
import { StudentRoutes } from '../modules/student/student.route';
import { UserRoutes } from '../modules/user/user.route';
import { AcademicSemesterRoutes } from '../modules/AcademicSemester/academicSemester.route';
import { AcademicFacultyRoutes } from '../modules/academicFaculty/academicFaculty.routes';
import { AcademicDepartmentRoutes } from '../modules/academicDepartment/academicDepartment.route';
import { FacultyRoutes } from '../modules/faculty/faculty.route';
import { AdminRouter } from '../modules/admin/admin.route';
import { CourseRouters } from '../modules/Course/course.route';
import { semesterRegistrationRoutes } from '../modules/semesterRegistration/semesterRegistration.route';
import { offeredCourseRoutes } from '../modules/OfferedCourse/offeredCourse.route';

const router = Router();
const modules = [
	{
		path: '/students',
		route: StudentRoutes,
	},
	{
		path: '/users',
		route: UserRoutes,
	},
	{
		path: '/academic-semesters',
		route: AcademicSemesterRoutes,
	},
	{
		path: '/academic-faculties',
		route: AcademicFacultyRoutes,
	},
	{
		path: '/academic-departments',
		route: AcademicDepartmentRoutes,
	},
	{
		path: '/faculties',
		route: FacultyRoutes,
	},
	{
		path: '/admins',
		route: AdminRouter,
	},
	{
		path: '/courses',
		route: CourseRouters,
	},
	{
		path: '/semester-registration',
		route: semesterRegistrationRoutes,
	},
	{
		path: '/offered-courses',
		route: offeredCourseRoutes,
	},
];

modules.forEach((route) => {
	router.use(route.path, route.route);
});

export default router;
