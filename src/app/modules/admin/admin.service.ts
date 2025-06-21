/* eslint-disable @typescript-eslint/no-explicit-any */

import status from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import { AdminSearchableFields } from './admin.constant';
import { TAdmin } from './admin.interface';
import { Admin } from './admin.model';
import AppError from '../../errors/AppError';
import User from '../user/user.model';
import mongoose from 'mongoose';

const getAllAdminFromDB = async (query: Record<string, unknown>) => {
	const adminQuery = new QueryBuilder(Admin.find(), query)
		.search(AdminSearchableFields)
		.filter()
		.sort()
		.paginate()
		.fields();

	const result = await adminQuery.modelQuery;
	return result;
};

const getSingleAdminFromDB = async (id: string) => {
	const result = await Admin.findById(id);
	return result;
};
const updateAdminIntoDB = async (id: string, payload: TAdmin) => {
	const { name, ...remainingAdminData } = payload;

	const modifiedUpdatedData: Record<string, unknown> = {
		...remainingAdminData,
	};
	if (name && Object.keys(name)) {
		for (const [key, value] of Object.entries(name)) {
			modifiedUpdatedData[`name.${key}`] = value;
		}
	}

	const result = await Admin.findByIdAndUpdate(id, modifiedUpdatedData, {
		new: true,
		runValidators: true,
	});
	return result;
};

const deleteAdminIntoDB = async (id: string) => {
	const session = await mongoose.startSession();

	try {
		session.startTransaction();

		const deletedAdmin = await Admin.findByIdAndUpdate(
			id,
			{ isDeleted: true },
			{ new: true, session },
		);

		if (!deletedAdmin) {
			throw new AppError(status.BAD_REQUEST, 'Failed to delete student');
		}

		// get user _id from deletedAdmin
		const userId = deletedAdmin.user;

		const deletedUser = await User.findOneAndUpdate(
			userId,
			{ isDeleted: true },
			{ new: true, session },
		);

		if (!deletedUser) {
			throw new AppError(status.BAD_REQUEST, 'Failed to delete user');
		}

		await session.commitTransaction();
		await session.endSession();

		return deletedAdmin;
	} catch (err: any) {
		await session.abortTransaction();
		await session.endSession();
		throw new Error(err);
	}
};

export const adminService = {
	getAllAdminFromDB,
	getSingleAdminFromDB,
	updateAdminIntoDB,
	deleteAdminIntoDB,
};
