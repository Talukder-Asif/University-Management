import { z } from 'zod';

const userNameValidationSchema = z.object({
	firstName: z
		.string()
		.min(1)
		.max(20)
		.refine((value) => /^[A-Z]/.test(value), {
			message: 'First Name must start with a capital letter',
		}),
	middleName: z.string(),
	lastName: z.string(),
});

const guardianValidationSchema = z.object({
	fatherName: z.string(),
	fatherOccupation: z.string(),
	fatherContactNo: z.string(),
	motherName: z.string(),
	motherOccupation: z.string(),
	motherContactNo: z.string(),
});

const localGuardianValidationSchema = z.object({
	name: z.string(),
	occupation: z.string(),
	contactNo: z.string(),
	address: z.string(),
});

export const createStudentValidationSchema = z.object({
	body: z.object({
		student: z.object({
			name: userNameValidationSchema,
			gender: z.enum(['male', 'female', 'other']),
			dateOfBirth: z.string().optional(),
			email: z.string().email(),
			contactNo: z.string(),
			emergencyContactNo: z.string(),
			bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
			presentAddress: z.string(),
			permanentAddress: z.string(),
			guardian: guardianValidationSchema,
			localGuardian: localGuardianValidationSchema,
			admissionSemester: z.string(),
			academicDepartment: z.string(),
		}),
	}),
});

// 👇 Update version of name validation schema
const updateUserNameValidationSchema = z.object({
	firstName: z
		.string()
		.min(1)
		.max(20)
		.refine((value) => /^[A-Z]/.test(value), {
			message: 'First Name must start with a capital letter',
		})
		.optional(),
	middleName: z.string().optional(),
	lastName: z.string().optional(),
});

// 👇 Update version of guardian schema
const updateGuardianValidationSchema = z.object({
	fatherName: z.string().optional(),
	fatherOccupation: z.string().optional(),
	fatherContactNo: z.string().optional(),
	motherName: z.string().optional(),
	motherOccupation: z.string().optional(),
	motherContactNo: z.string().optional(),
});

// 👇 Update version of local guardian schema
const updateLocalGuardianValidationSchema = z.object({
	name: z.string().optional(),
	occupation: z.string().optional(),
	contactNo: z.string().optional(),
	address: z.string().optional(),
});

// 👇 Final update schema for student
export const updateStudentValidationSchema = z.object({
	body: z.object({
		student: z
			.object({
				name: updateUserNameValidationSchema.optional(),
				gender: z.enum(['male', 'female', 'other']).optional(),
				dateOfBirth: z.string().optional(),
				email: z.string().email().optional(),
				contactNo: z.string().optional(),
				emergencyContactNo: z.string().optional(),
				bloodGroup: z
					.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
					.optional(),
				presentAddress: z.string().optional(),
				permanentAddress: z.string().optional(),
				guardian: updateGuardianValidationSchema.optional(),
				localGuardian: updateLocalGuardianValidationSchema.optional(),
				admissionSemester: z.string().optional(),
				profileImg: z.string().optional(),
			})
			.optional(),
	}),
});

export const studentValidations = {
	createStudentValidationSchema,
	updateStudentValidationSchema,
};
