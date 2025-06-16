import { model, Schema } from 'mongoose';
import { TAcademicSemester } from './academicSemester.interface';
import {
	AcademicSemesterCode,
	AcademicSemesterName,
	Months,
} from './academicSemester.constant';
import AppError from '../../errors/AppError';

const AcademicSemesterSchema = new Schema<TAcademicSemester>(
	{
		name: {
			type: String,
			required: true,
			enum: AcademicSemesterName,
		},
		code: {
			type: String,
			required: true,
			enum: AcademicSemesterCode,
		},
		year: {
			type: String,
			required: true,
		},
		startMonth: {
			type: String,
			required: true,
			enum: Months,
		},
		endMonth: {
			type: String,
			required: true,
			enum: Months,
		},
	},
	{
		timestamps: true,
	},
);

AcademicSemesterSchema.pre('save', async function (next) {
	const isSemesterExist = await AcademicSemester.findOne({
		name: this.name,
		year: this.year,
	});

	if (!isSemesterExist) {
		return next();
	} else {
		throw new AppError(
			404,
			`Academic Semester ${this.name} for the year ${this.year} already exists.`,
		);
	}
});

export const AcademicSemester = model<TAcademicSemester>(
	'AcademicSemester',
	AcademicSemesterSchema,
);
