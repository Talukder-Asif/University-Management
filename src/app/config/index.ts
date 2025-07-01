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
};
