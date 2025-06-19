import status from 'http-status';
import catchAsync from '../../utils/CatchAsync';
import sendResponse from '../../utils/sendResponse';
import { AcademicDepartmentService } from './academicDepartment.service';

const createAcademicDepartment = catchAsync(async (req, res) => {
	const result = await AcademicDepartmentService.createAcademicDepartmentIntoDB(
		req.body,
	);
	return res.status(200).json({
		success: true,
		message: 'Academic Department created successfully',
		data: result,
	});
});

const getAllAcademicDepartments = catchAsync(async (req, res) => {
	const result =
		await AcademicDepartmentService.getAllAcademicDepartmentsFromDB();
	return res.status(200).json({
		success: true,
		message: 'Academic Departments retrieved successfully',
		data: result,
	});
});

const getSingleAcademicDepartment = catchAsync(async (req, res) => {
	const { id } = req.params;
	const result =
		await AcademicDepartmentService.getSingleAcademicDepartmentFromDB(id);

	sendResponse(res, {
		statusCode: status.OK,
		success: true,
		message: 'Academic Department retrieved successfully',
		data: result,
	});
});

const updateAcademicDepartment = catchAsync(async (req, res) => {
	const { id } = req.params;
	const result = await AcademicDepartmentService.updateAcademicDepartmentIntoDB(
		id,
		req.body,
	);
	return res.status(200).json({
		success: true,
		message: 'Academic Department updated successfully',
		data: result,
	});
});

export const AcademicDepartmentController = {
	createAcademicDepartment,
	getAllAcademicDepartments,
	getSingleAcademicDepartment,
	updateAcademicDepartment,
};
