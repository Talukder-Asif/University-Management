/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import { TFaculty } from './faculty.interface';
import { Faculty } from './faculty.model';
import User from '../user/user.model';
import AppError from '../../errors/AppError';
import status from 'http-status';

const getAllFacultyFromDB = async () => {
	const result = await Faculty.find({});
	return result;
};

const getSingleFacultyFromDB = async (id: string) => {
	const result = await Faculty.findById(id);
	return result;
};

const updateSingleFacultyFromDB = async (
	id: string,
	payload: Partial<TFaculty>,
) => {
	const { name, ...remainingFacultyData } = payload;
	const modifiedUpdatedData: Record<string, unknown> = {
		...remainingFacultyData,
	};

	if (name && Object.keys(name).length) {
		for (const [key, value] of Object.entries(name)) {
			modifiedUpdatedData[`name.${key}`] = value;
		}
	}

	const result = await Faculty.findByIdAndUpdate(id, modifiedUpdatedData, {
		new: true,
		runValidators: true,
	});

	return result;
};

const deleteFacultyFromDB = async (id: string) => {
	const session = await mongoose.startSession();

	try {
		session.startTransaction();

		const deletedFaculty = await Faculty.findByIdAndUpdate(
			id,
			{ isDeleted: true },
			{ new: true, session },
		);

		if (!deletedFaculty) {
			throw new AppError(status.BAD_REQUEST, 'Failed to delete faculty');
		}

		// get user _id from deletedFaculty
		const userId = deletedFaculty.user;

		const deletedUser = await User.findByIdAndUpdate(
			userId,
			{ isDeleted: true },
			{ new: true, session },
		);

		if (!deletedUser) {
			throw new AppError(status.BAD_REQUEST, 'Failed to delete user');
		}

		await session.commitTransaction();
		await session.endSession();

		return deletedFaculty;
	} catch (err: any) {
		await session.abortTransaction();
		await session.endSession();
		throw new Error(err);
	}
};

export const FacultyService = {
	getAllFacultyFromDB,
	getSingleFacultyFromDB,
	updateSingleFacultyFromDB,
	deleteFacultyFromDB,
};
