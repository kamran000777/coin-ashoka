const dotenv = require('dotenv');
// dotenv.config();

// config.js
module.exports = {
	app: {
		port: process.env.DEV_APP_PORT || 3001,
		appName: process.env.APP_NAME || 'postgres',
		env: process.env.NODE_ENV || 'development',
	},
	db: {
		port: process.env.DB_PORT || 5432,
		database: process.env.DB_NAME || 'postgres',
		password: process.env.DB_PASS || 'kamran@1998',
		username: process.env.DB_USER || 'postgres',
		host: process.env.DB_HOST || 'localhost',
		dialect: 'postgres',
		logging: true,
	},
	winiston: {
		logpath: '/iLrnLogs/logs/',
	},
	auth: {
		jwt_secret: process.env.JWT_SECRET || 'growspace@#1234',
		jwt_expiresin: process.env.JWT_EXPIRES_IN || '365d',
		saltRounds: process.env.SALT_ROUND || 10,
		refresh_token_secret: process.env.REFRESH_TOKEN_SECRET || 'VmVyeVBvd2VyZnVsbFNlY3JldA==',
		refresh_token_expiresin: process.env.REFRESH_TOKEN_EXPIRES_IN || '2d', // 2 days
	},
	sendgrid: {
		api_key: process.env.SEND_MAIL_API_KEY,
		api_user: process.env.USERNAME,
		from_email: process.env.FROM_EMAIL || 'kamranaka1998@gmail.com',
	},

};


