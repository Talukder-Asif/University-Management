/* eslint-disable @typescript-eslint/no-explicit-any */

import config from '../../config';
import { TStudent } from '../student/student.interface';
import { TUser } from './user.interface';
import User from './user.model';
import { StudentModel } from '../student/student.model';
import { AcademicSemester } from '../AcademicSemester/academicSemester.model';
import {
	generateAdminID,
	generateFacultyID,
	generateStudentId,
} from './user.utils';
import AppError from '../../errors/AppError';
import mongoose, { startSession } from 'mongoose';
import status from 'http-status';
import { TFaculty } from '../faculty/faculty.interface';
import { Faculty } from '../faculty/faculty.model';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { TAdmin } from '../admin/admin.interface';
import { Admin } from '../admin/admin.model';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';

const createStudentIntoDB = async (
	password: string,
	payload: TStudent,
	file: any,
) => {
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
		throw new AppError(404, 'Invalid admission semester provided');
	}

	const academicDepartment = await AcademicDepartment.findById(
		payload.academicDepartment,
	);

	if (!academicDepartment) {
		throw new AppError(404, 'Invalid academic department provided');
	}

	payload.academicFaculty = academicDepartment?.academicFaculty;

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

		if (file) {
			const imageName = payload.id + payload.name.firstName;
			//send Image To Cloudinary
			const uploadData = await sendImageToCloudinary(imageName, file?.path);
			payload.profileImg = uploadData.secure_url;
		}

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

const createFacultyIntoDB = async (
	password: string,
	payload: TFaculty,
	file: any,
) => {
	const userData: Partial<TUser> = {};
	userData.password = password || (config.default_password as string);
	userData.role = 'faculty';
	userData.email = payload.email;

	// Checking the academic Faculty and Department
	const isAcademicDepartmentAvailable = await AcademicDepartment.findById(
		payload.academicDepartment,
	);

	if (!isAcademicDepartmentAvailable) {
		throw new Error(`Academic Department is not Found`);
	}
	if (
		!(
			isAcademicDepartmentAvailable.academicFaculty.toString() ===
			payload?.academicFaculty.toString()
		)
	) {
		throw new Error(`Academic Faculty is not Found`);
	}

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

		if (file) {
			const imageData = await sendImageToCloudinary(
				payload.id + payload.name.firstName,
				file.path,
			);
			payload.profileImage = imageData.secure_url;
		}

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

const createAdminIntoDB = async (
	password: string,
	payload: TAdmin,
	file: any,
) => {
	const userData: Partial<TUser> = {};
	userData.password = password || (config.default_password as string);
	userData.role = 'admin';
	userData.email = payload.email;

	// Checking the academic Department is exist
	const isAcademicDepartmentAvailable = await AcademicDepartment.findById(
		payload.managementDepartment,
	);

	if (!isAcademicDepartmentAvailable) {
		throw new Error(`Academic Department is not Found`);
	}

	const session = await startSession();
	try {
		session.startTransaction();

		const id = await generateAdminID();

		userData.id = id;

		const newUser = await User.create([userData], { session });

		if (!newUser) {
			throw new Error('user can not created, Something is wrong!');
		}

		payload.id = id;
		payload.user = newUser[0]._id;
		payload.password = password || (config.default_password as string);

		if (file) {
			const imageData = await sendImageToCloudinary(
				payload.id + payload.name.firstName,
				file,
			);

			payload.profileImage = imageData.secure_url;
		}

		const newAdmin = await Admin.create([payload], { session });

		if (!newAdmin) {
			throw new Error('Admin creation failed, Something is wrong');
		}

		await session.commitTransaction();
		await session.endSession();

		return newAdmin;
	} catch (err) {
		await session.abortTransaction();
		await session.endSession();
		throw new Error('Something is wrong');
	}
};

const getMeFromDB = async (userId: string, role: string) => {
	let result = null;

	if (role === 'student') {
		result = await StudentModel.findOne({ id: userId });
	}

	if (role === 'faculty') {
		result = await Faculty.findOne({ id: userId });
	}

	if (role === 'admin') {
		result = await Admin.findOne({ id: userId });
	}

	return result;
};

const changeStatusIntoDB = async (id: string, payload: { status: string }) => {
	const result = await User.findByIdAndUpdate(id, payload, { new: true });
	return result;
};

export const UserService = {
	createStudentIntoDB,
	createFacultyIntoDB,
	createAdminIntoDB,
	getMeFromDB,
	changeStatusIntoDB,
};
