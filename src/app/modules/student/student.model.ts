import { CallbackError, Schema, model } from 'mongoose';
import {
	Guardian,
	LocalGuardian,
	TStudent,
	UserName,
} from './student.interface';
import AppError from '../../errors/AppError';

const userNameSchema = new Schema<UserName>({
	firstName: {
		type: String,
		required: true,
	},
	middleName: {
		type: String,
	},
	lastName: {
		type: String,
		required: true,
	},
});

const guardianSchema = new Schema<Guardian>({
	fatherName: {
		type: String,
		required: true,
	},
	fatherOccupation: {
		type: String,
		required: true,
	},
	fatherContactNo: {
		type: String,
		required: true,
	},
	motherName: {
		type: String,
		required: true,
	},
	motherOccupation: {
		type: String,
		required: true,
	},
	motherContactNo: {
		type: String,
		required: true,
	},
});

const localGuradianSchema = new Schema<LocalGuardian>({
	name: {
		type: String,
		required: true,
	},
	occupation: {
		type: String,
		required: true,
	},
	contactNo: {
		type: String,
		required: true,
	},
	address: {
		type: String,
		required: true,
	},
});

const studentSchema = new Schema<TStudent>(
	{
		id: { type: String, required: true, unique: true },
		user: {
			type: Schema.Types.ObjectId,
			required: [true, 'User is required'],
			unique: true,
			ref: 'User',
		},
		name: userNameSchema,
		gender: ['male', 'female'],
		dateOfBirth: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		contactNo: { type: String, required: true },
		emergencyContactNo: { type: String, required: true },
		bloodGroup: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
		presentAddress: { type: String, required: true },
		permanentAddress: { type: String, required: true },
		guardian: guardianSchema,
		localGuardian: localGuradianSchema,
		profileImg: { type: String },
		admissionSemester: {
			type: Schema.Types.ObjectId,
			ref: 'AcademicSemester',
		},
		isDeleted: {
			type: Boolean,
			default: false,
		},
	},
	{
		toJSON: {
			virtuals: true,
		},
	},
);

// virtual
studentSchema.virtual('fullName').get(function () {
	return (
		this?.name?.firstName +
		' ' +
		this?.name?.middleName +
		' ' +
		this?.name?.lastName
	);
});

// Query Middleware
studentSchema.pre('find', function (next) {
	this.find({ isDeleted: { $ne: true } });
	next();
});

studentSchema.pre('findOne', function (next) {
	this.find({ isDeleted: { $ne: true } });
	next();
});

studentSchema.pre('findOneAndUpdate', async function (next) {
	try {
		const query = this.getQuery();

		const student = await this.model.findOne(query);
		if (!student) {
			throw new AppError(404, 'Student does not exist');
		}

		next();
	} catch (error) {
		next(error as CallbackError);
	}
});

export const StudentModel = model<TStudent>('Student', studentSchema);
