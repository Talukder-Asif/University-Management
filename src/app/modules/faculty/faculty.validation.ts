import { z } from 'zod';

export const createFacultyValidationSchema = z.object({
	body: z.object({
		faculty: z.object({
			role: z
				.string({
					required_error: 'Role is required',
					invalid_type_error: 'Role must be a string',
				})
				.min(1, 'Role must be at least 1 character long'),

			designation: z
				.string({
					required_error: 'Designation is required',
					invalid_type_error: 'Designation must be a string',
				})
				.min(1, 'Designation must be at least 1 character long'),

			name: z.object({
				firstName: z
					.string({
						required_error: 'First name is required',
						invalid_type_error: 'First name must be a string',
					})
					.min(1, 'First name must be at least 1 character long'),

				middleName: z
					.string({
						invalid_type_error: 'Middle name must be a string',
					})
					.optional(),

				lastName: z
					.string({
						required_error: 'Last name is required',
						invalid_type_error: 'Last name must be a string',
					})
					.min(1, 'Last name must be at least 1 character long'),
			}),

			gender: z.enum(['male', 'female'], {
				required_error: 'Gender is required',
				invalid_type_error: 'Gender must be either "male" or "female"',
			}),

			dateOfBirth: z.string({
				required_error: 'Date of birth is required',
				invalid_type_error: 'Date of birth must be a string',
			}),

			email: z.string({
				required_error: 'Email is required',
				invalid_type_error: 'Email must be a string',
			}),
			contactNo: z.string({
				required_error: 'Contact number is required',
				invalid_type_error: 'Contact number must be a string',
			}),

			emergencyContactNo: z.string({
				required_error: 'Emergency contact number is required',
				invalid_type_error: 'Emergency contact number must be a string',
			}),

			presentAddress: z.string({
				required_error: 'Present address is required',
				invalid_type_error: 'Present address must be a string',
			}),

			permanentAddress: z.string({
				required_error: 'Permanent address is required',
				invalid_type_error: 'Permanent address must be a string',
			}),

			profileImage: z
				.string({
					invalid_type_error: 'Profile image must be a URL string',
				})
				.url('Profile image must be a valid URL')
				.optional(),

			academicDepartment: z
				.string({
					required_error: 'Academic Department is required',
					invalid_type_error: 'Academic Department must be a string',
				})
				.min(1, 'Academic Department must be at least 1 character long'),

			academicFaculty: z
				.string({
					required_error: 'Academic Faculty is required',
					invalid_type_error: 'Academic Faculty must be a string',
				})
				.min(1, 'Academic Faculty must be at least 1 character long'),

			isDeleted: z.boolean().optional(),
		}),
	}),
});

export const FacultyValidation = {
	createFacultyValidationSchema,
};
