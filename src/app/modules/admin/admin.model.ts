import { CallbackError, model, Schema } from 'mongoose';
import { TAdmin } from './admin.interface';
import AppError from '../../errors/AppError';
import config from '../../config';
import bcrypt from 'bcrypt';

const AdminSchema = new Schema<TAdmin>(
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
		password: {
			type: String,
			required: true,
		},
		needsPasswordChange: {
			type: Boolean,
			default: true,
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
		managementDepartment: {
			type: Schema.Types.ObjectId,
			ref: 'ManagementDepartment',
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

AdminSchema.pre('find', function (next) {
	this.find({ isDeleted: { $ne: true } });
	next();
});

AdminSchema.pre('findOne', function (next) {
	this.findOne({ isDeleted: { $ne: true } });
	next();
});

AdminSchema.pre('findOneAndUpdate', async function (next) {
	try {
		const query = this.getQuery();

		const admin = await this.findOne(query);
		if (!admin) {
			throw new AppError(404, 'Admin does not exist');
		}
		next();
	} catch (err) {
		next(err as CallbackError);
	}
});

AdminSchema.pre('save', async function (next) {
	const admin = this as TAdmin;

	try {
		if (admin.password) {
			const salt = await bcrypt.genSalt(Number(config.salt_rounds));
			admin.password = await bcrypt.hash(admin.password, salt);
		}
		next();
	} catch (err) {
		next(err as Error);
	}
});

export const Admin = model<TAdmin>('Admin', AdminSchema);
