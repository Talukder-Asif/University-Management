/* eslint-disable no-console */
import mongoose from 'mongoose';
import app from './app';
import config from './app/config';
import { Server } from 'http';
import seedSuperAdmin from './app/DB';

let server: Server;
async function main() {
	try {
		await mongoose.connect(config.database_url as string);

		seedSuperAdmin();

		server = app.listen(config.port, () => {
			console.log(`app is listening on port ${config.port}`);
		});
	} catch (err) {
		console.log(err);
	}
}

main();

// Handle unhandledRejection for async code
process.on('unhandledRejection', () => {
	// If there server is running, close it
	if (server) {
		server.close(() => {
			process.exit(1);
		});
	}

	// If there is no server, exit the process
	process.exit(1);
});

// Handle uncaughtException for synchronous function
process.on('uncaughtException', () => {
	process.exit(1);
});
