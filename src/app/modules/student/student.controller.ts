import { StudentServices } from './student.service';
import sendResponse from '../../utils/sendResponse';
import status from 'http-status';
import catchAsync from '../../utils/CatchAsync';

const getAllStudents = catchAsync(async (req, res) => {
	const result = await StudentServices.getAllStudentsFromDB(req.query);

	sendResponse(res, {
		statusCode: status.OK,
		success: true,
		message: 'Students are retrieved successfully',
		data: result,
	});
});

const getSingleStudent = catchAsync(async (req, res) => {
	const { studentId } = req.params;
	const result = await StudentServices.getSingleStudentFromDB(studentId);

	sendResponse(res, {
		statusCode: status.OK,
		success: true,
		message: 'Student is retrieved successfully',
		data: result,
	});
});

const deleteStudent = catchAsync(async (req, res) => {
	const { studentId } = req.params;
	const result = await StudentServices.deleteStudentFromDB(studentId);

	sendResponse(res, {
		statusCode: status.OK,
		success: true,
		message: 'Student is deleted succesfully',
		data: result,
	});
});

const updateStudent = catchAsync(async (req, res) => {
	const id = req.params.studentId;
	const { student } = req.body;
	const result = await StudentServices.updateStudentIntoDB(id, student);

	sendResponse(res, {
		statusCode: status.OK,
		success: true,
		message: 'Student is Updated successfully',
		data: result,
	});
});

export const StudentControllers = {
	getAllStudents,
	getSingleStudent,
	deleteStudent,
	updateStudent,
};
