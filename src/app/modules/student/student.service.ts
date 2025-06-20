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
	// let searchTerm = '';
	// if (query?.searchTerm) {
	// 	searchTerm = query?.searchTerm as string;
	// }
	// const studentSearchableFields = ['email', 'name.firstName', 'presentAddress'];

	// const searchQuery = StudentModel.find({
	// 	$or: studentSearchableFields.map((field) => ({
	// 		[field]: { $regex: searchTerm, $options: 'i' },
	// 	})),
	// });

	// Make a clear query for filtering
	// const queryObj = { ...query };
	// const excludedFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
	// excludedFields.forEach((el) => delete queryObj[el]);

	// const filterQuery = searchQuery.find(queryObj);

	// Sorting
	// let sort = '-createdAt';
	// if (query.sort) {
	// 	sort = query.sort as string;
	// }
	// const sortQuery = filterQuery.sort(sort);

	// Pagination

	// let page = 1;
	// let limit = 1;
	// let skip = 0;

	// if (query.limit) {
	// 	limit = Number(query.limit);
	// }

	// if (query.page) {
	// 	page = Number(query.page);
	// 	skip = (page - 1) * limit;
	// }

	// const paginateQuery = sortQuery.skip(skip);

	// const limitQuery = paginateQuery.limit(limit);

	// Field Limiting
	// let fields = '-__v';
	// if (query?.fields) {
	// 	fields = (query.fields as string).split(',').join(' ');
	// }

	// const fieldQuery = await limitQuery.select(fields);

	// return fieldQuery;

	const studentQuery = new QueryBuilder(StudentModel.find(), query)
		.search(studentSearchableFields)
		.filter()
		.sort()
		.paginate()
		.fields();

	const result = await studentQuery.modelQuery;

	return result;
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
