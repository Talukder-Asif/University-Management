import { Router } from 'express';
import { StudentRoutes } from '../modules/student/student.route';
import { UserRoutes } from '../modules/user/user.route';
import { AcademicSemesterRoutes } from '../modules/AcademicSemester/academicSemester.route';

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
];

modules.forEach((route) => {
	router.use(route.path, route.route);
});

export default router;
