import status from 'http-status';
import AppError from '../../errors/AppError';
import { OfferedCourse } from '../OfferedCourse/offeredCourse.model';
import { TEnrolledCourse } from './enrolledCourse.interface';
import EnrolledCourse from './enrolledCourse.model';
import { StudentModel } from '../student/student.model';
import mongoose from 'mongoose';

const createEnrolledCourseIntoDB = async (
	payload: TEnrolledCourse,
	userId: string,
) => {
	/*
    step-1: Check if the offer course is exist
    step-2: Check if the student is already enrolled on the course 
    step-3: check if the limit is not over
    step-n: Create an enrolledCourse 
    */

	const { offeredCourse } = payload;

	const isOfferedCourseExist = await OfferedCourse.findById(offeredCourse);

	if (!isOfferedCourseExist) {
		throw new AppError(status.BAD_REQUEST, 'Offered Course not found');
	}

	const student = await StudentModel.findOne({ id: userId }).select('_id');

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

export const enrolledCourseService = {
	createEnrolledCourseIntoDB,
};
