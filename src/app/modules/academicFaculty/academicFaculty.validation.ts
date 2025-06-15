import { z } from 'zod';

const createAcademicFacultyValidationSchema = z.object({
	body: z.object({
		name: z
			.string({
				required_error: 'Name is required',
			})
			.min(1, 'Name must be at least 1 character long'),
	}),
});

const updateAcademicFacultyValidationSchema = z.object({
	body: z.object({
		name: z
			.string({
				required_error: 'Name is required',
			})
			.min(1, 'Name must be at least 1 character long'),
	}),
});

export const AcademicFacultyValidation = {
	createAcademicFacultyValidationSchema,
	updateAcademicFacultyValidationSchema,
};
