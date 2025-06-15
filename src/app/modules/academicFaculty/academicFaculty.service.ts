import { TAcademicFaculty } from './academicFaculty.interface';
import { AcademicFaculty } from './academicFaculty.model';

const createAcademicFacultyIntoDB = async (payload: TAcademicFaculty) => {
	const result = await AcademicFaculty.create(payload);
	return result;
};

const getAllAcademicFacultiesFromDB = async () => {
	const result = await AcademicFaculty.find({});
	return result;
};

const getSingleAcademicFacultyFormDB = async (id: string) => {
	const result = await AcademicFaculty.findById(id);
	return result;
};
const updateAcademicFacultyIntoDB = async (
	id: string,
	payload: TAcademicFaculty,
) => {
	const result = await AcademicFaculty.findByIdAndUpdate(id, payload, {
		new: true,
		runValidators: true,
	});
	return result;
};

export const AcademicFacultyService = {
	createAcademicFacultyIntoDB,
	getAllAcademicFacultiesFromDB,
	getSingleAcademicFacultyFormDB,
	updateAcademicFacultyIntoDB,
};
