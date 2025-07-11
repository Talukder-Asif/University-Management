import { z } from 'zod';
import { userStatus } from './user.constant';

const userValidationSchema = z.object({
	password: z
		.string({
			invalid_type_error: 'Password must be a string',
		})
		.optional(),
});

const changeStatusValidationSchema = z.object({
	body: z.object({
		status: z.enum([...userStatus] as [string, ...string[]]),
	}),
});

export const userValidation = {
	userValidationSchema,
	changeStatusValidationSchema,
};
