import { z } from 'zod';
import { Days } from './offeredCourse.constant';

const createOfferedCourseValidationSchema = z.object({
	body: z
		.object({
			semesterRegistration: z.string(),
			academicFaculty: z.string(),
			academicDepartment: z.string(),
			course: z.string(),
			faculty: z.string(),
			maxCapacity: z.number(),
			section: z.number(),
			days: z.array(z.enum([...Days] as [string, ...string[]])),
			startTime: z.string().refine(
				(time) => {
					const regex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
					return regex.test(time);
				},
				{
					message: 'Invalid Time Format, expected "HH:MM" in 24 hour format',
				},
			),
			endTime: z.string().refine(
				(time) => {
					const regex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
					return regex.test(time);
				},
				{
					message: 'Invalid Time Format, expected "HH:MM" in 24 hour format',
				},
			),
		})
		.refine(
			(body) => {
				// startTime : 10:30
				// endTime : 12:30
				const baseDate = '1970-01-01';

				const start = new Date(`${baseDate}T${body.startTime}:00`);
				const end = new Date(`${baseDate}T${body.endTime}:00`);

				return end > start;
			},
			{
				message: 'Start time should be before end time',
			},
		),
});

const updateOfferedCourseValidationSchema = z.object({
	body: z.object({
		faculty: z.string().optional(),
		maxCapacity: z.number().optional(),
		section: z.number().optional(),
		days: z.enum([...Days] as [string, ...string[]]).optional(),
		startTime: z
			.string()
			.refine(
				(time) => {
					const regex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
					return regex.test(time);
				},
				{
					message: 'Invalid Time Format, expected "HH:MM" in 24 hour format',
				},
			)
			.optional(),
		endTime: z
			.string()
			.refine(
				(time) => {
					const regex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
					return regex.test(time);
				},
				{
					message: 'Invalid Time Format, expected "HH:MM" in 24 hour format',
				},
			)
			.optional(),
	}),
});

export const offeredCourseValidation = {
	createOfferedCourseValidationSchema,
	updateOfferedCourseValidationSchema,
};
