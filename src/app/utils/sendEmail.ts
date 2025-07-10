import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (to: string, html: string) => {
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
		from: 'asif.talukder.aj.10@gmail.com',
		to,
		subject: 'Change the Password',
		text: 'Reset your password within 10 minutes',
		html,
	});
};
