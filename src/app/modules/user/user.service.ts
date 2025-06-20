/* eslint-disable @typescript-eslint/no-explicit-any */

import config from '../../config';
import { TStudent } from '../student/student.interface';
import { TUser } from './user.interface';
import User from './user.model';
import { StudentModel } from '../student/student.model';
import { AcademicSemester } from '../AcademicSemester/academicSemester.model';
import { generateFacultyID, generateStudentId } from './user.utils';
import AppError from '../../errors/AppError';
import mongoose from 'mongoose';
import status from 'http-status';
import { TFaculty } from '../faculty/faculty.interface';
import { Faculty } from '../faculty/faculty.model';

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

const createFacultyIntoDB = async (password: string, payload: TFaculty) => {
	const userData: Partial<TUser> = {};
	userData.password = password || (config.default_password as string);
	userData.role = 'faculty';
	userData.email = payload.email;

	// Create a session for transaction
	const session = await mongoose.startSession();

	try {
		// Start a session transaction
		session.startTransaction();

		// generate a faculty ID
		userData.id = await generateFacultyID();

		const newUser = await User.create([userData], { session });

		if (!newUser) {
			throw new AppError(status.BAD_REQUEST, 'Failed to create student');
		}

		payload.user = newUser[0]?._id;
		payload.id = newUser[0]?.id;

		const newFaculty = await Faculty.create([payload], { session });
		if (!newFaculty) {
			throw new AppError(status.BAD_REQUEST, 'Failed to create student');
		}
		await session.commitTransaction();
		await session.endSession();
		return newFaculty;
	} catch (err: any) {
		await session.abortTransaction();
		await session.endSession();
		throw new Error(err);
	}
};

export const UserService = {
	createStudentIntoDB,
	createFacultyIntoDB,
};
