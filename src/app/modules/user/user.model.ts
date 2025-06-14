import { model, Schema } from 'mongoose';
import { TUser } from './user.interface';
import config from '../../config';
import bcrypt from 'bcrypt';

const userSchema = new Schema<TUser>(
	{
		id: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		needsChangePassword: {
			type: Boolean,
			default: true,
		},
		role: {
			type: String,
			enum: ['admin', 'student', 'faculty'],
			required: true,
		},
		status: {
			type: String,
			enum: ['in-progress', 'blocked'],
			default: 'in-progress',
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

userSchema.pre('save', async function (next) {
	// eslint-disable-next-line @typescript-eslint/no-this-alias
	const user = this;

	try {
		const salt = await bcrypt.genSalt(Number(config.salt_rounds));
		user.password = await bcrypt.hash(user.password, salt);
		next();
	} catch (err) {
		next(err as Error);
	}
});

const User = model<TUser>('User', userSchema);
export default User;
