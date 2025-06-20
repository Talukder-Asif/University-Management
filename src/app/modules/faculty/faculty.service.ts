import mongoose from 'mongoose';
import { TFaculty } from './faculty.interface';
import { Faculty } from './faculty.model';
import User from '../user/user.model';

const getAllFacultyFromDB = async () => {
	const result = await Faculty.find({});
	return result;
};

const getSingleFacultyFromDB = async (id: string) => {
	const result = await Faculty.findOne({ id });
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

	const result = await Faculty.findOneAndUpdate({ id }, modifiedUpdatedData, {
		new: true,
		runValidators: true,
	});

	return result;
};

const deleteFacultyFromDB = async (id: string) => {
	const session = await mongoose.startSession();

	try {
		session.startTransaction();
		const updatedUser = await User.findOneAndUpdate(
			{ id },
			{ isDeleted: true },
			{ new: true, session },
		);
		if (!updatedUser) {
			throw new Error('User is not deleted');
		}

		const updateFaculty = await Faculty.findOneAndUpdate(
			{ id },
			{ isDeleted: true },
			{ new: true, session },
		);
		if (!updateFaculty) {
			throw new Error('User is not deleted');
		}

		await session.commitTransaction();

		return updateFaculty;
	} catch {
		await session.abortTransaction();
		throw new Error('Something is wrong');
	} finally {
		await session.endSession();
	}
};

export const FacultyService = {
	getAllFacultyFromDB,
	getSingleFacultyFromDB,
	updateSingleFacultyFromDB,
	deleteFacultyFromDB,
};
