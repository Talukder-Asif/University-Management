import { model, Schema } from 'mongoose';
import { TUser, UserModel } from './user.interface';
import config from '../../config';
import bcrypt from 'bcrypt';

const userSchema = new Schema<TUser, UserModel>(
	{
		id: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			select: 0,
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
		passwordChangedDate: {
			type: Date,
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

userSchema.statics.checkUserExistByCustomId = async function (id: string) {
	return await User.findOne({ id }).select('+password');
};

userSchema.statics.isPasswordMatched = async function (
	plainTextPassword,
	hashedPassword,
) {
	return await bcrypt.compare(plainTextPassword, hashedPassword);
};

userSchema.statics.isJWTIssuedBeforePasswordChanged = async function (
	passwordChangeTimestamp: Date,
	jwtIssuedTimestamp: number,
) {
	const passwordChangeTime = new Date(passwordChangeTimestamp).getTime() / 1000;
	return passwordChangeTime > jwtIssuedTimestamp;
};

const User = model<TUser, UserModel>('User', userSchema);
export default User;
