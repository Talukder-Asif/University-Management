import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join((process.cwd(), '.env')) });

export default {
	port: process.env.PORT,
	database_url: process.env.DATABASE_URL,
	default_password: process.env.Default_Password,
	salt_rounds: process.env.saltRounds,
	node_env: process.env.NODE_ENV,
	jwt_access_secret: process.env.JWT_ACCESS_SECRET,
	jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
	jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
	jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
	jwt_reset_password_token: process.env.JWT_RESET_PASSWORD_TOKEN,
	reset_pass_ui_link: process.env.RESET_PASS_UI_LINK,
	cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
	cloudinary_api_secret: process.env.CLOUDINARY_APT_SECRET,
};
