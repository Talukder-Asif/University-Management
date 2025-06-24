import status from 'http-status';
import AppError from '../../errors/AppError';
import { AcademicSemester } from '../AcademicSemester/academicSemester.model';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistration } from './semesterRegistration.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { registrationStatus } from './semesterRegistrationConstant';

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

	const result = await SemesterRegistration.findByIdAndUpdate(id, payload);

	return result;
};

export const semesterRegistrationService = {
	createSemesterRegistrationIntoDB,
	getAllSemesterRegistrationsFromDB,
	getSingleSemesterRegistrationsFromDB,
	updateSemesterRegistrationIntoDB,
};
