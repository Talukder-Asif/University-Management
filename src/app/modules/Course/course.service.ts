import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { courseSearchableFields } from './course.constant';
import { TCourse } from './course.interface';
import { Course } from './course.model';
import AppError from '../../errors/AppError';
import status from 'http-status';

const createCourseIntoDB = async (payload: TCourse) => {
	const result = await Course.create(payload);
	return result;
};

const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
	const courseQuery = new QueryBuilder(
		Course.find().populate('preRequisiteCourses.course'),
		query,
	)
		.search(courseSearchableFields)
		.fields()
		.sort()
		.paginate()
		.fields();
	const result = await courseQuery.modelQuery;
	return result;
};

const getSingleCourseFromDB = async (id: string) => {
	const result = await Course.findById(id).populate(
		'preRequisiteCourses.course',
	);
	return result;
};

const deleteCourseFromDB = async (id: string) => {
	const result = await Course.findByIdAndUpdate(
		id,
		{ isDeleted: true },
		{ new: true },
	);
	return result;
};

const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
	const { preRequisiteCourses, ...CourseRemainingData } = payload;

	const session = await mongoose.startSession();

	try {
		session.startTransaction();
		//Basic Info Update
		const updatedBasicCourseInfo = await Course.findByIdAndUpdate(
			id,
			CourseRemainingData,
			{
				new: true,
				runValidators: true,
				session,
			},
		);

		if (!updatedBasicCourseInfo) {
			throw new AppError(status.BAD_REQUEST, 'Fail to update course');
		}

		// Check if there is any preRequisiteCourses
		if (preRequisiteCourses && preRequisiteCourses.length > 0) {
			// Filter out the deleted fields
			const deletedPreRequisites = preRequisiteCourses
				.filter((el) => el.course && el.isDeleted)
				.map((el) => el.course);

			const deletedPreRequisitesCourses = await Course.findByIdAndUpdate(
				id,
				{
					$pull: {
						preRequisiteCourses: {
							course: { $in: deletedPreRequisites },
						},
					},
				},
				{
					new: true,
					runValidators: true,
					session,
				},
			);
			if (!deletedPreRequisitesCourses) {
				throw new AppError(status.BAD_REQUEST, 'Fail to update course');
			}

			// Add new preRequisite Courses

			const newPreRequisite = preRequisiteCourses.filter(
				(el) => !el.isDeleted && el.course,
			);

			const newPreRequisiteCourses = await Course.findByIdAndUpdate(
				id,
				{
					// Never duplicate the preRequisiteCourse
					$addToSet: {
						preRequisiteCourses: {
							$each: newPreRequisite,
						},
					},
				},
				{
					new: true,
					runValidators: true,
					session,
				},
			);

			if (!newPreRequisiteCourses) {
				throw new AppError(status.BAD_REQUEST, 'Fail to update course');
			}
		}

		await session.commitTransaction();

		await session.endSession();

		const result = await Course.findById(id).populate(
			'preRequisiteCourses.course',
		);

		return result;
	} catch (err) {
		await session.abortTransaction();
		await session.endSession();
		throw new AppError(status.BAD_REQUEST, 'Fail to update course');
	}
};

export const CourseServices = {
	createCourseIntoDB,
	getAllCoursesFromDB,
	getSingleCourseFromDB,
	deleteCourseFromDB,
	updateCourseIntoDB,
};
