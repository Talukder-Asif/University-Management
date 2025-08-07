import status from 'http-status';
import AppError from '../../errors/AppError';
import { AcademicSemester } from '../AcademicSemester/academicSemester.model';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistration } from './semesterRegistration.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { registrationStatus } from './semesterRegistrationConstant';
import mongoose from 'mongoose';
import { OfferedCourse } from '../OfferedCourse/offeredCourse.model';

const createSemesterRegistrationIntoDB = async (
	payload: TSemesterRegistration,
) => {
	const academicSemester = payload?.academicSemester;

	//  checking if there any semester that is already "UPCOMING" or "ONGOING"
	const isThereAnyUpcomingOrOngoingSemester =
		await SemesterRegistration.findOne({
			$or: [
				{ status: registrationStatus.UPCOMING },
				{ status: registrationStatus.ONGOING },
			],
		});
	if (isThereAnyUpcomingOrOngoingSemester) {
		throw new AppError(
			status.BAD_REQUEST,
			`There is already a ${isThereAnyUpcomingOrOngoingSemester?.status} Register Semester`,
		);
	}

	// Check if the semester is already registered or not
	const isSemesterRegistrationExists = await SemesterRegistration.findOne({
		academicSemester,
	});
	if (isSemesterRegistrationExists) {
		throw new AppError(
			status.BAD_REQUEST,
			'This Semester is already registered',
		);
	}

	// Check if the Semester is Exist
	const isAcademicSemesterExists =
		await AcademicSemester.findById(academicSemester);

	if (!isAcademicSemesterExists) {
		throw new AppError(status.NOT_FOUND, 'Academic Semester is not found');
	}

	const result = await SemesterRegistration.create(payload);
	return result;
};

const getAllSemesterRegistrationsFromDB = async (
	Query: Record<string, unknown>,
) => {
	const semesterRegistrationQuery = new QueryBuilder(
		SemesterRegistration.find().populate('academicSemester'),
		Query,
	)
		.fields()
		.filter()
		.paginate()
		.sort();

	const result = await semesterRegistrationQuery.modelQuery;

	return result;
};

const getSingleSemesterRegistrationsFromDB = async (id: string) => {
	const result = await SemesterRegistration.findById(id);
	return result;
};

const updateSemesterRegistrationIntoDB = async (
	id: string,
	payload: Partial<TSemesterRegistration>,
) => {
	// Check if the semester is exist or not
	const isSemesterRegistrationExists = await SemesterRegistration.findById(id);

	if (!isSemesterRegistrationExists) {
		throw new AppError(
			status.NOT_FOUND,
			'This registered Semester is not found ',
		);
	}

	// Checking the semester is "ENDED" or not
	const currentSemesterStatus = isSemesterRegistrationExists?.status;

	if (currentSemesterStatus === registrationStatus.ENDED) {
		throw new AppError(
			status.BAD_REQUEST,
			`There is already ${currentSemesterStatus}`,
		);
	}

	// UPCOMING --> ONGOING --> ENDED

	const requestedStatus = payload?.status;

	if (
		currentSemesterStatus === registrationStatus.UPCOMING &&
		requestedStatus === registrationStatus.ENDED
	) {
		throw new AppError(
			status.BAD_REQUEST,
			`You can not directly change status from ${currentSemesterStatus} to ${requestedStatus}`,
		);
	}
	if (
		currentSemesterStatus === registrationStatus.ONGOING &&
		registrationStatus.UPCOMING
	) {
		throw new AppError(
			status.BAD_REQUEST,
			`You can not change status from ${currentSemesterStatus} to ${requestedStatus}`,
		);
	}

	const result = await SemesterRegistration.findByIdAndUpdate(id, payload, {
		new: true,
	});

	return result;
};

const deleteSemesterRegistrationFromDB = async (id: string) => {
	/** 
	* Step1: Delete associated offered courses.
	* Step2: Delete semester registraton when the status is 
	'UPCOMING'.
	**/

	// checking if the semester registration is exist
	const isSemesterRegistrationExists = await SemesterRegistration.findById(id);

	if (!isSemesterRegistrationExists) {
		throw new AppError(
			status.NOT_FOUND,
			'This registered semester is not found !',
		);
	}

	// checking if the status is still "UPCOMING"
	const semesterRegistrationStatus = isSemesterRegistrationExists.status;

	if (semesterRegistrationStatus !== 'UPCOMING') {
		throw new AppError(
			status.BAD_REQUEST,
			`You can not update as the registered semester is ${semesterRegistrationStatus}`,
		);
	}

	const session = await mongoose.startSession();

	//deleting associated offered courses

	try {
		session.startTransaction();

		const deletedOfferedCourse = await OfferedCourse.deleteMany(
			{
				semesterRegistration: id,
			},
			{
				session,
			},
		);

		if (!deletedOfferedCourse) {
			throw new AppError(
				status.BAD_REQUEST,
				'Failed to delete semester registration !',
			);
		}

		const deletedSemisterRegistration =
			await SemesterRegistration.findByIdAndDelete(id, {
				session,
				new: true,
			});

		if (!deletedSemisterRegistration) {
			throw new AppError(
				status.BAD_REQUEST,
				'Failed to delete semester registration !',
			);
		}

		await session.commitTransaction();
		await session.endSession();

		return null;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (err: any) {
		await session.abortTransaction();
		await session.endSession();
		throw new Error(err);
	}
};

export const semesterRegistrationService = {
	createSemesterRegistrationIntoDB,
	getAllSemesterRegistrationsFromDB,
	getSingleSemesterRegistrationsFromDB,
	updateSemesterRegistrationIntoDB,
	deleteSemesterRegistrationFromDB,
};
