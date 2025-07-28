/* eslint-disable @typescript-eslint/no-explicit-any */

import mongoose from 'mongoose';
import { StudentModel } from './student.model';
import AppError from '../../errors/AppError';
import status from 'http-status';
import User from '../user/user.model';
import { TStudent } from './student.interface';
import QueryBuilder from '../../builder/QueryBuilder';
import { studentSearchableFields } from './student.constant';

const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
	const studentQuery = new QueryBuilder(StudentModel.find(), query)
		.search(studentSearchableFields)
		.filter()
		.sort()
		.paginate()
		.fields();

	const result = await studentQuery.modelQuery;
	const meta = await studentQuery.countTotal();

	return { result, meta };
};

const getSingleStudentFromDB = async (id: string) => {
	const result = await StudentModel.findOne({ id });
	if (!result) {
		throw new AppError(status.NOT_FOUND, 'Student not found');
	}
	return result;
};

const updateStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {
	const { name, guardian, localGuardian, ...remainingStudentData } = payload;

	const modifiedUpdatedData: Record<string, unknown> = {
		...remainingStudentData,
	};

	/*
	  guardain: {
		fatherOccupation:"Teacher"
	  }
  
	  guardian.fatherOccupation = Teacher
  
	  name.firstName = 'Asif'
	  name.lastName = 'Talukder'
	*/

	if (name && Object.keys(name).length) {
		for (const [key, value] of Object.entries(name)) {
			modifiedUpdatedData[`name.${key}`] = value;
		}
	}

	if (guardian && Object.keys(guardian).length) {
		for (const [key, value] of Object.entries(guardian)) {
			modifiedUpdatedData[`guardian.${key}`] = value;
		}
	}

	if (localGuardian && Object.keys(localGuardian).length) {
		for (const [key, value] of Object.entries(localGuardian)) {
			modifiedUpdatedData[`localGuardian.${key}`] = value;
		}
	}
	const result = await StudentModel.findOneAndUpdate(
		{ id },
		modifiedUpdatedData,
		{
			new: true,
			runValidators: true,
		},
	);
	return result;
};
const deleteStudentFromDB = async (id: string) => {
	const session = await mongoose.startSession();

	try {
		// Start a session
		session.startTransaction();

		const deletedStudent = await StudentModel.findOneAndUpdate(
			{ id },
			{ isDeleted: true },
			{ new: true, session },
		);

		if (!deletedStudent) {
			throw new AppError(status.BAD_REQUEST, 'Can not delete student');
		}

		const deletedUser = await User.findOneAndUpdate(
			{ id },
			{ isDeleted: true },
			{ new: true, session },
		);
		if (!deletedUser) {
			throw new AppError(status.BAD_REQUEST, 'Can not delete user');
		}
		// Commit the transaction
		await session.commitTransaction();
		await session.endSession();
		return deletedStudent;
	} catch (err: any) {
		await session.abortTransaction();
		await session.endSession();
		throw new Error(err);
	}
};

export const StudentServices = {
	getAllStudentsFromDB,
	getSingleStudentFromDB,
	deleteStudentFromDB,
	updateStudentIntoDB,
};
