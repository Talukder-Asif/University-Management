/* eslint-disable no-console */
import { v2 as cloudinary } from 'cloudinary';
import config from '../config';
import multer from 'multer';
import AppError from '../errors/AppError';
import status from 'http-status';
import fs from 'fs';

export const sendImageToCloudinary = async (
	imageName: string,
	path: string,
) => {
	cloudinary.config({
		cloud_name: config.cloudinary_cloud_name,
		api_key: config.cloudinary_api_key,
		api_secret: config.cloudinary_api_secret,
	});

	const uploadResult = await cloudinary.uploader
		.upload(path, {
			public_id: imageName,
		})
		.catch((error) => {
			throw new AppError(status.FAILED_DEPENDENCY, error.message);
		});

	fs.unlink(path, (err) => {
		if (err) {
			console.log(err);
		} else {
			console.log('File is deleted');
		}
	});

	return uploadResult;
};

// Multer Setup
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, process.cwd() + '/uploads');
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
		cb(null, file.fieldname + '-' + uniqueSuffix);
	},
});

export const upload = multer({ storage: storage });
