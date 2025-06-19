import mongoose from 'mongoose';
import { StudentModel } from './student.model';
import AppError from '../../errors/AppError';
import status from 'http-status';
import User from '../user/user.model';
import { TStudent } from './student.interface';

const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
	let searchTerm = '';
	if (query?.searchTerm) {
		searchTerm = query?.searchTerm as string;
	}
	const studentSearchableFields = ['email', 'name.firstName', 'presentAddress'];

	const searchQuery = StudentModel.find({
		$or: studentSearchableFields.map((field) => ({
			[field]: { $regex: searchTerm, $options: 'i' },
		})),
	});

	// Make a clear query for filtering
	const queryObj = { ...query };
	const excludedFields = ['searchTerm', 'sort', 'limit'];
	excludedFields.forEach((el) => delete queryObj[el]);

	const filterQuery = searchQuery.find(queryObj);

	let sort = '-createdAt';
	if (query.sort) {
		sort = query.sort as string;
	}

	const sortQuery = filterQuery.sort(sort);

	let limit = 9;
	if (query.limit) {
		limit = Number(query.limit);
	}
	const limitQuery = await sortQuery.limit(limit);

	return limitQuery;
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
