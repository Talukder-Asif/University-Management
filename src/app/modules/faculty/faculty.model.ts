import { CallbackError, model, Schema } from 'mongoose';
import { TFaculty } from './faculty.interface';
import AppError from '../../errors/AppError';

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
			default: '',
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

// Middleware to show only available faculties
FacultySchema.pre('find', function (next) {
	this.find({ isDeleted: { $ne: true } });
	next();
});

FacultySchema.pre('findOne', function (next) {
	this.findOne({ isDeleted: { $ne: true } });
	next();
});
FacultySchema.pre('findOneAndUpdate', async function (next) {
	try {
		const query = this.getQuery();

		const faculty = await this.model.findOne(query);
		if (!faculty) {
			throw new AppError(404, 'Faculty does not exist');
		}

		next();
	} catch (error) {
		next(error as CallbackError);
	}
});

export const Faculty = model<TFaculty>('Faculty', FacultySchema);
