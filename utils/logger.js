
const { createLogger, format, transports } = require('winston');
const fs = require('fs');

const logDir = 'log';

let infoLogger;
let errorLogger;

const date = todayDate();

class Logger {
	constructor() {
		if (!fs.existsSync(logDir)) {
			fs.mkdirSync(logDir);
		}


		infoLogger = createLogger({
			levels: 'info',     
			format: format.combine(
				format.timestamp({
					format: 'YYYY-MM-DD HH:mm:ss',
				}),
				format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`),
			),
			transports: [
				new transports.Console({
					levels: 'info',     
					format: format.combine(
						format.colorize(),
						format.printf(
							info => `${info.timestamp} ${info.level}: ${info.message}`,
						),
					),
				}),

				new transports.File({
					levels: 'info',     
					filename: `${logDir}/${date}-info.log`,
					format: format.combine(
						format.colorize(),
						format.printf(
							info => `${info.timestamp} ${info.level}: ${info.message}`,
						),
					),
				}),
			],
			exitOnError: false,
		});

		errorLogger = createLogger({
			// change level if in dev environment versus production
			levels: 'error',     
			format: format.combine(
				format.timestamp({
					format: 'YYYY-MM-DD HH:mm:ss',
				}),
				format.printf(error => `${error.timestamp} ${error.level}: ${error.message}`),

			),
			transports: [
				new transports.Console({
					levels: 'error',
					format: format.combine(
						format.colorize(),
						format.printf(
							error => `${error.timestamp} ${error.level}: ${error.message}`,
						),
					),
				}),

				new transports.File({
					levels: 'error',     
					filename: `${logDir}/${date}-errors-results.log`,
					format: format.combine(
						format.colorize(),
						format.printf(
							error => `${error.timestamp} ${error.level}: ${error.message} `,
						),
					),
				}),
			],
			exitOnError: false,
		});
	}

	log(message, severity, data) {
		if(data!=null && typeof data ==='object'){
			message = JSON.stringify({message,...data});
		}
		if (severity === 'error') {
			errorLogger.log(severity, message);
		}else{
            infoLogger.log(severity,message);
		}
	}

	
}

function todayDate(){
	var todayDate = new Date().toISOString().slice(0, 10);
	return todayDate;
}


module.exports = Logger;
