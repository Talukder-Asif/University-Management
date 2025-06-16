import mongoose from 'mongoose';
import { StudentModel } from './student.model';
import AppError from '../../errors/AppError';
import status from 'http-status';
import User from '../user/user.model';
import { TStudent } from './student.interface';

const getAllStudentsFromDB = async () => {
	const result = await StudentModel.find();
	return result;
};

const getSingleStudentFromDB = async (id: string) => {
	const result = await StudentModel.findOne({ id });
	return result;
};

const updateStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {
	const result = await StudentModel.findOneAndUpdate({ id }, payload, {
		new: true,
	});

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
	} catch (err) {
		await session.abortTransaction();
		await session.endSession();
	}
};

export const StudentServices = {
	getAllStudentsFromDB,
	getSingleStudentFromDB,
	deleteStudentFromDB,
	updateStudentIntoDB,
};
