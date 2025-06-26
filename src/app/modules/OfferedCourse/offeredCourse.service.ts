import { TOfferedCourse } from './offeredCourse.interface';
import { OfferedCourse } from './offeredCourse.model';

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
	const result = await OfferedCourse.create(payload);
	return result;
};

const getAllOfferedCourseFromDB = async (Query: Record<string, unknown>) => {
	const result = await OfferedCourse.find(Query);
	return result;
};

const getSingleOfferedCourseFromDB = async (id: string) => {
	const result = await OfferedCourse.findById(id);
	return result;
};

const updateOfferedCourseIntoDB = async (
	id: string,
	payload: Partial<TOfferedCourse>,
) => {
	const result = await OfferedCourse.findByIdAndUpdate(id, payload);
	return result;
};

export const offeredCourseServices = {
	createOfferedCourseIntoDB,
	getAllOfferedCourseFromDB,
	getSingleOfferedCourseFromDB,
	updateOfferedCourseIntoDB,
};
