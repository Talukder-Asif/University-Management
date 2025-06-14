import { z } from 'zod';
import {
	AcademicSemesterCode,
	AcademicSemesterName,
	Months,
} from './academicSemester.constant';

const createAcademicSemesterZodSchema = z.object({
	body: z.object({
		name: z.enum([...AcademicSemesterName] as [string, ...string[]]),
		code: z.enum([...AcademicSemesterCode] as [string, ...string[]]),
		year: z.string(),
		startMonth: z.enum([...Months] as [string, ...string[]]),
		endMonth: z.enum([...Months] as [string, ...string[]]),
	}),
});
const updateAcademicSemesterZodSchema = z.object({
	body: z.object({
		name: z.enum([...AcademicSemesterName] as [string, ...string[]]).optional(),
		code: z.enum([...AcademicSemesterCode] as [string, ...string[]]).optional(),
		year: z.string().optional(),
		startMonth: z.enum([...Months] as [string, ...string[]]).optional(),
		endMonth: z.enum([...Months] as [string, ...string[]]).optional(),
	}),
});

export const AcademicSemesterValidation = {
	createAcademicSemesterZodSchema,
	updateAcademicSemesterZodSchema,
};
