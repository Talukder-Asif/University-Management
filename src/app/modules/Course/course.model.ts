import mongoose, { Schema } from 'mongoose';
import {
	TCourse,
	TCourseFaculty,
	TPreRequisiteCourses,
} from './course.interface';

const preRequisiteCoursesSchema = new Schema<TPreRequisiteCourses>({
	course: {
		type: Schema.Types.ObjectId,
		ref: 'Course',
	},
	isDeleted: {
		type: Boolean,
		default: false,
	},
});

const courseSchema = new Schema<TCourse>({
	title: {
		type: String,
		unique: true,
		required: true,
		trim: true,
	},
	prefix: {
		type: String,
		required: true,
		trim: true,
	},
	code: {
		type: Number,
		required: true,
	},
	credits: {
		type: Number,
		trim: true,
		required: true,
	},

	isDeleted: {
		type: Boolean,
		default: false,
	},
	preRequisiteCourses: [preRequisiteCoursesSchema],
});

export const Course = mongoose.model<TCourse>('Course', courseSchema);

const courseFacultySchema = new Schema<TCourseFaculty>({
	courseId: {
		type: Schema.Types.ObjectId,
		ref: 'Course',
		required: true,
	},
	faculties: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Faculty',
		},
	],
});

export const CourseFaculty = mongoose.model<TCourseFaculty>(
	'CourseFaculty',
	courseFacultySchema,
);
