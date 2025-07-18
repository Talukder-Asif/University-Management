import { Types } from 'mongoose';

export type TPreRequisiteCourses = {
	course: Types.ObjectId;
	isDeleted: boolean;
};

export type TCourse = {
	title: string;
	prefix: string;
	code: number;
	credits: number;
	isDeleted?: boolean;
	preRequisiteCourses: [TPreRequisiteCourses];
};

export type TCourseFaculty = {
	courseId: Types.ObjectId;
	faculties: [Types.ObjectId];
};
