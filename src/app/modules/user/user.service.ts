import config from '../../config';
import { TStudent } from '../student/student.interface';
import { TUser } from './user.interface';
import User from './user.model';
import { StudentModel } from '../student/student.model';
import { AcademicSemester } from '../AcademicSemester/academicSemester.model';
import { generateStudentID } from './user.utils';

const createStudentIntoDB = async (password: string, payload: TStudent) => {
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
		throw new Error('Invalid semester ID provided');
	}

	userData.id = await generateStudentID(admissionSemester);

	// create a user model
	const result = await User.create(userData);

	// Create a Student
	if (Object.keys(result).length) {
		payload.id = result.id;
		payload.user = result._id;

		const newStudent = await StudentModel.create(payload);
		return newStudent;
	}

	return result;
};

export const UserService = {
	createStudentIntoDB,
};
