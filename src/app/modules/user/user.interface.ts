/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export interface TUser {
	id: string;
	password: string;
	email: string;
	needsChangePassword: boolean;
	passwordChangedDate?: Date;
	role: 'superAdmin' | 'admin' | 'student' | 'faculty';
	isDeleted: boolean;
	status: 'in-progress' | 'blocked';
}

export interface UserModel extends Model<TUser> {
	checkUserExistByCustomId(id: string): Promise<TUser>;
	isPasswordMatched(
		plainTextPassword: string,
		hashedPassword: string,
	): Promise<boolean>;
	isJWTIssuedBeforePasswordChanged(
		passwordChangeTimestamp: Date,
		jwtIssuedTimestamp: number,
	): Promise<boolean>;
}

export type TUserRole = keyof typeof USER_ROLE;
