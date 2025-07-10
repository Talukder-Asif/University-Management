import { z } from 'zod';

const userValidationSchema = z.object({
	password: z
		.string({
			invalid_type_error: 'Password must be a string',
		})
		.optional(),
});

export const userValidation = {
	userValidationSchema,
};
