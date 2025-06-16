import { Router } from 'express';
import { StudentRoutes } from '../modules/student/student.route';
import { UserRoutes } from '../modules/user/user.route';
import { AcademicSemesterRoutes } from '../modules/AcademicSemester/academicSemester.route';
import { AcademicFacultyRoutes } from '../modules/academicFaculty/academicFaculty.routes';
import { AcademicDepartmentRoutes } from '../modules/academicDepartment/academicDepartment.route';

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
];

modules.forEach((route) => {
	router.use(route.path, route.route);
});

export default router;
