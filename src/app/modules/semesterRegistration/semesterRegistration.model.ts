import { TSemesterRegistration } from './semesterRegistration.interface';
import { model, Schema } from 'mongoose';
import { SemesterRegistrationStatus } from './semesterRegistrationConstant';

const semesterRegistrationSchema = new Schema<TSemesterRegistration>(
	{
		academicSemester: {
			type: Schema.Types.ObjectId,
			required: true,
			unique: true,
			ref: 'AcademicSemester',
		},
		status: {
			type: String,
			enum: SemesterRegistrationStatus,
			default: 'UPCOMING',
		},
		startDate: {
			type: Date,
			required: true,
		},
		endDate: {
			type: Date,
			required: true,
		},
		maxCredit: {
			type: Number,
			default: 3,
		},
		minCredit: {
			type: Number,
			default: 15,
		},
	},
	{
		timestamps: true,
	},
);

export const SemesterRegistration = model<TSemesterRegistration>(
	'SemesterRegistration',
	semesterRegistrationSchema,
);
