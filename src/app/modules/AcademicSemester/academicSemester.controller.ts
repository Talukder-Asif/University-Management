import catchAsync from '../../utils/CatchAsync';
import sendResponse from '../../utils/sendResponse';
import status from 'http-status';
import { AcademicSemesterServices } from './academicSemester.service';

const createAcademicSemester = catchAsync(async (req, res) => {
	const result = await AcademicSemesterServices.createAcademicSemesterIntoDB(
		req.body,
	);

	sendResponse(res, {
		statusCode: status.OK,
		success: true,
		message: 'Academic Semester created successfully',
		data: result,
	});
});

const getAllAcademicSemester = catchAsync(async (req, res) => {
	const result = await AcademicSemesterServices.getAllAcademicSemesterFromDB();

	sendResponse(res, {
		statusCode: status.OK,
		success: true,
		message: 'Academic Semesters Data',
		data: result,
	});
});

const getSingleAcademicSemester = catchAsync(async (req, res) => {
	const id = req.params.id;
	const result =
		await AcademicSemesterServices.getSingleAcademicSemesterFromDB(id);
	sendResponse(res, {
		statusCode: status.OK,
		success: true,
		message: 'Single Academic Semesters Data',
		data: result,
	});
});

const updateAcademicSemester = catchAsync(async (req, res) => {
	const id = req.params.id;
	const payLoad = req.body;
	const result = await AcademicSemesterServices.updateAcademicSemesterIntoDB(
		id,
		payLoad,
	);

	sendResponse(res, {
		statusCode: status.OK,
		success: true,
		message: 'Single Academic Semesters Updated Successfully',
		data: result,
	});
});

export const AcademicSemesterControllers = {
	createAcademicSemester,
	getAllAcademicSemester,
	getSingleAcademicSemester,
	updateAcademicSemester,
};
