import status from 'http-status';
import AppError from '../../errors/AppError';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import { TOfferedCourse } from './offeredCourse.interface';
import { OfferedCourse } from './offeredCourse.model';
import { AcademicFaculty } from '../academicFaculty/academicFaculty.model';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { Course } from '../Course/course.model';
import { Faculty } from '../faculty/faculty.model';
import { hasTimeConflict } from './offeredCourse.utils';
import QueryBuilder from '../../builder/QueryBuilder';

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
	const {
		semesterRegistration,
		academicFaculty,
		academicDepartment,
		course,
		section,
		faculty,
		days,
		startTime,
		endTime,
	} = payload;

	/*
	 * Step 1: check if the semester registration id is exists!
	 * Step 2: check if the academic faculty id is exists!
	 * Step 3: check if the academic department id is exists!
	 * Step 4: check if the course id is exists!
	 * Step 5: check if the faculty id is exists!
	 * Step 6: check if the department is belong to the  faculty
	 * Step 7: check if the same offered course same section in same registered semester exists
	 * Step 8: get the schedules of the faculties
	 * Step 9: check if the faculty is available at that time. If not then throw error
	 * Step 10: create the offered course
	 */

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

	// Check if the department is belong to the faculty
	const isDepartmentBelongToFaculty = await AcademicDepartment.findOne({
		_id: academicDepartment,
		academicFaculty,
	});
	if (!isDepartmentBelongToFaculty) {
		throw new AppError(
			status.BAD_REQUEST,
			`This ${isAcademicDepartmentExist.name} is not belong to this ${isAcademicFacultyExist.name}`,
		);
	}

	// Check if the same offered course same section in same registered semester exists
	const isSameOfferedCourseExistWithSameRegSemesterWithSameSec =
		await OfferedCourse.findOne({
			semesterRegistration,
			course,
			section,
		});
	if (isSameOfferedCourseExistWithSameRegSemesterWithSameSec) {
		throw new AppError(
			status.BAD_REQUEST,
			`Offered course same section in same registered semester is already exists`,
		);
	}

	// get the schedules of the faculties
	const assignedSchedules = await OfferedCourse.find({
		semesterRegistration,
		faculty,
		days: { $in: days },
	}).select('days startTime endTime');

	const newSchedule = {
		days,
		startTime,
		endTime,
	};

	if (hasTimeConflict(assignedSchedules, newSchedule)) {
		throw new AppError(
			status.CONFLICT,
			`This faculty is not available at that time ! Choose other time or day`,
		);
	}

	// Make ready to create.....
	const academicSemester = isSemesterRegistrationExist.academicSemester;

	const result = await OfferedCourse.create({ ...payload, academicSemester });

	return result;
};

const getAllOfferedCourseFromDB = async (query: Record<string, unknown>) => {
	const offeredCourseQuery = new QueryBuilder(OfferedCourse.find(), query)
		.filter()
		.sort()
		.paginate()
		.fields();

	const result = await offeredCourseQuery.modelQuery;
	return result;
};

const getSingleOfferedCourseFromDB = async (id: string) => {
	const result = await OfferedCourse.findById(id);

	if (!result) {
		throw new AppError(404, 'Offered Course not found');
	}

	return result;
};

const updateOfferedCourseIntoDB = async (
	id: string,
	payload: Pick<TOfferedCourse, 'faculty' | 'days' | 'startTime' | 'endTime'>,
) => {
	/**
	 * Step 1: check if the offered course exists
	 * Step 2: check if the faculty exists
	 * Step 3: check if the semester registration status is upcoming
	 * Step 4: check if the faculty is available at that time. If not then throw error
	 * Step 5: update the offered course
	 */
	const { faculty, days, startTime, endTime } = payload;

	const isOfferedCourseExists = await OfferedCourse.findById(id);

	if (!isOfferedCourseExists) {
		throw new AppError(status.NOT_FOUND, 'Offered course not found !');
	}

	const isFacultyExists = await Faculty.findById(faculty);

	if (!isFacultyExists) {
		throw new AppError(status.NOT_FOUND, 'Faculty not found !');
	}

	const semesterRegistration = isOfferedCourseExists.semesterRegistration;
	// get the schedules of the faculties

	// Checking the status of the semester registration
	const semesterRegistrationStatus =
		await SemesterRegistration.findById(semesterRegistration);

	if (semesterRegistrationStatus?.status !== 'UPCOMING') {
		throw new AppError(
			status.BAD_REQUEST,
			`You can not update this offered course as it is ${semesterRegistrationStatus?.status}`,
		);
	}

	// check if the faculty is available at that time.
	const assignedSchedules = await OfferedCourse.find({
		semesterRegistration,
		faculty,
		days: { $in: days },
	}).select('days startTime endTime');

	const newSchedule = {
		days,
		startTime,
		endTime,
	};

	if (hasTimeConflict(assignedSchedules, newSchedule)) {
		throw new AppError(
			status.CONFLICT,
			`This faculty is not available at that time ! Choose other time or day`,
		);
	}

	const result = await OfferedCourse.findByIdAndUpdate(id, payload, {
		new: true,
	});
	return result;
};

const deleteOfferedCourseFromDB = async (id: string) => {
	/**
	 * Step 1: check if the offered course exists
	 * Step 2: check if the semester registration status is upcoming
	 * Step 3: delete the offered course
	 */
	const isOfferedCourseExists = await OfferedCourse.findById(id);

	if (!isOfferedCourseExists) {
		throw new AppError(status.NOT_FOUND, 'Offered Course not found');
	}

	const semesterRegistration = isOfferedCourseExists.semesterRegistration;

	const semesterRegistrationStatus =
		await SemesterRegistration.findById(semesterRegistration).select('status');

	if (semesterRegistrationStatus?.status !== 'UPCOMING') {
		throw new AppError(
			status.BAD_REQUEST,
			`Offered course can not update ! because the semester ${semesterRegistrationStatus}`,
		);
	}

	const result = await OfferedCourse.findByIdAndDelete(id);

	return result;
};

export const offeredCourseServices = {
	createOfferedCourseIntoDB,
	getAllOfferedCourseFromDB,
	getSingleOfferedCourseFromDB,
	updateOfferedCourseIntoDB,
	deleteOfferedCourseFromDB,
};
