import catchAsync from '../../utils/CatchAsync';
import sendResponse from '../../utils/sendResponse';
import { FacultyService } from './faculty.service';

const getAllFaculty = catchAsync(async (req, res) => {
	const result = await FacultyService.getAllFacultyFromDB();
	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: 'Faculty retrieved successfully',
		data: result,
	});
});

const getSingleFaculty = catchAsync(async (req, res) => {
	const id = req.params.id;
	const result = await FacultyService.getSingleFacultyFromDB(id);

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: 'Faculty retrieved successfully',
		data: result,
	});
});

const updateSingelFaculty = catchAsync(async (req, res) => {
	const id = req.params.id;
	const payload = req.body;
	const result = await FacultyService.updateSingleFacultyFromDB(id, payload);
	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: 'Faculty Updated Successfully',
		data: result,
	});
});

const deleteFaculty = catchAsync(async (req, res) => {
	const id = req.params.id;
	const result = await FacultyService.deleteFacultyFromDB(id);

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: 'Delete Faculty successfully',
		data: result,
	});
});

export const FacultyController = {
	getAllFaculty,
	getSingleFaculty,
	updateSingleFaculty: updateSingelFaculty,
	deleteFaculty,
};
