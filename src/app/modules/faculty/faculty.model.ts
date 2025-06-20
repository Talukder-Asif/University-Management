import { model, Schema } from 'mongoose';
import { TFaculty } from './faculty.interface';

const FacultySchema = new Schema<TFaculty>(
	{
		id: {
			type: String,
			required: true,
			unique: true,
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		role: {
			type: String,
			required: true,
		},
		designation: {
			type: String,
			required: true,
		},
		name: {
			firstName: { type: String, required: true },
			middleName: { type: String },
			lastName: { type: String, required: true },
		},
		gender: {
			type: String,
			enum: ['male', 'female'],
			required: true,
		},
		dateOfBirth: {
			type: Date,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		contactNo: {
			type: String,
			required: true,
		},
		emergencyContactNo: {
			type: String,
			required: true,
		},
		presentAddress: {
			type: String,
			required: true,
		},
		permanentAddress: {
			type: String,
			required: true,
		},
		profileImage: {
			type: String,
		},
		academicDepartment: {
			type: Schema.Types.ObjectId,
			ref: 'AcademicDepartment',
			required: true,
		},
		academicFaculty: {
			type: Schema.Types.ObjectId,
			ref: 'AcademicFaculty',
			required: true,
		},
		isDeleted: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	},
);

export const Faculty = model<TFaculty>('Faculty', FacultySchema);
