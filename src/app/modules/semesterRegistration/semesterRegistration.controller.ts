import status from 'http-status';
import catchAsync from '../../utils/CatchAsync';
import sendResponse from '../../utils/sendResponse';
import { semesterRegistrationService } from './semesterRegistration.service';

const createSemesterRegistration = catchAsync(async (req, res) => {
	const result =
		await semesterRegistrationService.createSemesterRegistrationIntoDB(
			req.body,
		);

	sendResponse(res, {
		statusCode: status.OK,
		success: true,
		message: 'Semester Registration successfully!',
		data: result,
	});
});

const getAllSemesterRegistrations = catchAsync(async (req, res) => {
	const result =
		await semesterRegistrationService.getAllSemesterRegistrationsFromDB(
			req.query,
		);

	sendResponse(res, {
		statusCode: status.OK,
		success: true,
		message: 'Semester Registration is retrieved successfully!',
		data: result,
	});
});

const updateSemesterRegistration = catchAsync(async (req, res) => {
	const { id } = req.params;
	const result =
		await semesterRegistrationService.updateSemesterRegistrationIntoDB(
			id,
			req.body,
		);

	sendResponse(res, {
		statusCode: status.OK,
		success: true,
		message: 'Registration Semester Updated successfully',
		data: result,
	});
});

const getSingleSemesterRegistration = catchAsync(async (req, res) => {
	const { id } = req.params;
	const result =
		await semesterRegistrationService.getSingleSemesterRegistrationsFromDB(id);

	sendResponse(res, {
		statusCode: status.OK,
		success: true,
		message: 'Semester Registration is retrieved successfully!',
		data: result,
	});
});

const deleteSemesterRegistration = catchAsync(async (req, res) => {
	const { id } = req.params;
	const result =
		await semesterRegistrationService.deleteSemesterRegistrationFromDB(id);

	sendResponse(res, {
		statusCode: status.OK,
		success: true,
		message: 'Semester Registration is updated successfully',
		data: result,
	});
});

export const SemesterRegistrationController = {
	createSemesterRegistration,
	getSingleSemesterRegistration,
	getAllSemesterRegistrations,
	deleteSemesterRegistration,
	updateSemesterRegistration,
};
