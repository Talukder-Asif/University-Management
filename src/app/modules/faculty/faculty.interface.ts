import { Types } from 'mongoose';

export interface IFacultyName {
	firstName: string;
	middleName?: string;
	lastName: string;
}

export interface TFaculty {
	id: string;
	user: Types.ObjectId;
	role: string;
	designation: string;
	name: IFacultyName;
	gender: 'male' | 'female';
	dateOfBirth: Date;
	email: string;
	contactNo: string;
	emergencyContactNo: string;
	presentAddress: string;
	permanentAddress: string;
	profileImage?: string;
	academicDepartment: Types.ObjectId;
	academicFaculty: Types.ObjectId;
	isDeleted?: boolean;
}
