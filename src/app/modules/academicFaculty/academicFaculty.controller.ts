import status from 'http-status';
import catchAsync from '../../utils/CatchAsync';
import sendResponse from '../../utils/sendResponse';
import { AcademicFacultyService } from './academicFaculty.service';

const createAcademicFaculty = catchAsync(async (req, res) => {
	const result = await AcademicFacultyService.createAcademicFacultyIntoDB(
		req.body,
	);
	sendResponse(res, {
		statusCode: status.OK,
		success: true,
		message: 'Academic Faculty created successfully',
		data: result,
	});
});

const getAllAcademicFaculties = catchAsync(async (req, res) => {
	const result = await AcademicFacultyService.getAllAcademicFacultiesFromDB();
	sendResponse(res, {
		statusCode: status.OK,
		success: true,
		message: 'Academic Faculties retrieved successfully',
		data: result,
	});
});

const getSingleAcademicFacultyFormDB = catchAsync(async (req, res) => {
	const result = await AcademicFacultyService.getSingleAcademicFacultyFormDB(
		req.params.id,
	);
	return sendResponse(res, {
		statusCode: status.OK,
		success: true,
		message: 'Academic Faculty retrieved successfully',
		data: result,
	});
});

const updateAcademicFaculty = catchAsync(async (req, res) => {
	const result = await AcademicFacultyService.updateAcademicFacultyIntoDB(
		req.params.id,
		req.body,
	);
	sendResponse(res, {
		statusCode: status.OK,
		success: true,
		message: 'Academic Faculty updated successfully',
		data: result,
	});
});

export const AcademicFacultyController = {
	createAcademicFaculty,
	getAllAcademicFaculties,
	getSingleAcademicFacultyFormDB,
	updateAcademicFaculty,
};
