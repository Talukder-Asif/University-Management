import AppError from '../../errors/AppError';
import { academicSemesterNameCodeMapper } from './academicSemester.constant';
import { TAcademicSemester } from './academicSemester.interface';
import { AcademicSemester } from './academicSemester.model';

const createAcademicSemesterIntoDB = async (payLoad: TAcademicSemester) => {
	// Check if the academic semester name and code match

	if (academicSemesterNameCodeMapper[payLoad.name] !== payLoad.code) {
		throw new AppError(
			404,
			`Academic Semester name ${payLoad.name} does not match with code ${payLoad.code}.`,
		);
	}

	const result = await AcademicSemester.create(payLoad);

	return result;
};

const getAllAcademicSemesterFromDB = async () => {
	const result = await AcademicSemester.find({}).sort({ createdAt: -1 });
	return result;
};

const getSingleAcademicSemesterFromDB = async (id: string) => {
	const result = await AcademicSemester.findById(id);
	return result;
};

const updateAcademicSemesterIntoDB = async (
	id: string,
	payLoad: TAcademicSemester,
) => {
	if (academicSemesterNameCodeMapper[payLoad.name] !== payLoad.code) {
		throw new AppError(
			404,
			`Academic Semester name ${payLoad.name} does not match with code ${payLoad.code}.`,
		);
	}

	const result = await AcademicSemester.findByIdAndUpdate(id, payLoad, {
		new: true,
		runValidators: true,
	});
	return result;
};

export const AcademicSemesterServices = {
	createAcademicSemesterIntoDB,
	getAllAcademicSemesterFromDB,
	getSingleAcademicSemesterFromDB,
	updateAcademicSemesterIntoDB,
};
