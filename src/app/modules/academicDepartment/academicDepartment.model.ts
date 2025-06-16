import { model, Schema } from 'mongoose';
import { TAcademicDepartment } from './academicDepartment.interface';
import AppError from '../../errors/AppError';

const academicDepartmentSchema = new Schema<TAcademicDepartment>(
	{
		name: {
			type: String,
			required: true,
			unique: true,
		},
		academicFaculty: {
			type: Schema.Types.ObjectId,
			ref: 'AcademicFaculty',
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

academicDepartmentSchema.pre('save', async function (next) {
	const isDepartmentExists = await AcademicDepartment.findOne({
		name: this.name,
	});

	if (isDepartmentExists) {
		throw new AppError(404, 'Academic Department already exists');
	}
	next();
});

academicDepartmentSchema.pre('findOneAndUpdate', async function (next) {
	const query = this.getQuery();
	const isDepartmentExists = await AcademicDepartment.findOne(query);

	if (!isDepartmentExists) {
		throw new AppError(404, 'Academic Department does not exist');
	}
	next();
});

export const AcademicDepartment = model<TAcademicDepartment>(
	'AcademicDepartment',
	academicDepartmentSchema,
);
