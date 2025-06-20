import catchAsync from '../../utils/CatchAsync';
import sendResponse from '../../utils/sendResponse';
import { adminService } from './admin.service';

const getAllAdmin = catchAsync(async (req, res) => {
	const result = await adminService.getAllAdminFromDB(req.query);
	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: 'Admins retrieved successfully',
		data: result,
	});
});

const getSingleAdmin = catchAsync(async (req, res) => {
	const id = req.params.id;
	const result = await adminService.getSingleAdminFromDB(id);
	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: 'Admin retrieved successfully',
		data: result,
	});
});

const updateAdmin = catchAsync(async (req, res) => {
	const id = req.params.id;
	const { admin } = req.body;
	const result = await adminService.updateAdminIntoDB(id, admin);
	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: 'Admin Updated successfully',
		data: result,
	});
});

const deleteAdmin = catchAsync(async (req, res) => {
	const id = req.params.id;
	const result = await adminService.deleteAdminIntoDB(id);
	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: 'Admin Updated successfully',
		data: result,
	});
});

export const adminController = {
	getAllAdmin,
	getSingleAdmin,
	updateAdmin,
	deleteAdmin,
};
