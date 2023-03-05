const jwt = require('jsonwebtoken');
const _ = require('lodash');
const config = require('../config/appconfig');
const RequestHandler = require('../utils/RequestHandler');
const Logger = require('../utils/logger');
// Requiring module
const bcrypt = require('bcryptjs');

const logger = new Logger();
const requestHandler = new RequestHandler(logger);

function getTokenFromHeader(req) {
	if (req.headers.authorization) {
		return req.headers.authorization;
	}
	return null;
}

function getUserInfo(req) {
	const tokenFromHeader = getTokenFromHeader(req);
	const user = jwt.decode(tokenFromHeader);
	return user.data;
}

function getHeaderParams(req) {
	if (req.headers.appversion) {
		return req.headers.appversion;
	}
	return null;
}

function verifyToken(req, res, next) {
	try {
		if (_.isUndefined(req.headers.authorization)) {
			requestHandler.throwError(401, 'Unauthorized', 'Not Authorized to access this resource!')();
		}
		// const Bearer = req.headers.authorization.split(' ')[0];

		// if (!Bearer || Bearer !== 'Bearer') {
		// 	requestHandler.throwError(401, 'Unauthorized', 'Not Authorized to access this resource!')();
		// }

		const token = req.headers.authorization;

		if (!token) {
			requestHandler.throwError(401, 'Unauthorized', 'Not Authorized to access this resource!')();
		}

		// verifies secret and checks exp
		jwt.verify(token, config.auth.jwt_secret, (err, decoded) => {
			if (err) {
				requestHandler.throwError(401, 'Unauthorized', 'Please provide a vaid token ,your token might be expired')();
			}
			req.decoded = decoded;
			next();
		});
	} catch (err) {
		requestHandler.sendError(req, res, err);
	}
}

function encryptPassword(password) {
	
	return new Promise(function (resolve, reject) {
		// Encryption of the string password
		bcrypt.genSalt(10, function (err, Salt) {

			// The bcrypt is used for encrypting password.
			bcrypt.hash(password, Salt, function (err, hash) {

				if (err) {
					reject(err);
				} else {
					console.log(hash);
					resolve(hash);
				}
			})
		})
	});
}

function comparePassword(password, hashedPassword) {

	return new Promise(function (resolve, reject) {
		bcrypt.compare(password, hashedPassword,
			async function (err, isMatch) {


				// // Comparing the original password to
				// // encrypted password   
				// if (isMatch) {
				// 	console.log('Encrypted password is: ', password);
				// 	console.log('Decrypted password is: ', hashedPassword);
				// }

				// if (!isMatch) {

				// 	// If password doesn't match the following
				// 	// message will be sent
				// 	console.log(hashedPassword + ' is not encryption of '
				// 		+ password);
				// }

				if (err) {
					reject(err);
				} else {
					resolve(isMatch);
				}
			})
	});
}


module.exports = { getJwtToken: getTokenFromHeader, isAuthunticated: verifyToken, getUserInfo: getUserInfo, isEncryptPass: encryptPassword, isComparePass: comparePassword,getHeaderParams };
