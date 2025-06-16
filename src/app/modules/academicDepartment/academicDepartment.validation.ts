import { z } from 'zod';

const createAcademicDepartmentValidationSchema = z.object({
	body: z.object({
		name: z
			.string({
				required_error: 'Name is required',
				invalid_type_error: 'Name must be a string',
			})
			.min(1, 'Name must be at least 1 character long'),
		academicFaculty: z
			.string({
				required_error: 'Academic Faculty is required',
				invalid_type_error: 'Academic Faculty must be a string',
			})
			.min(1, 'Academic Faculty must be at least 1 character long'),
	}),
});

const updateAcademicDepartmentValidationSchema = z.object({
	body: z.object({
		name: z
			.string({
				invalid_type_error: 'Name must be a string',
			})
			.min(1, 'Name must be at least 1 character long')
			.optional(),
		academicFaculty: z
			.string({
				invalid_type_error: 'Academic Faculty must be a string',
			})
			.min(1, 'Academic Faculty must be at least 1 character long')
			.optional(),
	}),
});

export const AcademicDepartmentValidation = {
	createAcademicDepartmentValidationSchema,
	updateAcademicDepartmentValidationSchema,
};
