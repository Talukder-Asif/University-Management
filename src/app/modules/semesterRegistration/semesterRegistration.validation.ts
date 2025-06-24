import { z } from 'zod';
import { SemesterRegistrationStatus } from './semesterRegistrationConstant';

const createSemesterRegistrationSchema = z.object({
	body: z.object({
		academicSemester: z.string(),
		status: z.enum([...(SemesterRegistrationStatus as [string])]),
		startDate: z.string().datetime(),
		endDate: z.string().datetime(),
		maxCredit: z.number().min(1).default(3).optional(),
		minCredit: z.number().min(1).default(15).optional(),
	}),
});

const updateSemesterRegistrationSchema = z.object({
	body: z.object({
		academicSemester: z.string().optional(),
		status: z.enum([...(SemesterRegistrationStatus as [string])]).optional(),
		startDate: z.string().datetime().optional(),
		endDate: z.string().datetime().optional(),
		maxCredit: z.number().min(1).default(3).optional(),
		minCredit: z.number().min(1).default(15).optional(),
	}),
});

export const semesterRegistrationValidation = {
	createSemesterRegistrationSchema,
	updateSemesterRegistrationSchema,
};
