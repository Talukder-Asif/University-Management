/* eslint-disable @typescript-eslint/no-explicit-any */

import config from '../../config';
import { TStudent } from '../student/student.interface';
import { TUser } from './user.interface';
import User from './user.model';
import { StudentModel } from '../student/student.model';
import { AcademicSemester } from '../AcademicSemester/academicSemester.model';
import { generateStudentId } from './user.utils';
import AppError from '../../errors/AppError';
import mongoose from 'mongoose';
import status from 'http-status';

const createStudentIntoDB = async (password: string, payload: TStudent) => {
	// Create a user
	const userData: Partial<TUser> = {};

	// if password is not given then use default password
	userData.password = password || (config.default_password as string);

	// Set student role
	userData.role = 'student';
	userData.email = payload.email;

	const admissionSemester = await AcademicSemester.findById(
		payload.admissionSemester,
	);

	if (!admissionSemester) {
		throw new AppError(404, 'Invalid semester ID provided');
	}

	// Create a session for transaction
	const session = await mongoose.startSession();

	try {
		// Start a session
		session.startTransaction();

		userData.id = await generateStudentId(admissionSemester);

		// create a user model(Transection 1)
		const newUser = await User.create([userData], { session });

		// Create a Student
		if (!newUser.length) {
			throw new AppError(status.BAD_REQUEST, 'Failed to create user');
		}
		payload.id = newUser[0].id;
		payload.user = newUser[0]._id;

		// Create a student model(Transection 2)
		const newStudent = await StudentModel.create([payload], { session });
		if (!newStudent.length) {
			throw new AppError(status.BAD_REQUEST, 'Failed to create student');
		}

		// Commit the transaction
		await session.commitTransaction();
		session.endSession();

		return newStudent;
	} catch (error: any) {
		await session.abortTransaction();
		session.endSession();
		throw new Error(error);
	}
};

export const UserService = {
	createStudentIntoDB,
};
