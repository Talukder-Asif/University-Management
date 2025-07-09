import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async () => {
	// Create a test account or replace with real credentials.
	const transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: 587,
		secure: config.node_env === 'production', // true for 465, false for other ports
		auth: {
			user: 'asif.talukder.aj.10@gmail.com',
			pass: 'undv xtiq ihkx bkpm',
		},
	});

	await transporter.sendMail({
		from: '',
		to: 'bar@example.com, baz@example.com',
		subject: 'Hello ✔',
		text: 'Hello world?', // plain‑text body
		html: '<b>Hello world?</b>', // HTML body
	});
};
