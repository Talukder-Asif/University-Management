import status from 'http-status';
import AppError from '../../errors/AppError';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import { TOfferedCourse } from './offeredCourse.interface';
import { OfferedCourse } from './offeredCourse.model';
import { AcademicFaculty } from '../academicFaculty/academicFaculty.model';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { Course } from '../Course/course.model';
import { Faculty } from '../faculty/faculty.model';

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
	const {
		semesterRegistration,
		academicFaculty,
		academicDepartment,
		course,
		faculty,
	} = payload;

	// check if the semesterRegistration id is exists!
	const isSemesterRegistrationExist =
		await SemesterRegistration.findById(semesterRegistration);

	if (!isSemesterRegistrationExist) {
		throw new AppError(status.NOT_FOUND, 'Semester Registration not found');
	}

	// check if the AcademicFaculty id is exists!
	const isAcademicFacultyExist =
		await AcademicFaculty.findById(academicFaculty);

	if (!isAcademicFacultyExist) {
		throw new AppError(status.NOT_FOUND, 'Semester Faculty not found');
	}

	// check if the AcademicDepartment id is exists!
	const isAcademicDepartmentExist =
		await AcademicDepartment.findById(academicDepartment);

	if (!isAcademicDepartmentExist) {
		throw new AppError(status.NOT_FOUND, 'Semester Department not found');
	}

	// check if the Course id is exists!
	const isCourseExist = await Course.findById(course);

	if (!isCourseExist) {
		throw new AppError(status.NOT_FOUND, 'Course not found');
	}

	// check if the Faculty id is exists!
	const isFacultyExist = await Faculty.findById(faculty);

	if (!isFacultyExist) {
		throw new AppError(status.NOT_FOUND, 'Faculty not found');
	}

	const academicSemester = isSemesterRegistrationExist.academicSemester;

	const result = await OfferedCourse.create({ ...payload, academicSemester });

	return result;
};

const getAllOfferedCourseFromDB = async (Query: Record<string, unknown>) => {
	const result = await OfferedCourse.find(Query);
	return result;
};

const getSingleOfferedCourseFromDB = async (id: string) => {
	const result = await OfferedCourse.findById(id);
	return result;
};

const updateOfferedCourseIntoDB = async (
	id: string,
	payload: Partial<TOfferedCourse>,
) => {
	const result = await OfferedCourse.findByIdAndUpdate(id, payload);
	return result;
};

export const offeredCourseServices = {
	createOfferedCourseIntoDB,
	getAllOfferedCourseFromDB,
	getSingleOfferedCourseFromDB,
	updateOfferedCourseIntoDB,
};
