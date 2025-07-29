import { z } from 'zod';

const createAdminValidationSchema = z.object({
	body: z.object({
		admin: z.object({
			role: z.string({
				required_error: 'Role is required',
			}),

			designation: z.string({
				required_error: 'Designation is required',
			}),

			name: z.object({
				firstName: z.string({
					required_error: 'First name is required',
				}),
				middleName: z.string().optional(),
				lastName: z.string({
					required_error: 'Last name is required',
				}),
			}),

			gender: z.enum(['male', 'female'], {
				required_error: 'Gender is required',
			}),

			dateOfBirth: z
				.string({
					required_error: 'Date of birth is required',
				})
				.refine((val) => !isNaN(Date.parse(val)), {
					message: 'Invalid date format',
				}),

			email: z
				.string({
					required_error: 'Email is required',
				})
				.email('Invalid email format'),

			contactNo: z.string({
				required_error: 'Contact number is required',
			}),

			emergencyContactNo: z.string({
				required_error: 'Emergency contact number is required',
			}),

			presentAddress: z.string({
				required_error: 'Present address is required',
			}),

			permanentAddress: z.string({
				required_error: 'Permanent address is required',
			}),
			managementDepartment: z.string({
				required_error: 'Management department is required',
			}),

			isDeleted: z.boolean().optional(),

			password: z.string().optional(),

			needsPasswordChange: z.boolean().optional(),
		}),
	}),
});

const updateAdminValidationSchema = z.object({
	body: z.object({
		admin: z.object({
			id: z
				.string({
					required_error: 'ID is required',
				})
				.optional(),

			user: z
				.string({
					required_error: 'User is required',
				})
				.optional(),

			role: z
				.string({
					required_error: 'Role is required',
				})
				.optional(),

			designation: z
				.string({
					required_error: 'Designation is required',
				})
				.optional(),

			name: z
				.object({
					firstName: z
						.string({
							required_error: 'First name is required',
						})
						.optional(),

					middleName: z.string().optional(),

					lastName: z
						.string({
							required_error: 'Last name is required',
						})
						.optional(),
				})
				.optional(),

			gender: z
				.enum(['male', 'female'], {
					required_error: 'Gender is required',
				})
				.optional(),

			dateOfBirth: z
				.string({
					required_error: 'Date of birth is required',
				})
				.refine((val) => !isNaN(Date.parse(val)), {
					message: 'Invalid date format',
				})
				.optional(),

			email: z
				.string({
					required_error: 'Email is required',
				})
				.email('Invalid email format')
				.optional(),

			contactNo: z
				.string({
					required_error: 'Contact number is required',
				})
				.optional(),

			emergencyContactNo: z
				.string({
					required_error: 'Emergency contact number is required',
				})
				.optional(),

			presentAddress: z
				.string({
					required_error: 'Present address is required',
				})
				.optional(),

			permanentAddress: z
				.string({
					required_error: 'Permanent address is required',
				})
				.optional(),

			profileImage: z.string().url().optional(),

			managementDepartment: z
				.string({
					required_error: 'Management department is required',
				})
				.optional(),

			isDeleted: z.boolean().optional(),

			password: z.string().optional(),

			needsPasswordChange: z.boolean().optional(),
		}),
	}),
});

export const adminValidation = {
	createAdminValidationSchema,
	updateAdminValidationSchema,
};
