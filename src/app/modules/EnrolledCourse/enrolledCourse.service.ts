import status from 'http-status';
import AppError from '../../errors/AppError';
import { OfferedCourse } from '../OfferedCourse/offeredCourse.model';
import { TEnrolledCourse } from './enrolledCourse.interface';
import EnrolledCourse from './enrolledCourse.model';
import { StudentModel } from '../student/student.model';
import mongoose from 'mongoose';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import { Course } from '../Course/course.model';
import { Faculty } from '../faculty/faculty.model';
import { calculateGradeAndPoints } from './enrolledCourse.utils';

const createEnrolledCourseIntoDB = async (
	payload: TEnrolledCourse,
	userId: string,
) => {
	/*
    step-1: Check if the offer course is exist
    step-2: Check if the student is already enrolled on the course 
    step-3: check if the maxCredit is not over
    step-n: Create an enrolledCourse 
    */

	const { offeredCourse } = payload;

	const isOfferedCourseExist = await OfferedCourse.findById(offeredCourse);

	if (!isOfferedCourseExist) {
		throw new AppError(status.BAD_REQUEST, 'Offered Course not found');
	}

	const course = await Course.findById(isOfferedCourseExist.course);

	const student = await StudentModel.findOne({ id: userId }, { _id: 1 });

	if (!student) {
		throw new AppError(status.BAD_REQUEST, 'Student not found');
	}

	const isStudentAlreadyEnrolled = await EnrolledCourse.findOne({
		semesterRegistration: isOfferedCourseExist.semesterRegistration,
		offeredCourse,
		student: student._id,
	});

	if (isStudentAlreadyEnrolled) {
		throw new AppError(status.CONFLICT, 'Student is already enrolled');
	}

	if (isOfferedCourseExist.maxCapacity <= 0) {
		throw new AppError(status.BAD_GATEWAY, 'Room is full!');
	}
	const session = await mongoose.startSession();

	// Check total credits don't cross the max credit limits
	const semesterRegistration = await SemesterRegistration.findById(
		isOfferedCourseExist.semesterRegistration,
		{ maxCredit: 1 },
	);

	// to do this -> use aggregate and find the sum of total courses
	const enrolledCredits = await EnrolledCourse.aggregate([
		{
			$match: {
				semesterRegistration: isOfferedCourseExist.semesterRegistration,
				student: student._id,
			},
		},
		{
			$lookup: {
				from: 'courses',
				localField: 'course',
				foreignField: '_id',
				as: 'enrolledCourseData',
			},
		},
		{
			$unwind: '$enrolledCourseData',
		},
		{
			$group: {
				_id: null,
				totalEnrolledCredits: { $sum: '$enrolledCourseData.credits' },
			},
		},
		{
			$project: {
				_id: 0,
				totalEnrolledCredits: 1,
			},
		},
	]);
	//to do this -> total enrolled Credits + new enrolled Course Credits > maxCredit

	const totalCredits =
		enrolledCredits.length > 0 ? enrolledCredits[0].totalEnrolledCredits : 0;

	if (
		totalCredits &&
		semesterRegistration?.maxCredit &&
		totalCredits + course?.credits > semesterRegistration?.maxCredit
	) {
		throw new AppError(
			status.BAD_REQUEST,
			'You have exceeded maximum number of credits...',
		);
	}

	try {
		session.startTransaction();

		const result = await EnrolledCourse.create(
			[
				{
					semesterRegistration: isOfferedCourseExist.semesterRegistration,
					academicSemester: isOfferedCourseExist.academicSemester,
					academicFaculty: isOfferedCourseExist.academicFaculty,
					academicDepartment: isOfferedCourseExist.academicDepartment,
					isEnrolled: true,
					offeredCourse: offeredCourse,
					course: isOfferedCourseExist.course,
					student: student._id,
					faculty: isOfferedCourseExist.faculty,
				},
			],
			{ session },
		);

		if (!result) {
			throw new AppError(
				status.BAD_REQUEST,
				'Failed to enrolled in this course',
			);
		}

		const maxCapacity = isOfferedCourseExist.maxCapacity;

		await OfferedCourse.findByIdAndUpdate(offeredCourse, {
			maxCapacity: maxCapacity - 1,
		});

		await session.commitTransaction();
		await session.endSession();
		return result;
	} catch (err: unknown) {
		await session.abortTransaction();
		await session.endSession();

		throw new Error(err as string);
	}
};

const updateEnrolledCourseMarksIntoDB = async (
	facultyId: string,
	payload: Partial<TEnrolledCourse>,
) => {
	const { semesterRegistration, offeredCourse, student, courseMarks } = payload;

	const isSemesterRegistrationExists =
		await SemesterRegistration.findById(semesterRegistration);

	if (!isSemesterRegistrationExists) {
		throw new AppError(status.NOT_FOUND, 'Semester registration not found !');
	}

	const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse);

	if (!isOfferedCourseExists) {
		throw new AppError(status.NOT_FOUND, 'Offered course not found !');
	}
	const isStudentExists = await StudentModel.findById(student);

	if (!isStudentExists) {
		throw new AppError(status.NOT_FOUND, 'Student not found !');
	}

	const faculty = await Faculty.findOne({ id: facultyId }, { _id: 1 });

	if (!faculty) {
		throw new AppError(status.NOT_FOUND, 'Faculty not found !');
	}

	const isCourseBelongToFaculty = await EnrolledCourse.findOne({
		semesterRegistration,
		offeredCourse,
		student,
		faculty: faculty._id,
	});

	if (!isCourseBelongToFaculty) {
		throw new AppError(status.FORBIDDEN, 'You are forbidden! !');
	}

	const modifiedData: Record<string, unknown> = {
		...courseMarks,
	};

	if (courseMarks?.finalTerm) {
		const { classTest1, classTest2, midTerm, finalTerm } =
			isCourseBelongToFaculty.courseMarks;

		const totalMarks =
			Math.ceil(classTest1) +
			Math.ceil(midTerm) +
			Math.ceil(classTest2) +
			Math.ceil(finalTerm);

		const result = calculateGradeAndPoints(totalMarks);

		modifiedData.grade = result.grade;
		modifiedData.gradePoints = result.gradePoints;
		modifiedData.isCompleted = true;
	}

	if (courseMarks && Object.keys(courseMarks).length) {
		for (const [key, value] of Object.entries(courseMarks)) {
			modifiedData[`courseMarks.${key}`] = value;
		}
	}

	const result = await EnrolledCourse.findByIdAndUpdate(
		isCourseBelongToFaculty._id,
		modifiedData,
		{
			new: true,
		},
	);

	return result;
};

export const enrolledCourseService = {
	createEnrolledCourseIntoDB,
	updateEnrolledCourseMarksIntoDB,
};
