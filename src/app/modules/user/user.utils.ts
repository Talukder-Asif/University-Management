// year semesterCode 4digit number

import { TAcademicSemester } from '../AcademicSemester/academicSemester.interface';
import { Admin } from '../admin/admin.model';
import { Faculty } from '../faculty/faculty.model';
import User from './user.model';

// StudentID Creation
const findLastStudentId = async () => {
	const lastStudent = await User.findOne(
		{
			role: 'student',
		},
		{
			id: 1,
			_id: 0,
		},
	)
		.sort({
			createdAt: -1,
		})
		.lean();

	//2030 01 0001
	return lastStudent?.id ? lastStudent.id : undefined;
};

export const generateStudentId = async (payload: TAcademicSemester) => {
	let currentId = (0).toString(); // 0000 by deafult

	const lastStudentId = await findLastStudentId();
	// 2030 01 0001
	const lastStudentSemesterCode = lastStudentId?.substring(4, 6); //01;
	const lastStudentYear = lastStudentId?.substring(0, 4); // 2030
	const currentSemesterCode = payload.code;
	const currentYear = payload.year;

	if (
		lastStudentId &&
		lastStudentSemesterCode === currentSemesterCode &&
		lastStudentYear === currentYear
	) {
		currentId = lastStudentId.substring(6); // 00001
	}

	let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

	incrementId = `${payload.year}${payload.code}${incrementId}`;

	return incrementId;
};

// FacultyID Creation
const findLastFaculty = async () => {
	const lastFaculty = await Faculty.findOne(
		{
			role: 'faculty',
		},
		{
			id: 1,
			_id: 0,
		},
	)
		.sort({
			createdAt: -1,
		})
		.lean();

	return lastFaculty?.id ? lastFaculty?.id : undefined;
};
export const generateFacultyID = async () => {
	// Find Last faculty's ID
	const lastFacultyID = await findLastFaculty();
	const currentId: string | undefined = lastFacultyID?.substring(2) || '0000';

	const incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

	return `F-${incrementId}`;
};
const findLastAdmin = async () => {
	const lastAdmin = await Admin.findOne(
		{
			role: 'admin',
		},
		{
			id: 1,
			_id: 0,
		},
	)
		.sort({
			createdAt: -1,
		})
		.lean();

	return lastAdmin?.id || undefined;
};
export const generateAdminID = async () => {
	const lastAdminID = await findLastAdmin();
	const currentId: string | undefined =
		lastAdminID?.substring(2) || '0000'.toString();
	const incrementAdminId = (Number(currentId) + 1).toString().padStart(4, '0');

	return `A-${incrementAdminId}`;
};
