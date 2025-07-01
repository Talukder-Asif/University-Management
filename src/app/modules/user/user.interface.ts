/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export interface TUser {
	id: string;
	password: string;
	email: string;
	needsChangePassword: boolean;
	role: 'admin' | 'student' | 'faculty';
	isDeleted: boolean;
	status: 'in-progress' | 'blocked';
}

export interface UserModel extends Model<TUser> {
	checkUserExistByCustomId(id: string): Promise<TUser>;
	isPasswordMatched(
		plainTextPassword: string,
		hashedPassword: string,
	): Promise<boolean>;
}
