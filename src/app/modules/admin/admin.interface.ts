import { Types } from 'mongoose';

export interface TAdminName {
	firstName: string;
	middleName?: string;
	lastName: string;
}
export interface TAdmin {
	id: string;
	user: Types.ObjectId;
	password?: string;
	needsPasswordChange?: boolean;
	role: string;
	designation: string;
	name: TAdminName;
	gender: 'male' | 'female';
	dateOfBirth: Date;
	email: string;
	contactNo: string;
	emergencyContactNo: string;
	presentAddress: string;
	permanentAddress: string;
	profileImage?: string;
	managementDepartment: Types.ObjectId;
	isDeleted?: boolean;
	createdAt?: Date;
	updatedAt?: Date;
}
