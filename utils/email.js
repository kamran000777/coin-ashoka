const helper = require('sendgrid').mail;
const async = require('async');
const sg = require('sendgrid')(process.env.SEND_MAIL_API_KEY);
const sgMail = require('@sendgrid/mail');
const Logger = require('../utils/logger');
var request = require('request');
const admin = require('firebase-admin');
const urlBuilder = require('build-url');
// const functions = require('firebase-functions');

const logger = new Logger();

// admin.initializeApp(functions.config().firebase);

// function sendEmail(data){
// 	const token = Buffer.from('hapikey:e76610a4-caea-4a58-ae20-97d4f3e29a30').toString('base64')

// 	var options = {
// 		method: 'POST',
// 		body: data,
// 		json: true,
// 		url: 'https://api.hubapi.com/marketing/v3/transactional/single-email/send?hapikey=e76610a4-caea-4a58-ae20-97d4f3e29a30',
// 		headers: {
// 		  'content-type': 'application/json',
// 		  'hapikey' : 'e76610a4-caea-4a58-ae20-97d4f3e29a30'
// 		}
// 	  };
// 	  function callback(error, response, body) {
// 		 // console.log("Response is :",response);
// 		if (!error && response.statusCode == 200) {
// 		//  console.log(body)
// 		}
// 	  }
// 	  //call the request

// 	  return request(options, callback);
// }

function sendSingleEmail(to_email, subject, textContent, htmlContent) {
	sgMail.setApiKey(process.env.SEND_MAIL_API_KEY);

	const msg = {
		to: to_email, // Change to your recipient
		from: process.env.FROM_EMAIL, // Change to your verified sender
		subject: subject,
		text: textContent,
		html: htmlContent,
	}
	return new Promise(function (resolve, reject) {
		sgMail
			.send(msg)
			.then((response) => {
				console.log('Email sent')
				resolve(response);
			})
			.catch((error) => {
				console.error(error)
				reject(error);
			})
	});
}

// module.exports = {

function sendGridEmail(
	parentCallback,
	fromEmail,
	toEmails,
	subject,
	textContent,
	htmlContent
) {
	const errorEmails = [];
	const successfulEmails = [];
	async.parallel([
		function one(callback) {
			// Add to emails
			for (let i = 0; i < toEmails.length; i += 1) {
				// Add from emails
				const senderEmail = new helper.Email(fromEmail);
				// Add to email
				const toEmail = new helper.Email(toEmails[i]);
				// HTML Content

				console.log("To Email :", toEmail);
				const content = new helper.Content('text/html', htmlContent);
				const mail = new helper.Mail(senderEmail, subject, toEmail, content);
				console.log("Email Body :", mail);
				const request = sg.emptyRequest({
					method: 'POST',
					path: '/marketing/v3/transactional/single-email/send',
					body: mail,
				});

				console.log("Email Request :", request);
				sg.API(request, (error, response) => {
					if (error) {
						logger.log(`error ,Error during processing request at : ${new Date()} details message: ${error.message}`, 'error');
					}
					// console.log(response.statusCode);
					// console.log(response.body);
					// console.log(response.headers);
				});
			}
			// return
			callback(null, true);
		},
	], (err, results) => {
		if (err) {
			logger.log(`error ,Error during processing request at : ${new Date()} details message: ${err.message}`, 'error');
		} else {
			logger.log(`an email has been sent: ${new Date()} with results: ${results}`, 'info');
		}
		console.log('Done');
	});
	parentCallback(null,
		{
			successfulEmails,
			errorEmails,
		});
}

function sendPasswordResetEmail(to, token) {
	
	const link = makeDynamicLongLink("resetPassword", token, to);//`${baseUrl}/?link=${hostUrl}/resetPassword?token=${token}&email=${to}&apn=${appPackage}`

	const request = sg.emptyRequest({
		method: "POST",
		path: "/v3/mail/send",
		body: {
			personalizations: [
				{
					to: [
						{
							email: to
						}
					],
					subject: "Coin Aska : Reset Your Password"
				}
			],
			from: {
				email: process.env.FROM_EMAIL
			},
			content: [
				{
					type: 'text/html',
					value: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
					<html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml" lang="en">
					   <head>
						  <title></title>
						  <meta property="og:title" content="">
						  <meta name="twitter:title" content="">
						  <meta name="x-apple-disable-message-reformatting">
						  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
						  <meta http-equiv="X-UA-Compatible" content="IE=edge">
						  <meta name="viewport" content="width=device-width, initial-scale=1.0">
						  <!--[if gte mso 9]>
						  <xml>
							 <o:OfficeDocumentSettings>
								<o:AllowPNG/>
								<o:PixelsPerInch>96</o:PixelsPerInch>
							 </o:OfficeDocumentSettings>
						  </xml>
						  <style>
							 ul > li {
							 text-indent: -1em;
							 }
						  </style>
						  <![endif]-->
						  <!--[if mso]>
						  <style type="text/css">
							 body, td {font-family: Arial, Helvetica, sans-serif;}
						  </style>
						  <![endif]-->
						  <base href="https://20659291.hubspotpreview-na1.com" target="_blank">
						  <meta name="generator" content="HubSpot">
						  <meta property="og:url" content="http://20659291.hs-sites.com/-temporary-slug-1545f6b3-6fec-43b8-8d59-d2fe0048d8d7?hs_preview=PZmnHxaU-80774483001">
						  <meta name="robots" content="noindex,follow">
						  <!--[if !((mso)|(IE))]><!-- -->
						  <style type="text/css">.moz-text-html .hse-column-container{max-width:600px !important;width:600px !important}
							 .moz-text-html .hse-column{display:table-cell;vertical-align:top}.moz-text-html .hse-section .hse-size-12{max-width:600px !important;width:600px !important}
							 [owa] .hse-column-container{max-width:600px !important;width:600px !important}[owa] .hse-column{display:table-cell;vertical-align:top}
							 [owa] .hse-section .hse-size-12{max-width:600px !important;width:600px !important}
							 @media only screen and (min-width:640px){.hse-column-container{max-width:600px !important;width:600px !important}
							 .hse-column{display:table-cell;vertical-align:top}.hse-section .hse-size-12{max-width:600px !important;width:600px !important}
							 }@media only screen and (max-width:639px){img.stretch-on-mobile,.hs_rss_email_entries_table img,.hs-stretch-cta .hs-cta-img{height:auto !important;width:100% !important}
							 .display_block_on_small_screens{display:block}.hs_padded{padding-left:20px !important;padding-right:20px !important}
							 }
						  </style>
						  <!--<![endif]-->
						  <style type="text/css">body[data-outlook-cycle] img.stretch-on-mobile,body[data-outlook-cycle] .hs_rss_email_entries_table img{height:auto !important;width:100% !important}
							 body[data-outlook-cycle] .hs_padded{padding-left:20px !important;padding-right:20px !important}
							 a[x-apple-data-detectors]{color:inherit !important;text-decoration:none !important;font-size:inherit !important;font-family:inherit !important;font-weight:inherit !important;line-height:inherit !important}
							 #outlook a{padding:0}.yshortcuts a{border-bottom:none !important}a{text-decoration:underline}
							 .ExternalClass{width:100%}.ExternalClass,.ExternalClass p,.ExternalClass td,.ExternalClass div,.ExternalClass span,.ExternalClass font{line-height:100%}
							 p{margin:0}body{-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;-webkit-font-smoothing:antialiased;moz-osx-font-smoothing:grayscale}
							 @media only screen and (max-width:639px){img.stretch-on-mobile,.hs_rss_email_entries_table img,.hs-stretch-cta .hs-cta-img{height:auto !important;width:100% !important}
							 }@media only screen and (max-width:639px){img.stretch-on-mobile,.hs_rss_email_entries_table img,.hs-stretch-cta .hs-cta-img{height:auto !important;width:100% !important}
							 }
						  </style>
					   </head>
					   <body bgcolor="#FFFFFF" style="margin:0 !important; padding:0 !important; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word">
						  <!--[if gte mso 9]>
						  <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
							 <v:fill type="tile" size="100%,100%" color="#FFFFFF"/>
						  </v:background>
						  <![endif]-->
						  <div class="hse-body-background" style="background-color:#ffffff" bgcolor="#ffffff">
						  <table role="presentation" class="hse-body-wrapper-table" cellpadding="0" cellspacing="0" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; margin:0; padding:0; width:100% !important; min-width:320px !important; height:100% !important" width="100%" height="100%">
							 <tbody>
								<tr>
								   <td class="hse-body-wrapper-td" valign="top" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word">
									  <div id="hs_cos_wrapper_main" class="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_dnd_area" style="color: inherit; font-size: inherit; line-height: inherit;" data-hs-cos-general-type="widget" data-hs-cos-type="dnd_area">
									  <div id="section_1659355577058" class="hse-section hse-section-first" style="padding-left:10px; padding-right:10px; padding-top:20px">
									  <!--[if !((mso)|(IE))]><!-- -->
									  <div class="hse-column-container" style="min-width:280px; max-width:600px; width:100%; Margin-left:auto; Margin-right:auto; border-collapse:collapse; border-spacing:0; background-color:#FFFFFF" bgcolor="#FFFFFF">
										 <!--<![endif]-->
										 <!--[if (mso)|(IE)]>
										 <div class="hse-column-container" style="min-width:280px;max-width:600px;width:100%;Margin-left:auto;Margin-right:auto;border-collapse:collapse;border-spacing:0;">
											<table align="center" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;width:600px;" cellpadding="0" cellspacing="0" role="presentation" width="600" bgcolor="#FFFFFF">
											   <tr style="background-color:#FFFFFF;">
												  <![endif]-->
												  <!--[if (mso)|(IE)]>
												  <td valign="top" style="width:600px;">
													 <![endif]-->
													 <!--[if gte mso 9]>
													 <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;width:600px">
														<![endif]-->
														<div id="column_1659355577058_0" class="hse-column hse-size-12">
														   <div id="hs_cos_wrapper_module_16593555647132" class="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_module" style="color: inherit; font-size: inherit; line-height: inherit;" data-hs-cos-general-type="widget" data-hs-cos-type="module">
															  <!-- image_email.module - email-default-modules -->
															  <table class="hse-image-wrapper" role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt">
																 <tbody>
																	<tr>
																	   <td align="center" valign="top" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; color:#23496d; word-break:break-word; text-align:center; padding:10px 20px; font-size:0px">
																		  <img alt="Coin Aska 02" src="https://20659291.fs1.hubspotusercontent-na1.net/hub/20659291/hubfs/Coin Aska%2002.png?width=400&amp;upscale=true&amp;name=Coin Aska%2002.png" style="outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; max-width:100%; font-size:16px" width="200" align="middle">
																	   </td>
																	</tr>
																 </tbody>
															  </table>
														   </div>
														</div>
														<!--[if gte mso 9]>
													 </table>
													 <![endif]-->
													 <!--[if (mso)|(IE)]>
												  </td>
												  <![endif]-->
												  <!--[if (mso)|(IE)]>
											   </tr>
											</table>
											<![endif]-->
										 </div>
									  </div>
									  <div id="section-0" class="hse-section" style="padding-left:10px; padding-right:10px">
										 <!--[if !((mso)|(IE))]><!-- -->
										 <div class="hse-column-container" style="min-width:280px; max-width:600px; width:100%; Margin-left:auto; Margin-right:auto; border-collapse:collapse; border-spacing:0; background-color:#FFFFFF; padding-bottom:40px; padding-top:40px" bgcolor="#FFFFFF">
											<!--<![endif]-->
											<!--[if (mso)|(IE)]>
											<div class="hse-column-container" style="min-width:280px;max-width:600px;width:100%;Margin-left:auto;Margin-right:auto;border-collapse:collapse;border-spacing:0;">
											   <table align="center" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;width:600px;" cellpadding="0" cellspacing="0" role="presentation" width="600" bgcolor="#FFFFFF">
												  <tr style="background-color:#FFFFFF;">
													 <![endif]-->
													 <!--[if (mso)|(IE)]>
													 <td valign="top" style="width:600px;padding-bottom:40px; padding-top:40px;">
														<![endif]-->
														<!--[if gte mso 9]>
														<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;width:600px">
														   <![endif]-->
														   <div id="column-0-0" class="hse-column hse-size-12">
															  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt">
																 <tbody>
																	<tr>
																	   <td class="hs_padded" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; padding:10px 20px">
																		  <div id="hs_cos_wrapper_module_16593862002151" class="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_module" style="color: inherit; font-size: inherit; line-height: inherit;" data-hs-cos-general-type="widget" data-hs-cos-type="module">
																			 <div id="hs_cos_wrapper_module_16593862002151_" class="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_rich_text" style="color: inherit; font-size: inherit; line-height: inherit;" data-hs-cos-general-type="widget" data-hs-cos-type="rich_text">
																				<h2 style="margin:0; mso-line-height-rule:exactly; line-height:175%; font-size:22px; text-align:center" align="center">Password Reset</h2>
																				<p style="mso-line-height-rule:exactly; line-height:175%">&nbsp;</p>
																			 </div>
																		  </div>
																	   </td>
																	</tr>
																 </tbody>
															  </table>
															  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt">
																 <tbody>
																	<tr>
																	   <td class="hs_padded" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; padding:10px 20px">
																		  <div id="hs_cos_wrapper_module-0-0-0" class="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_module" style="color: inherit; font-size: inherit; line-height: inherit;" data-hs-cos-general-type="widget" data-hs-cos-type="module">
																			 <div id="hs_cos_wrapper_module-0-0-0_" class="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_rich_text" style="color: inherit; font-size: inherit; line-height: inherit;" data-hs-cos-general-type="widget" data-hs-cos-type="rich_text">
																				<p style="mso-line-height-rule:exactly; line-height:175%">Hello! <br>We have received a password reset request for your Coin Aska Account<br>Click on the link below to set a new password for your account.</p>
																			 </div>
																		  </div>
																	   </td>
																	</tr>
																 </tbody>
															  </table>
															  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt">
																 <tbody>
																	<tr>
																	   <td class="hs_padded" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; padding:10px 20px">
																		  <div id="hs_cos_wrapper_module_16593564497803" class="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_module" style="color: inherit; font-size: inherit; line-height: inherit;" data-hs-cos-general-type="widget" data-hs-cos-type="module">
																			 <!-- button_email.module - email-default-modules -->
																			 <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-spacing:0 !important; mso-table-lspace:0pt; mso-table-rspace:0pt; border-collapse:separate!important">
																				<tbody>
																				   <tr>
																					  <!--[if mso]>
																					  <td align="center" valign="middle" bgcolor="#1059fa" role="presentation"  valign="middle" style="border-radius:25px;cursor:auto;background-color:#1059fa;padding:12px 18px;">
																						 <![endif]-->
																						 <!--[if !mso]><!-- -->
																					  <td align="center" valign="middle" bgcolor="#1059fa" role="presentation" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; border-radius:25px; cursor:auto; background-color:#1059fa">
																						 <!--<![endif]-->
																						 <a href="${link}" target="_blank" style="color:#00a4bd; mso-line-height-rule:exactly; font-size:16px; font-family:Arial, sans-serif; Margin:0; text-transform:none; text-decoration:none; padding:12px 18px; display:block" data-hs-link-id="0">
																						 <strong style="color:#ffffff;font-weight:normal;text-decoration:none;font-style:normal;">Reset Password</strong>
																						 </a>
																					  </td>
																				   </tr>
																				</tbody>
																			 </table>
																		  </div>
																	   </td>
																	</tr>
																 </tbody>
															  </table>
															  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt">
																 <tbody>
																	<tr>
																	   <td class="hs_padded" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; padding:10px 20px">
																		  <div id="hs_cos_wrapper_module_16593564248482" class="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_module" style="color: inherit; font-size: inherit; line-height: inherit;" data-hs-cos-general-type="widget" data-hs-cos-type="module">
																			 <div id="hs_cos_wrapper_module_16593564248482_" class="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_rich_text" style="color: inherit; font-size: inherit; line-height: inherit;" data-hs-cos-general-type="widget" data-hs-cos-type="rich_text">
																				<p style="mso-line-height-rule:exactly; line-height:175%">If you did not initiate the process, no further action is required.</p>
																				<p style="mso-line-height-rule:exactly; line-height:175%; margin-bottom:10px; font-weight:normal">&nbsp;</p>
																				<p style="mso-line-height-rule:exactly; line-height:175%; font-weight:normal">Regards,</p>
																				<p style="mso-line-height-rule:exactly; line-height:175%; font-weight:normal">Team Coin Aska</p>
																			 </div>
																		  </div>
																	   </td>
																	</tr>
																 </tbody>
															  </table>
														   </div>
														   <!--[if gte mso 9]>
														</table>
														<![endif]-->
														<!--[if (mso)|(IE)]>
													 </td>
													 <![endif]-->
													 <!--[if (mso)|(IE)]>
												  </tr>
											   </table>
											   <![endif]-->
											</div>
										 </div>
										 <div id="section-1" class="hse-section hse-section-last" style="padding-left:10px; padding-right:10px; padding-bottom:20px">
											<!--[if !((mso)|(IE))]><!-- -->
											<div class="hse-column-container" style="min-width:280px; max-width:600px; width:100%; Margin-left:auto; Margin-right:auto; border-collapse:collapse; border-spacing:0">
											   <!--<![endif]-->
											   <!--[if (mso)|(IE)]>
											   <div class="hse-column-container" style="min-width:280px;max-width:600px;width:100%;Margin-left:auto;Margin-right:auto;border-collapse:collapse;border-spacing:0;">
												  <table align="center" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;width:600px;" cellpadding="0" cellspacing="0" role="presentation">
													 <tr>
														<![endif]-->
														<!--[if (mso)|(IE)]>
														<td valign="top" style="width:600px;">
														   <![endif]-->
														   <!--[if gte mso 9]>
														   <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;width:600px">
															  <![endif]-->
															  <div id="column-1-0" class="hse-column hse-size-12">
																 <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt">
																	<tbody>
																	   <tr>
																		  <td class="hs_padded" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; padding:10px 20px">
																			 <div id="hs_cos_wrapper_module_16593546719471" class="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_module" style="color: inherit; font-size: inherit; line-height: inherit;" data-hs-cos-general-type="widget" data-hs-cos-type="module">
																				<!-- follow_me_email.module - email-default-modules -->
																				<table role="presentation" align="center" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; width:auto; text-align:center" class="hs_cos_wrapper_type_social_module" width="auto">
																				   <tbody>
																					  <tr align="center">
																						 <td style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word">
																							<table role="presentation" align="center" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; width:auto; text-align:center" class="hs_cos_wrapper_type_social_module_single" width="auto">
																							   <tbody>
																								  <tr align="center">
																									 <td class="display_block_on_small_screens" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; padding:8px 5px; line-height:1; vertical-align:middle" valign="middle">
																										<a href="https://instagram.com/Coin Aska.ai?igshid=NWRhNmQxMjQ=" style="color:#00a4bd; mso-line-height-rule:exactly; text-decoration:none !important" data-hs-link-id="0" target="_blank">
																										<img src="https://hs-20659291.f.hubspotstarter.net/hs/hsstatic/TemplateAssets/static-1.108/img/hs_default_template_images/modules/Follow+Me+-+Email/instagram_circle_color.png" alt="Instagram" height="25" style="outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; border:none; width:auto!important; height:25px!important; vertical-align:middle" valign="middle" width="auto">
																										</a>
																									 </td>
																								  </tr>
																							   </tbody>
																							</table>
																						 </td>
																						 <td style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word">
																							<table role="presentation" align="center" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; width:auto; text-align:center" class="hs_cos_wrapper_type_social_module_single" width="auto">
																							   <tbody>
																								  <tr align="center">
																									 <td class="display_block_on_small_screens" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; padding:8px 5px; line-height:1; vertical-align:middle" valign="middle">
																										<a href="https://www.linkedin.com/company/Coin Askaai/" style="color:#00a4bd; mso-line-height-rule:exactly; text-decoration:none !important" data-hs-link-id="0" target="_blank">
																										<img src="https://hs-20659291.f.hubspotstarter.net/hs/hsstatic/TemplateAssets/static-1.108/img/hs_default_template_images/modules/Follow+Me+-+Email/linkedin_circle_color.png" alt="LinkedIn" height="25" style="outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; border:none; width:auto!important; height:25px!important; vertical-align:middle" valign="middle" width="auto">
																										</a>
																									 </td>
																								  </tr>
																							   </tbody>
																							</table>
																						 </td>
																						 <td style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word">
																							<table role="presentation" align="center" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; width:auto; text-align:center" class="hs_cos_wrapper_type_social_module_single" width="auto">
																							   <tbody>
																								  <tr align="center">
																									 <td class="display_block_on_small_screens" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; padding:8px 5px; line-height:1; vertical-align:middle" valign="middle">
																										<a href="https://twitter.com/Coin Askaai?s=21&amp;t=ryYxPbtEGZ9HjkoHsXJIgQ" style="color:#00a4bd; mso-line-height-rule:exactly; text-decoration:none !important" data-hs-link-id="0" target="_blank">
																										<img src="https://hs-20659291.f.hubspotstarter.net/hs/hsstatic/TemplateAssets/static-1.108/img/hs_default_template_images/modules/Follow+Me+-+Email/twitter_circle_color.png" alt="Twitter" height="25" style="outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; border:none; width:auto!important; height:25px!important; vertical-align:middle" valign="middle" width="auto">
																										</a>
																									 </td>
																								  </tr>
																							   </tbody>
																							</table>
																						 </td>
																						 <td style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word">
																							<table role="presentation" align="center" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; width:auto; text-align:center" class="hs_cos_wrapper_type_social_module_single" width="auto">
																							   <tbody>
																								  <tr align="center">
																									 <td class="display_block_on_small_screens" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; padding:8px 5px; line-height:1; vertical-align:middle" valign="middle">
																										<a href="https://www.facebook.com/Coin Askaai/" style="color:#00a4bd; mso-line-height-rule:exactly; text-decoration:none !important" data-hs-link-id="0" target="_blank">
																										<img src="https://hs-20659291.f.hubspotstarter.net/hs/hsstatic/TemplateAssets/static-1.108/img/hs_default_template_images/modules/Follow+Me+-+Email/facebook_circle_color.png" alt="Facebook" height="25" style="outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; border:none; width:auto!important; height:25px!important; vertical-align:middle" valign="middle" width="auto">
																										</a>
																									 </td>
																								  </tr>
																							   </tbody>
																							</table>
																						 </td>
																					  </tr>
																				   </tbody>
																				</table>
																			 </div>
																		  </td>
																	   </tr>
																	</tbody>
																 </table>
																 <div id="hs_cos_wrapper_module_16593552032111" class="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_module" style="color: inherit; font-size: inherit; line-height: inherit;" data-hs-cos-general-type="widget" data-hs-cos-type="module">
																	<!-- image_email.module - email-default-modules -->
																	<table class="hse-image-wrapper" role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt">
																	   <tbody>
																		  <tr>
																			 <td align="center" valign="top" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; color:#23496d; word-break:break-word; text-align:center; padding:10px 20px; font-size:0px">
																				<img alt="crypto mutual fund" src="https://20659291.fs1.hubspotusercontent-na1.net/hub/20659291/hubfs/crypto%20mutual%20fund.png?width=700&amp;upscale=true&amp;name=crypto%20mutual%20fund.png" style="outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; max-width:100%; font-size:16px" width="350" align="middle">
																			 </td>
																		  </tr>
																	   </tbody>
																	</table>
																 </div>
																 <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt">
																	<tbody>
																	   <tr>
																		  <td class="hs_padded" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; padding:10px 20px">
																			 <div id="hs_cos_wrapper_module-1-0-0" class="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_module" style="color: inherit; font-size: inherit; line-height: inherit;" data-hs-cos-general-type="widget" data-hs-cos-type="module">
																				<!-- email_footer.module - email-default-modules -->
																				<table role="presentation" class="hse-footer hse-secondary" width="100%" cellpadding="0" cellspacing="0" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; font-family:Arial, sans-serif; font-size:12px; line-height:135%; color:#23496d; margin-bottom:0; padding:0">
																				   <tbody>
																					  <tr>
																						 <td align="center" valign="top" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; text-align:center; margin-bottom:0; line-height:135%; padding:10px 20px">
																							<p style="mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:12px; font-weight:normal; text-decoration:none; font-style:normal; color:#23496d; direction:lrt" dir="lrt">
																							   Bhim Digital, Inc, 309 PAWTUCKET BLVD, Lowell, MA 01854, United States
																							</p>
																							<p style="mso-line-height-rule:exactly">
																							   <a data-unsubscribe="true" href="https://hs-20659291.s.hubspotstarter.net/email-unsubscribe/email?product=emailStarter&amp;checkSubscriptions=all&amp;d=VmYj8c957LGxVKgD3Q3_YlyBW2m3bL73_YlyBN1JxwY5GKd_PV20N7q3d_6_DW1LYLPh5Hbg6YN66bBJs1yqQw1&amp;v=2&amp;email=example@example.com" style="mso-line-height-rule:exactly; font-family:Helvetica,Arial,sans-serif; font-size:12px; color:#00a4bd; font-weight:normal; text-decoration:underline; font-style:normal" data-hs-link-id="0" target="_blank">Unsubscribe</a>
																							   <a data-unsubscribe="true" href="https://hs-20659291.s.hubspotstarter.net/email-unsubscribe/email?product=emailStarter&amp;d=VmYj8c957LGxVKgD3Q3_YlyBW2m3bL73_YlyBN1JxwY5GKd_PV20N7q3d_6_DW1LYLPh5Hbg6YN66bBJs1yqQw1&amp;v=2&amp;email=example@example.com" style="mso-line-height-rule:exactly; font-family:Helvetica,Arial,sans-serif; font-size:12px; color:#00a4bd; font-weight:normal; text-decoration:underline; font-style:normal" data-hs-link-id="0" target="_blank">Manage preferences</a>
																							</p>
																						 </td>
																					  </tr>
																				   </tbody>
																				</table>
																			 </div>
																		  </td>
																	   </tr>
																	</tbody>
																 </table>
															  </div>
															  <!--[if gte mso 9]>
														   </table>
														   <![endif]-->
														   <!--[if (mso)|(IE)]>
														</td>
														<![endif]-->
														<!--[if (mso)|(IE)]>
													 </tr>
												  </table>
												  <![endif]-->
											   </div>
											</div>
										 </div>
								   </td>
								</tr>
							 </tbody>
						  </table>
						  </div>
					   </body>
					</html>`
				}
			]
		}
	});
	return new Promise(function (resolve, reject) {
		sg.API(request, function (error, response) {
			if (error) {
				reject(error);
				//return error;
			}
			else {
				resolve(response);
				//return response;
			}
		});
	});
}

function sendVerificationEmail(to, token) {
	const link = makeDynamicLongLink("emailVerification", token, to);//`${baseUrl}/?link=${urlLink}&apn=${appPackage}`
	const request = sg.emptyRequest({
		method: "POST",
		path: "/v3/mail/send",
		body: {
			personalizations: [
				{
					to: [
						{
							email: to
						}
					],
					subject: "Coin Aska : Verify Your E-mail Address"
				}
			],
			from: {
				email: process.env.FROM_EMAIL
			},
			content: [
				{
					type: 'text/html',
					value: `
					<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml" lang="en"><head>
						
						
						
					<meta name="x-apple-disable-message-reformatting">
					<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
					
					<meta http-equiv="X-UA-Compatible" content="IE=edge">
					
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					
					
						<!--[if gte mso 9]>
					  <xml>
						  <o:OfficeDocumentSettings>
						  <o:AllowPNG/>
						  <o:PixelsPerInch>96</o:PixelsPerInch>
						  </o:OfficeDocumentSettings>
					  </xml>
					  
					  <style>
						ul > li {
						  text-indent: -1em;
						}
					  </style>
					<![endif]-->
					<!--[if mso]>
					<style type="text/css">
					 body, td {font-family: Arial, Helvetica, sans-serif;}
					</style>
					<![endif]-->
					
					
						
					
					
					
					
					
					
						  
					
					
					
					
					
					
					
					
					
					
					
					
					
						
					
					
					  <base href="https://20659291.hubspotpreview-na1.com" target="_blank"><meta name="generator" content="HubSpot"><meta property="og:url" content="http://20659291.hs-sites.com/-temporary-slug-f9b89549-d65a-4199-bf11-56078b4a6047?hs_preview=ujbLWnAS-80728860682"><meta name="robots" content="noindex,follow"><!--[if !((mso)|(IE))]><!-- --><style type="text/css">.moz-text-html .hse-column-container{max-width:600px !important;width:600px !important}
					.moz-text-html .hse-column{display:table-cell;vertical-align:top}.moz-text-html .hse-section .hse-size-12{max-width:600px !important;width:600px !important}
					[owa] .hse-column-container{max-width:600px !important;width:600px !important}[owa] .hse-column{display:table-cell;vertical-align:top}
					[owa] .hse-section .hse-size-12{max-width:600px !important;width:600px !important}
					@media only screen and (min-width:640px){.hse-column-container{max-width:600px !important;width:600px !important}
					.hse-column{display:table-cell;vertical-align:top}.hse-section .hse-size-12{max-width:600px !important;width:600px !important}
					}@media only screen and (max-width:639px){img.stretch-on-mobile,.hs_rss_email_entries_table img,.hs-stretch-cta .hs-cta-img{height:auto !important;width:100% !important}
					.display_block_on_small_screens{display:block}.hs_padded{padding-left:20px !important;padding-right:20px !important}
					}</style><!--<![endif]--><style type="text/css">body[data-outlook-cycle] img.stretch-on-mobile,body[data-outlook-cycle] .hs_rss_email_entries_table img{height:auto !important;width:100% !important}
					body[data-outlook-cycle] .hs_padded{padding-left:20px !important;padding-right:20px !important}
					a[x-apple-data-detectors]{color:inherit !important;text-decoration:none !important;font-size:inherit !important;font-family:inherit !important;font-weight:inherit !important;line-height:inherit !important}
					#outlook a{padding:0}.yshortcuts a{border-bottom:none !important}a{text-decoration:underline}
					.ExternalClass{width:100%}.ExternalClass,.ExternalClass p,.ExternalClass td,.ExternalClass div,.ExternalClass span,.ExternalClass font{line-height:100%}
					p{margin:0}body{-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;-webkit-font-smoothing:antialiased;moz-osx-font-smoothing:grayscale}
					@media only screen and (max-width:639px){img.stretch-on-mobile,.hs_rss_email_entries_table img,.hs-stretch-cta .hs-cta-img{height:auto !important;width:100% !important}
					}@media only screen and (max-width:639px){img.stretch-on-mobile,.hs_rss_email_entries_table img,.hs-stretch-cta .hs-cta-img{height:auto !important;width:100% !important}
					}</style></head>
					  <body bgcolor="#FFFFFF" style="margin:0 !important; padding:0 !important; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word">
						
					
					
					
					
					
						
					<!--[if gte mso 9]>
					<v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
					  
						<v:fill type="tile" size="100%,100%" color="#FFFFFF"/>
					  
					</v:background>
					<![endif]-->
					
					
						<div class="hse-body-background" style="background-color:#ffffff" bgcolor="#ffffff">
						  <table role="presentation" class="hse-body-wrapper-table" cellpadding="0" cellspacing="0" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; margin:0; padding:0; width:100% !important; min-width:320px !important; height:100% !important" width="100%" height="100%">
							<tbody><tr>
							  <td class="hse-body-wrapper-td" valign="top" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word">
								<div id="hs_cos_wrapper_main" class="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_dnd_area" style="color: inherit; font-size: inherit; line-height: inherit;" data-hs-cos-general-type="widget" data-hs-cos-type="dnd_area">  <div id="section_1659355577058" class="hse-section hse-section-first" style="padding-left:10px; padding-right:10px; padding-top:20px">
					
						
						
						<!--[if !((mso)|(IE))]><!-- -->
						  <div class="hse-column-container" style="min-width:280px; max-width:600px; width:100%; Margin-left:auto; Margin-right:auto; border-collapse:collapse; border-spacing:0; background-color:#FFFFFF" bgcolor="#FFFFFF">
						<!--<![endif]-->
						
						<!--[if (mso)|(IE)]>
						  <div class="hse-column-container" style="min-width:280px;max-width:600px;width:100%;Margin-left:auto;Margin-right:auto;border-collapse:collapse;border-spacing:0;">
						  <table align="center" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;width:600px;" cellpadding="0" cellspacing="0" role="presentation" width="600" bgcolor="#FFFFFF">
						  <tr style="background-color:#FFFFFF;">
						<![endif]-->
					
						<!--[if (mso)|(IE)]>
					  <td valign="top" style="width:600px;">
					<![endif]-->
					<!--[if gte mso 9]>
					  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;width:600px">
					<![endif]-->
					<div id="column_1659355577058_0" class="hse-column hse-size-12">
					  <div id="hs_cos_wrapper_module_16593555647132" class="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_module" style="color: inherit; font-size: inherit; line-height: inherit;" data-hs-cos-general-type="widget" data-hs-cos-type="module"><!-- image_email.module - email-default-modules -->
					
					
					
					
					
					
						
					
					
					<table class="hse-image-wrapper" role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt">
						<tbody>
							<tr>
								<td align="center" valign="top" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; color:#23496d; word-break:break-word; text-align:center; padding:10px 20px; font-size:0px">
									
									<img alt="Coin Aska 02" src="https://20659291.fs1.hubspotusercontent-na1.net/hub/20659291/hubfs/Coin Aska%2002.png?width=400&amp;upscale=true&amp;name=Coin Aska%2002.png" style="outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; max-width:100%; font-size:16px" width="200" align="middle">
									
								</td>
							</tr>
						</tbody>
					</table></div>
					</div>
					<!--[if gte mso 9]></table><![endif]-->
					<!--[if (mso)|(IE)]></td><![endif]-->
					
					
						<!--[if (mso)|(IE)]></tr></table><![endif]-->
					
						</div>
					   
					  </div>
					
					  <div id="section-0" class="hse-section" style="padding-left:10px; padding-right:10px">
					
						
						
						<!--[if !((mso)|(IE))]><!-- -->
						  <div class="hse-column-container" style="min-width:280px; max-width:600px; width:100%; Margin-left:auto; Margin-right:auto; border-collapse:collapse; border-spacing:0; background-color:#FFFFFF; padding-bottom:40px; padding-top:40px" bgcolor="#FFFFFF">
						<!--<![endif]-->
						
						<!--[if (mso)|(IE)]>
						  <div class="hse-column-container" style="min-width:280px;max-width:600px;width:100%;Margin-left:auto;Margin-right:auto;border-collapse:collapse;border-spacing:0;">
						  <table align="center" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;width:600px;" cellpadding="0" cellspacing="0" role="presentation" width="600" bgcolor="#FFFFFF">
						  <tr style="background-color:#FFFFFF;">
						<![endif]-->
					
						<!--[if (mso)|(IE)]>
					  <td valign="top" style="width:600px;padding-bottom:40px; padding-top:40px;">
					<![endif]-->
					<!--[if gte mso 9]>
					  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;width:600px">
					<![endif]-->
					<div id="column-0-0" class="hse-column hse-size-12">
					  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt"><tbody><tr><td class="hs_padded" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; padding:10px 20px"><div id="hs_cos_wrapper_module-0-0-0" class="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_module" style="color: inherit; font-size: inherit; line-height: inherit;" data-hs-cos-general-type="widget" data-hs-cos-type="module"><div id="hs_cos_wrapper_module-0-0-0_" class="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_rich_text" style="color: inherit; font-size: inherit; line-height: inherit;" data-hs-cos-general-type="widget" data-hs-cos-type="rich_text"><p style="mso-line-height-rule:exactly; line-height:175%">Hello!</p>
					<p style="mso-line-height-rule:exactly; line-height:175%">Welcome to Coin Aska!</p>
					<p style="mso-line-height-rule:exactly; line-height:175%">You are almost ready to get started. To complete the Sign-up process, click on the link below to verify your E-mail account.</p></div></div></td></tr></tbody></table>
					<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt"><tbody><tr><td class="hs_padded" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; padding:10px 20px"><div id="hs_cos_wrapper_module_16593564497803" class="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_module" style="color: inherit; font-size: inherit; line-height: inherit;" data-hs-cos-general-type="widget" data-hs-cos-type="module"><!-- button_email.module - email-default-modules -->
					
					
					
					
					
					  
						
					  
					
					
					
					
					
					
					
					
					
					
					
					
					
					
					
					
					
					
					
					
					
					
					
					
					
					  <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-spacing:0 !important; mso-table-lspace:0pt; mso-table-rspace:0pt; border-collapse:separate!important">
						<tbody><tr>
							<!--[if mso]>
						  <td align="center" valign="middle" bgcolor="#1059fa" role="presentation"  valign="middle" style="border-radius:25px;cursor:auto;background-color:#1059fa;padding:12px 18px;">
						<![endif]-->
						<!--[if !mso]><!-- -->
						  <td align="center" valign="middle" bgcolor="#1059fa" role="presentation" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; border-radius:25px; cursor:auto; background-color:#1059fa">
					   <!--<![endif]-->
							<a href="${link}" target="_blank" style="color:#00a4bd; mso-line-height-rule:exactly; font-size:16px; font-family:Arial, sans-serif; Margin:0; text-transform:none; text-decoration:none; padding:12px 18px; display:block" data-hs-link-id="0">
							  <strong style="color:#ffffff;font-weight:normal;text-decoration:none;font-style:normal;">Verify Email</strong>
							</a>
						  </td>
						</tr>
					  </tbody></table>
					</div></td></tr></tbody></table>
					<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt"><tbody><tr><td class="hs_padded" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; padding:10px 20px"><div id="hs_cos_wrapper_module_16593564248482" class="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_module" style="color: inherit; font-size: inherit; line-height: inherit;" data-hs-cos-general-type="widget" data-hs-cos-type="module"><div id="hs_cos_wrapper_module_16593564248482_" class="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_rich_text" style="color: inherit; font-size: inherit; line-height: inherit;" data-hs-cos-general-type="widget" data-hs-cos-type="rich_text"><p style="mso-line-height-rule:exactly; line-height:175%">If you did not create the account, no further action is required.</p>
					<p style="mso-line-height-rule:exactly; line-height:175%; margin-bottom:10px; font-weight:normal">&nbsp;</p>
					<p style="mso-line-height-rule:exactly; line-height:175%; font-weight:normal">Regards,</p>
					<p style="mso-line-height-rule:exactly; line-height:175%; font-weight:normal">Team Coin Aska</p></div></div></td></tr></tbody></table>
					</div>
					<!--[if gte mso 9]></table><![endif]-->
					<!--[if (mso)|(IE)]></td><![endif]-->
					
					
						<!--[if (mso)|(IE)]></tr></table><![endif]-->
					
						</div>
					   
					  </div>
					
					  <div id="section-1" class="hse-section hse-section-last" style="padding-left:10px; padding-right:10px; padding-bottom:20px">
					
						
						
						<!--[if !((mso)|(IE))]><!-- -->
						  <div class="hse-column-container" style="min-width:280px; max-width:600px; width:100%; Margin-left:auto; Margin-right:auto; border-collapse:collapse; border-spacing:0">
						<!--<![endif]-->
						
						<!--[if (mso)|(IE)]>
						  <div class="hse-column-container" style="min-width:280px;max-width:600px;width:100%;Margin-left:auto;Margin-right:auto;border-collapse:collapse;border-spacing:0;">
						  <table align="center" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;width:600px;" cellpadding="0" cellspacing="0" role="presentation">
						  <tr>
						<![endif]-->
					
						<!--[if (mso)|(IE)]>
					  <td valign="top" style="width:600px;">
					<![endif]-->
					<!--[if gte mso 9]>
					  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;width:600px">
					<![endif]-->
					<div id="column-1-0" class="hse-column hse-size-12">
					  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt"><tbody><tr><td class="hs_padded" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; padding:10px 20px"><div id="hs_cos_wrapper_module_16593546719471" class="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_module" style="color: inherit; font-size: inherit; line-height: inherit;" data-hs-cos-general-type="widget" data-hs-cos-type="module"><!-- follow_me_email.module - email-default-modules -->
					
					
					
					<table role="presentation" align="center" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; width:auto; text-align:center" class="hs_cos_wrapper_type_social_module" width="auto">
					  <tbody>
						<tr align="center">
						  
						  <td style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word">
							<table role="presentation" align="center" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; width:auto; text-align:center" class="hs_cos_wrapper_type_social_module_single" width="auto">
							  <tbody>
								<tr align="center">
								  
								  <td class="display_block_on_small_screens" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; padding:8px 5px; line-height:1; vertical-align:middle" valign="middle">
									<a href="https://instagram.com/Coin Aska.ai?igshid=NWRhNmQxMjQ=" style="color:#00a4bd; mso-line-height-rule:exactly; text-decoration:none !important" data-hs-link-id="0" target="_blank">
									  
									  
									  <img src="https://hs-20659291.f.hubspotstarter.net/hs/hsstatic/TemplateAssets/static-1.108/img/hs_default_template_images/modules/Follow+Me+-+Email/instagram_circle_color.png" alt="Instagram" height="25" style="outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; border:none; width:auto!important; height:25px!important; vertical-align:middle" valign="middle" width="auto">
									  
									</a>
								  </td>
								  
								  
							  </tr>
							</tbody>
						  </table>
							  </td>
						  
						  <td style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word">
							<table role="presentation" align="center" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; width:auto; text-align:center" class="hs_cos_wrapper_type_social_module_single" width="auto">
							  <tbody>
								<tr align="center">
								  
								  <td class="display_block_on_small_screens" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; padding:8px 5px; line-height:1; vertical-align:middle" valign="middle">
									<a href="https://www.linkedin.com/company/Coin Askaai/" style="color:#00a4bd; mso-line-height-rule:exactly; text-decoration:none !important" data-hs-link-id="0" target="_blank">
									  
									  
									  <img src="https://hs-20659291.f.hubspotstarter.net/hs/hsstatic/TemplateAssets/static-1.108/img/hs_default_template_images/modules/Follow+Me+-+Email/linkedin_circle_color.png" alt="LinkedIn" height="25" style="outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; border:none; width:auto!important; height:25px!important; vertical-align:middle" valign="middle" width="auto">
									  
									</a>
								  </td>
								  
								  
							  </tr>
							</tbody>
						  </table>
							  </td>
						  
						  <td style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word">
							<table role="presentation" align="center" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; width:auto; text-align:center" class="hs_cos_wrapper_type_social_module_single" width="auto">
							  <tbody>
								<tr align="center">
								  
								  <td class="display_block_on_small_screens" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; padding:8px 5px; line-height:1; vertical-align:middle" valign="middle">
									<a href="https://twitter.com/Coin Askaai?s=21&amp;t=ryYxPbtEGZ9HjkoHsXJIgQ" style="color:#00a4bd; mso-line-height-rule:exactly; text-decoration:none !important" data-hs-link-id="0" target="_blank">
									  
									  
									  <img src="https://hs-20659291.f.hubspotstarter.net/hs/hsstatic/TemplateAssets/static-1.108/img/hs_default_template_images/modules/Follow+Me+-+Email/twitter_circle_color.png" alt="Twitter" height="25" style="outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; border:none; width:auto!important; height:25px!important; vertical-align:middle" valign="middle" width="auto">
									  
									</a>
								  </td>
								  
								  
							  </tr>
							</tbody>
						  </table>
							  </td>
						  
						  <td style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word">
							<table role="presentation" align="center" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; width:auto; text-align:center" class="hs_cos_wrapper_type_social_module_single" width="auto">
							  <tbody>
								<tr align="center">
								  
								  <td class="display_block_on_small_screens" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; padding:8px 5px; line-height:1; vertical-align:middle" valign="middle">
									<a href="https://www.facebook.com/Coin Askaai/" style="color:#00a4bd; mso-line-height-rule:exactly; text-decoration:none !important" data-hs-link-id="0" target="_blank">
									  
									  
									  <img src="https://hs-20659291.f.hubspotstarter.net/hs/hsstatic/TemplateAssets/static-1.108/img/hs_default_template_images/modules/Follow+Me+-+Email/facebook_circle_color.png" alt="Facebook" height="25" style="outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; border:none; width:auto!important; height:25px!important; vertical-align:middle" valign="middle" width="auto">
									  
									</a>
								  </td>
								  
								  
							  </tr>
							</tbody>
						  </table>
							  </td>
						  
						</tr>
					  </tbody>
					</table></div></td></tr></tbody></table>
					<div id="hs_cos_wrapper_module_16593552032111" class="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_module" style="color: inherit; font-size: inherit; line-height: inherit;" data-hs-cos-general-type="widget" data-hs-cos-type="module"><!-- image_email.module - email-default-modules -->
					
					
					
					
					
					
						
					
					
					<table class="hse-image-wrapper" role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt">
						<tbody>
							<tr>
								<td align="center" valign="top" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; color:#23496d; word-break:break-word; text-align:center; padding:10px 20px; font-size:0px">
									
									<img alt="crypto mutual fund" src="https://20659291.fs1.hubspotusercontent-na1.net/hub/20659291/hubfs/crypto%20mutual%20fund.png?width=700&amp;upscale=true&amp;name=crypto%20mutual%20fund.png" style="outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; max-width:100%; font-size:16px" width="350" align="middle">
									
								</td>
							</tr>
						</tbody>
					</table></div>
					<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt"><tbody><tr><td class="hs_padded" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; padding:10px 20px"><div id="hs_cos_wrapper_module-1-0-0" class="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_module" style="color: inherit; font-size: inherit; line-height: inherit;" data-hs-cos-general-type="widget" data-hs-cos-type="module"><!-- email_footer.module - email-default-modules -->
					
					
					
					
					
					
					
					
					
					
					  
					
					
					
					  
					  
					  
					  
					  
					  
					
					
					
					
					
					
					
					
					
					
					
					
					
					
					
					
					
					
					<table role="presentation" class="hse-footer hse-secondary" width="100%" cellpadding="0" cellspacing="0" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; font-family:Arial, sans-serif; font-size:12px; line-height:135%; color:#23496d; margin-bottom:0; padding:0">
						<tbody>
							<tr>
								<td align="center" valign="top" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; text-align:center; margin-bottom:0; line-height:135%; padding:10px 20px">
									
									<p style="mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:12px; font-weight:normal; text-decoration:none; font-style:normal; color:#23496d; direction:lrt" dir="lrt">
									  Bhim Digital, Inc, 309 PAWTUCKET BLVD, Lowell, MA 01854, United States
									</p>
									<p style="mso-line-height-rule:exactly">
									  
									  <a data-unsubscribe="true" href="https://hs-20659291.s.hubspotstarter.net/email-unsubscribe/email?product=emailStarter&amp;checkSubscriptions=all&amp;d=VmYj8c957LGxVKgD3Q3_YlyBW2m3bL73_YlyBN1JxwY5GKd_PV20N7q3d_6_DW1LYLPh5Hbg6YN66bBJs1yqQw1&amp;v=2&amp;email=example@example.com" style="mso-line-height-rule:exactly; font-family:Helvetica,Arial,sans-serif; font-size:12px; color:#00a4bd; font-weight:normal; text-decoration:underline; font-style:normal" data-hs-link-id="0" target="_blank">Unsubscribe</a>
									  
									  <a data-unsubscribe="true" href="https://hs-20659291.s.hubspotstarter.net/email-unsubscribe/email?product=emailStarter&amp;d=VmYj8c957LGxVKgD3Q3_YlyBW2m3bL73_YlyBN1JxwY5GKd_PV20N7q3d_6_DW1LYLPh5Hbg6YN66bBJs1yqQw1&amp;v=2&amp;email=example@example.com" style="mso-line-height-rule:exactly; font-family:Helvetica,Arial,sans-serif; font-size:12px; color:#00a4bd; font-weight:normal; text-decoration:underline; font-style:normal" data-hs-link-id="0" target="_blank">Manage preferences</a>
									  
									</p>
									
								</td>
							</tr>
						</tbody>
					</table></div></td></tr></tbody></table>
					</div>
					<!--[if gte mso 9]></table><![endif]-->
					<!--[if (mso)|(IE)]></td><![endif]-->
					
					
						<!--[if (mso)|(IE)]></tr></table><![endif]-->
					
						</div>
					   
					  </div>
					</div>
							  </td>
							</tr>
						  </tbody></table>
						</div>
					  
					</body></html>`
				}
			]
		}
	});
	return new Promise(function (resolve, reject) {
		sg.API(request, function (error, response) {
			if (error) {
				console.log("mail",error);
				reject(error);
			}
			else {
				console.log("mail",response);
				resolve(response);
			}
		});
	});
}

function makeDynamicLongLink(endpoint, token, toEmail) {
    const hostUrl = process.env.hostURL;
    const baseUrl = process.env.baseUrl;
    const appPackage = process.env.appPackage;
	return urlBuilder(`${baseUrl}`, {
		queryParams: {
			link: hostUrl + "/" + endpoint + "?" + "token=" + token + "&email=" + toEmail,
			apn: appPackage,
		}
	});
}

function sendEmail(to, templateId,param1=null,param2=null) {
	console.log("param1 :",param1);
	var mailBody = getEmailTemplate(templateId, to,param1,param2);
	const request = sg.emptyRequest({
		method: "POST",
		path: "/v3/mail/send",
		body: mailBody
	});
	return new Promise(function (resolve, reject) {
		sg.API(request, function (error, response) {
			if (error) {
				console.log(error,"mail");
				reject(error);
				//return error;
			}
			else {
				console.log(response,"mail");
				resolve(response);
				//return response;
			}
		});
	});
}

function getEmailTemplate(templateId,to,param1,param2) {
	var body = null;
	switch (templateId) {
		case 1:
			body = {
				personalizations: [
					{
						to: [
							{
								email: to
							}
						],
						subject: "Coin Aska : Welcome to Coin Aska, Your Home to Crypto Investment"
					}
				],
				from: {
					email: process.env.FROM_EMAIL
				},
				content: [
					{
						type: 'text/html',
						value: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml" lang="en"><head>
						<title>Welcome to Coin Aska!</title>
						<meta property="og:title" content="Welcome to Coin Aska!">
						<meta name="twitter:title" content="Welcome to Coin Aska!">
						
						
						
					<meta name="x-apple-disable-message-reformatting">
					<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
					
					<meta http-equiv="X-UA-Compatible" content="IE=edge">
					
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					
					
						<!--[if gte mso 9]>
					  <xml>
						  <o:OfficeDocumentSettings>
						  <o:AllowPNG/>
						  <o:PixelsPerInch>96</o:PixelsPerInch>
						  </o:OfficeDocumentSettings>
					  </xml>
					  
					  <style>
						ul > li {
						  text-indent: -1em;
						}
					  </style>
					<![endif]-->
					<!--[if mso]>
					<style type="text/css">
					 body, td {font-family: Arial, Helvetica, sans-serif;}
					</style>
					<![endif]-->
					
					
						
					
					
					
					
					
					
						  
					
					
					
					
					
					
					
					
					
					
					
					
					
						
					
					
					  <base href="https://20659291.hubspotpreview-na1.com" target="_blank"><meta name="generator" content="HubSpot"><meta property="og:url" content="http://20659291.hs-sites.com/-temporary-slug-f22def34-97d4-4971-82d5-097e4f85c2af?hs_preview=mGTDCWKp-80730322853"><meta name="robots" content="noindex,follow"><!--[if !((mso)|(IE))]><!-- --><style type="text/css">.moz-text-html .hse-column-container{max-width:600px !important;width:600px !important}
					.moz-text-html .hse-column{display:table-cell;vertical-align:top}.moz-text-html .hse-section .hse-size-12{max-width:600px !important;width:600px !important}
					[owa] .hse-column-container{max-width:600px !important;width:600px !important}[owa] .hse-column{display:table-cell;vertical-align:top}
					[owa] .hse-section .hse-size-12{max-width:600px !important;width:600px !important}
					@media only screen and (min-width:640px){.hse-column-container{max-width:600px !important;width:600px !important}
					.hse-column{display:table-cell;vertical-align:top}.hse-section .hse-size-12{max-width:600px !important;width:600px !important}
					}@media only screen and (max-width:639px){img.stretch-on-mobile,.hs_rss_email_entries_table img,.hs-stretch-cta .hs-cta-img{height:auto !important;width:100% !important}
					.display_block_on_small_screens{display:block}.hs_padded{padding-left:20px !important;padding-right:20px !important}
					}@media screen and (max-width:639px){.social-network-cell{display:inline-block}}</style><!--<![endif]--><style type="text/css">body[data-outlook-cycle] img.stretch-on-mobile,body[data-outlook-cycle] .hs_rss_email_entries_table img{height:auto !important;width:100% !important}
					body[data-outlook-cycle] .hs_padded{padding-left:20px !important;padding-right:20px !important}
					a[x-apple-data-detectors]{color:inherit !important;text-decoration:none !important;font-size:inherit !important;font-family:inherit !important;font-weight:inherit !important;line-height:inherit !important}
					#outlook a{padding:0}.yshortcuts a{border-bottom:none !important}a{text-decoration:underline}
					.ExternalClass{width:100%}.ExternalClass,.ExternalClass p,.ExternalClass td,.ExternalClass div,.ExternalClass span,.ExternalClass font{line-height:100%}
					p{margin:0}body{-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;-webkit-font-smoothing:antialiased;moz-osx-font-smoothing:grayscale}
					@media only screen and (max-width:639px){img.stretch-on-mobile,.hs_rss_email_entries_table img,.hs-stretch-cta .hs-cta-img{height:auto !important;width:100% !important}
					}@media only screen and (max-width:639px){img.stretch-on-mobile,.hs_rss_email_entries_table img,.hs-stretch-cta .hs-cta-img{height:auto !important;width:100% !important}
					}</style></head>
					  <body bgcolor="#FFFFFF" style="margin:0 !important; padding:0 !important; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word">
						
					
					
					
					
					
						
					<!--[if gte mso 9]>
					<v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
					  
						<v:fill type="tile" size="100%,100%" color="#FFFFFF"/>
					  
					</v:background>
					<![endif]-->
					
					
						<div class="hse-body-background" style="background-color:#ffffff" bgcolor="#ffffff">
						  <table role="presentation" class="hse-body-wrapper-table" cellpadding="0" cellspacing="0" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; margin:0; padding:0; width:100% !important; min-width:320px !important; height:100% !important" width="100%" height="100%">
							<tbody><tr>
							  <td class="hse-body-wrapper-td" valign="top" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word">
								<div id="hs_cos_wrapper_main" class="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_dnd_area" style="color: inherit; font-size: inherit; line-height: inherit;" data-hs-cos-general-type="widget" data-hs-cos-type="dnd_area">  <div id="section_1659355577058" class="hse-section hse-section-first" style="padding-left:10px; padding-right:10px; padding-top:20px">
					
						
						
						<!--[if !((mso)|(IE))]><!-- -->
						  <div class="hse-column-container" style="min-width:280px; max-width:600px; width:100%; Margin-left:auto; Margin-right:auto; border-collapse:collapse; border-spacing:0; background-color:#FFFFFF" bgcolor="#FFFFFF">
						<!--<![endif]-->
						
						<!--[if (mso)|(IE)]>
						  <div class="hse-column-container" style="min-width:280px;max-width:600px;width:100%;Margin-left:auto;Margin-right:auto;border-collapse:collapse;border-spacing:0;">
						  <table align="center" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;width:600px;" cellpadding="0" cellspacing="0" role="presentation" width="600" bgcolor="#FFFFFF">
						  <tr style="background-color:#FFFFFF;">
						<![endif]-->
					
						<!--[if (mso)|(IE)]>
					  <td valign="top" style="width:600px;">
					<![endif]-->
					<!--[if gte mso 9]>
					  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;width:600px">
					<![endif]-->
					<div id="column_1659355577058_0" class="hse-column hse-size-12">
					  <div id="hs_cos_wrapper_module_16593555647132" class="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_module" style="color: inherit; font-size: inherit; line-height: inherit;" data-hs-cos-general-type="widget" data-hs-cos-type="module"><!-- image_email.module - email-default-modules -->
					
					
					
					
					
					
						
					
					
					<table class="hse-image-wrapper" role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt">
						<tbody>
							<tr>
								<td align="center" valign="top" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; color:#23496d; word-break:break-word; text-align:center; padding:10px 20px; font-size:0px">
									
									<img alt="Coin Aska 02" src="https://20659291.fs1.hubspotusercontent-na1.net/hub/20659291/hubfs/Coin Aska%2002.png?width=400&amp;upscale=true&amp;name=Coin Aska%2002.png" style="outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; max-width:100%; font-size:16px" width="200" align="middle">
									
								</td>
							</tr>
						</tbody>
					</table></div>
					</div>
					<!--[if gte mso 9]></table><![endif]-->
					<!--[if (mso)|(IE)]></td><![endif]-->
					
					
						<!--[if (mso)|(IE)]></tr></table><![endif]-->
					
						</div>
					   
					  </div>
					
					  <div id="section-0" class="hse-section" style="padding-left:10px; padding-right:10px">
					
						
						
						<!--[if !((mso)|(IE))]><!-- -->
						  <div class="hse-column-container" style="min-width:280px; max-width:600px; width:100%; Margin-left:auto; Margin-right:auto; border-collapse:collapse; border-spacing:0; background-color:#FFFFFF; padding-bottom:40px; padding-top:40px" bgcolor="#FFFFFF">
						<!--<![endif]-->
						
						<!--[if (mso)|(IE)]>
						  <div class="hse-column-container" style="min-width:280px;max-width:600px;width:100%;Margin-left:auto;Margin-right:auto;border-collapse:collapse;border-spacing:0;">
						  <table align="center" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;width:600px;" cellpadding="0" cellspacing="0" role="presentation" width="600" bgcolor="#FFFFFF">
						  <tr style="background-color:#FFFFFF;">
						<![endif]-->
					
						<!--[if (mso)|(IE)]>
					  <td valign="top" style="width:600px;padding-bottom:40px; padding-top:40px;">
					<![endif]-->
					<!--[if gte mso 9]>
					  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;width:600px">
					<![endif]-->
					<div id="column-0-0" class="hse-column hse-size-12">
					  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt"><tbody><tr><td class="hs_padded" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; padding:10px 20px"><div id="hs_cos_wrapper_module_16593585773381" class="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_module" style="color: inherit; font-size: inherit; line-height: inherit;" data-hs-cos-general-type="widget" data-hs-cos-type="module"><div id="hs_cos_wrapper_module_16593585773381_" class="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_rich_text" style="color: inherit; font-size: inherit; line-height: inherit;" data-hs-cos-general-type="widget" data-hs-cos-type="rich_text"><h2 style="margin:0; mso-line-height-rule:exactly; line-height:175%; font-size:22px; text-align:center" align="center">Welcome Aboard!</h2></div></div></td></tr></tbody></table>
					<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt"><tbody><tr><td class="hs_padded" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; padding:10px 20px"><div id="hs_cos_wrapper_module-0-0-0" class="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_module" style="color: inherit; font-size: inherit; line-height: inherit;" data-hs-cos-general-type="widget" data-hs-cos-type="module"><div id="hs_cos_wrapper_module-0-0-0_" class="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_rich_text" style="color: inherit; font-size: inherit; line-height: inherit;" data-hs-cos-general-type="widget" data-hs-cos-type="rich_text"><p style="mso-line-height-rule:exactly; line-height:175%">Hi,</p>
					<p style="mso-line-height-rule:exactly; line-height:175%">&nbsp;</p>
					<p style="mso-line-height-rule:exactly; line-height:175%">Welcome! It’s never been easier to participate in crypto’s growth story. <strong>With Coin Aska, you not only invest in the best assets of the future but also with local compliance.</strong> We take care of all the fundamental research so that you don’t need to worry about where your money is going, plus you stay updated at every step.</p>
					<p style="mso-line-height-rule:exactly; line-height:175%">Wherever you are in your crypto journey, we’re glad you are with us. Looking forward to long-term wealth creation, together!</p>
					<p style="mso-line-height-rule:exactly; line-height:175%">&nbsp;</p>
					<p style="mso-line-height-rule:exactly; line-height:175%">P.S: Curious to know our investment process? Click here → <a href="https://docsend.com/view/a8vr4dadyrwwkh26" style="mso-line-height-rule:exactly; color:#00a4bd" data-hs-link-id="0" target="_blank">Coin Aska Investment Whitepaper</a></p>
					<p style="mso-line-height-rule:exactly; line-height:175%">&nbsp;</p>
					<p style="mso-line-height-rule:exactly; line-height:175%">Feel free to reach out to us in case of any query at <a href="/cdn-cgi/l/email-protection#04777174746b76704463766b7377746567612a656d" rel="noopener" style="mso-line-height-rule:exactly; color:#00a4bd" data-hs-link-id="0" target="_blank"><span class="__cf_email__" data-cfemail="12616762627d60665275607d6561627371773c737b">[email&#160;protected]</span></a></p>
					<p style="mso-line-height-rule:exactly; line-height:175%">&nbsp;</p>
					<p style="mso-line-height-rule:exactly; line-height:175%">Regards,</p>
					<p style="mso-line-height-rule:exactly; line-height:175%">Team Coin Aska</p></div></div></td></tr></tbody></table>
					</div>
					<!--[if gte mso 9]></table><![endif]-->
					<!--[if (mso)|(IE)]></td><![endif]-->
					
					
						<!--[if (mso)|(IE)]></tr></table><![endif]-->
					
						</div>
					   
					  </div>
					
					  <div id="section-1" class="hse-section hse-section-last" style="padding-left:10px; padding-right:10px; padding-bottom:20px">
					
						
						
						<!--[if !((mso)|(IE))]><!-- -->
						  <div class="hse-column-container" style="min-width:280px; max-width:600px; width:100%; Margin-left:auto; Margin-right:auto; border-collapse:collapse; border-spacing:0">
						<!--<![endif]-->
						
						<!--[if (mso)|(IE)]>
						  <div class="hse-column-container" style="min-width:280px;max-width:600px;width:100%;Margin-left:auto;Margin-right:auto;border-collapse:collapse;border-spacing:0;">
						  <table align="center" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;width:600px;" cellpadding="0" cellspacing="0" role="presentation">
						  <tr>
						<![endif]-->
					
						<!--[if (mso)|(IE)]>
					  <td valign="top" style="width:600px;">
					<![endif]-->
					<!--[if gte mso 9]>
					  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;width:600px">
					<![endif]-->
					<div id="column-1-0" class="hse-column hse-size-12">
					  <div id="hs_cos_wrapper_module_16593552032111" class="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_module" style="color: inherit; font-size: inherit; line-height: inherit;" data-hs-cos-general-type="widget" data-hs-cos-type="module"><!-- image_email.module - email-default-modules -->
					
					
					
					
					
					
						
					
					
					<table class="hse-image-wrapper" role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt">
						<tbody>
							<tr>
								<td align="center" valign="top" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; color:#23496d; word-break:break-word; text-align:center; padding:10px 20px; font-size:0px">
									
									<img alt="Coin Aska Logo_png" src="https://20659291.fs1.hubspotusercontent-na1.net/hub/20659291/hubfs/Coin Aska%20Logo_png.png?width=1120&amp;upscale=true&amp;name=Coin Aska%20Logo_png.png" style="outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; max-width:100%; font-size:16px" width="560" align="middle">
									
								</td>
							</tr>
						</tbody>
					</table></div>
					<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt"><tbody><tr><td class="hs_padded" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; padding:10px 20px"><div id="hs_cos_wrapper_module_16593546719471" class="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_module" style="color: inherit; font-size: inherit; line-height: inherit;" data-hs-cos-general-type="widget" data-hs-cos-type="module"><!-- follow_me_email.module - email-default-modules -->
					
					
					
					<table role="presentation" align="center" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; width:auto; text-align:center" class="hs_cos_wrapper_type_social_module" width="auto">
					  <tbody>
						<tr align="center">
						  
						  <td class="social-network-cell" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word">
							<table role="presentation" align="center" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; width:auto; text-align:center" class="hs_cos_wrapper_type_social_module_single" width="auto">
							  <tbody>
								<tr align="center">
								  
								  <td class="display_block_on_small_screens" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; padding:8px 5px; line-height:1; vertical-align:middle" valign="middle">
									<a href="https://instagram.com/Coin Aska.ai?igshid=NWRhNmQxMjQ=" style="color:#00a4bd; mso-line-height-rule:exactly; text-decoration:none !important" data-hs-link-id="0" target="_blank">
									  
									  
									  <img src="https://hs-20659291.f.hubspotstarter.net/hs/hsstatic/TemplateAssets/static-1.114/img/hs_default_template_images/modules/Follow+Me+-+Email/instagram_circle_color.png" alt="Instagram" height="25" style="outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; border:none; width:auto!important; height:25px!important; vertical-align:middle" valign="middle" width="auto">
									  
									</a>
								  </td>
								  
								  
								</tr>
							  </tbody>
							</table>
						  </td>
						  
						  <td class="social-network-cell" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word">
							<table role="presentation" align="center" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; width:auto; text-align:center" class="hs_cos_wrapper_type_social_module_single" width="auto">
							  <tbody>
								<tr align="center">
								  
								  <td class="display_block_on_small_screens" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; padding:8px 5px; line-height:1; vertical-align:middle" valign="middle">
									<a href="https://www.linkedin.com/company/Coin Askaai/" style="color:#00a4bd; mso-line-height-rule:exactly; text-decoration:none !important" data-hs-link-id="0" target="_blank">
									  
									  
									  <img src="https://hs-20659291.f.hubspotstarter.net/hs/hsstatic/TemplateAssets/static-1.114/img/hs_default_template_images/modules/Follow+Me+-+Email/linkedin_circle_color.png" alt="LinkedIn" height="25" style="outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; border:none; width:auto!important; height:25px!important; vertical-align:middle" valign="middle" width="auto">
									  
									</a>
								  </td>
								  
								  
								</tr>
							  </tbody>
							</table>
						  </td>
						  
						  <td class="social-network-cell" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word">
							<table role="presentation" align="center" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; width:auto; text-align:center" class="hs_cos_wrapper_type_social_module_single" width="auto">
							  <tbody>
								<tr align="center">
								  
								  <td class="display_block_on_small_screens" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; padding:8px 5px; line-height:1; vertical-align:middle" valign="middle">
									<a href="https://twitter.com/Coin Askaai?s=21&amp;t=ryYxPbtEGZ9HjkoHsXJIgQ" style="color:#00a4bd; mso-line-height-rule:exactly; text-decoration:none !important" data-hs-link-id="0" target="_blank">
									  
									  
									  <img src="https://hs-20659291.f.hubspotstarter.net/hs/hsstatic/TemplateAssets/static-1.114/img/hs_default_template_images/modules/Follow+Me+-+Email/twitter_circle_color.png" alt="Twitter" height="25" style="outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; border:none; width:auto!important; height:25px!important; vertical-align:middle" valign="middle" width="auto">
									  
									</a>
								  </td>
								  
								  
								</tr>
							  </tbody>
							</table>
						  </td>
						  
						  <td class="social-network-cell" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word">
							<table role="presentation" align="center" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; width:auto; text-align:center" class="hs_cos_wrapper_type_social_module_single" width="auto">
							  <tbody>
								<tr align="center">
								  
								  <td class="display_block_on_small_screens" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; padding:8px 5px; line-height:1; vertical-align:middle" valign="middle">
									<a href="https://www.facebook.com/Coin Askaai/" style="color:#00a4bd; mso-line-height-rule:exactly; text-decoration:none !important" data-hs-link-id="0" target="_blank">
									  
									  
									  <img src="https://hs-20659291.f.hubspotstarter.net/hs/hsstatic/TemplateAssets/static-1.114/img/hs_default_template_images/modules/Follow+Me+-+Email/facebook_circle_color.png" alt="Facebook" height="25" style="outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; border:none; width:auto!important; height:25px!important; vertical-align:middle" valign="middle" width="auto">
									  
									</a>
								  </td>
								  
								  
								</tr>
							  </tbody>
							</table>
						  </td>
						  
						  <td class="social-network-cell" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word">
							<table role="presentation" align="center" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; width:auto; text-align:center" class="hs_cos_wrapper_type_social_module_single" width="auto">
							  <tbody>
								<tr align="center">
								  
								  <td class="display_block_on_small_screens" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; padding:8px 5px; line-height:1; vertical-align:middle" valign="middle">
									<a href="https://discord.gg/Aq5k2Vpy" style="color:#00a4bd; mso-line-height-rule:exactly; text-decoration:none !important" data-hs-link-id="0" target="_blank">
									  
									  
										
										
									  
									  <img src="https://20659291.fs1.hubspotusercontent-na1.net/hub/20659291/hubfs/Discord-Logo-Circle-1024x1024-1.png?height=50&amp;upscale=true&amp;name=Discord-Logo-Circle-1024x1024-1.png" alt="Discord-Logo-Circle-1024x1024-1" height="25" style="outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; border:none; width:auto!important; height:25px!important; vertical-align:middle" valign="middle" width="auto">
									  
									</a>
								  </td>
								  
								  
								</tr>
							  </tbody>
							</table>
						  </td>
						  
						</tr>
					  </tbody>
					</table>
					
					</div></td></tr></tbody></table>
					<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt"><tbody><tr><td class="hs_padded" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; padding:10px 20px"><div id="hs_cos_wrapper_module_16594257110571" class="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_module" style="color: inherit; font-size: inherit; line-height: inherit;" data-hs-cos-general-type="widget" data-hs-cos-type="module"><div id="hs_cos_wrapper_module_16594257110571_" class="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_rich_text" style="color: inherit; font-size: inherit; line-height: inherit;" data-hs-cos-general-type="widget" data-hs-cos-type="rich_text"><p style="mso-line-height-rule:exactly; font-size:12px; line-height:175%; text-align:center" align="center">Crypto assets are unregulated &amp; highly speculative. No consumer protection. Capital at risk.</p></div></div></td></tr></tbody></table>
					<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt"><tbody><tr><td class="hs_padded" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; padding:10px 20px"><div id="hs_cos_wrapper_module-1-0-0" class="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_module" style="color: inherit; font-size: inherit; line-height: inherit;" data-hs-cos-general-type="widget" data-hs-cos-type="module"><!-- email_footer.module - email-default-modules -->
					
					
					
					
					
					
					
					
					
					
					  
					
					
					
					  
					  
					  
					  
					  
					  
					
					
					
					
					
					
					
					
					
					
					
					
					
					
					
					
					
					
					<table role="presentation" class="hse-footer hse-secondary" width="100%" cellpadding="0" cellspacing="0" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; font-family:Arial, sans-serif; font-size:12px; line-height:135%; color:#23496d; margin-bottom:0; padding:0">
						<tbody>
							<tr>
								<td align="center" valign="top" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; text-align:center; margin-bottom:0; line-height:135%; padding:10px 20px">
									
									<p style="mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:12px; font-weight:normal; text-decoration:none; font-style:normal; color:#23496d; direction:lrt" dir="lrt">
									  Bhim Digital, Inc, 309 Pawtucket Blvd, Lowell, MA 01854, United States
									</p>
									<p style="mso-line-height-rule:exactly">
									  
									  <a data-unsubscribe="true" href="https://hs-20659291.s.hubspotstarter.net/email-unsubscribe/email?product=emailStarter&amp;checkSubscriptions=all&amp;d=VmYj8c957LGxVKgD3Q3_YlyBW2m3bL73_YlyBN1JxwY5GKd_PV20N7q3d_6_DW1LYLPh5Hbg6YN66bBJs1yqQw1&amp;v=2&amp;email=example@example.com" style="mso-line-height-rule:exactly; font-family:Helvetica,Arial,sans-serif; font-size:12px; color:#00a4bd; font-weight:normal; text-decoration:underline; font-style:normal" data-hs-link-id="0" target="_blank">Unsubscribe</a>
									  
									  <a data-unsubscribe="true" href="https://hs-20659291.s.hubspotstarter.net/email-unsubscribe/email?product=emailStarter&amp;d=VmYj8c957LGxVKgD3Q3_YlyBW2m3bL73_YlyBN1JxwY5GKd_PV20N7q3d_6_DW1LYLPh5Hbg6YN66bBJs1yqQw1&amp;v=2&amp;email=example@example.com" style="mso-line-height-rule:exactly; font-family:Helvetica,Arial,sans-serif; font-size:12px; color:#00a4bd; font-weight:normal; text-decoration:underline; font-style:normal" data-hs-link-id="0" target="_blank">Manage preferences</a>
									  
									</p>
									
								</td>
							</tr>
						</tbody>
					</table></div></td></tr></tbody></table>
					</div>
					<!--[if gte mso 9]></table><![endif]-->
					<!--[if (mso)|(IE)]></td><![endif]-->
					
					
						<!--[if (mso)|(IE)]></tr></table><![endif]-->
					
						</div>
					   
					  </div>
					</div>
							  </td>
							</tr>
						  </tbody></table>
						</div>
					  
					<script data-cfasync="false" src="/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js"></script></body></html>`
					}
				]
			};
			break;

		case 2:
			body = {
				personalizations: [
					{
						to: [
							{
								email: to
							}
						],
						subject: "Coin Aska : Daily Report"
					}
				],
				from: {
					email: process.env.FROM_EMAIL
				},
				content: [
					{
						type: 'text/html',
						value: `<!DOCTYPE html>
						<html>
						<body>
						<tbody>
						<tr>
							<td style="padding:0">
								Hello!
							</td>
						</tr>
						<tr>
							<td style="padding:30;">
							JSON.parse(${param1})
							</td>
						</tr>
						</tbody>
						</body>
						</html>`
					}
				]
			};
			break;
		case 3:
			body = {
				personalizations: [
					{
						to: [
							{
								email: to
							}
						],
						subject: "Coin Aska : OTP for transaction"
					}
				],
				from: {
					email: process.env.FROM_EMAIL
				},
				content: [
					{
						type: 'text/html',
						value: `
						<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml" lang="en"><head>
							<title></title>
							<meta property="og:title" content="">
							<meta name="twitter:title" content="">
							
							
							
						<meta name="x-apple-disable-message-reformatting">
						<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
						
						<meta http-equiv="X-UA-Compatible" content="IE=edge">
						
						<meta name="viewport" content="width=device-width, initial-scale=1.0">
						
						
							<!--[if gte mso 9]>
						  <xml>
							  <o:OfficeDocumentSettings>
							  <o:AllowPNG/>
							  <o:PixelsPerInch>96</o:PixelsPerInch>
							  </o:OfficeDocumentSettings>
						  </xml>
						  
						  <style>
							ul > li {
							  text-indent: -1em;
							}
						  </style>
						<![endif]-->
						<!--[if mso]>
						<style type="text/css">
						 body, td {font-family: Arial, Helvetica, sans-serif;}
						</style>
						<![endif]-->
						
						
							
						
						
						
						
						
						
							  
						
						
						
						
						
						
						
						
						
						
						
						
						
							
						
						
						  <base href="https://20659291.hubspotpreview-na1.com" target="_blank"><meta name="generator" content="HubSpot"><meta property="og:url" content="http://20659291.hs-sites.com/-temporary-slug-f003f919-41a6-4568-9902-7ff71029fb05?hs_preview=tvKXmKjE-80785143301"><meta name="robots" content="noindex,follow"><!--[if !((mso)|(IE))]><!-- --><style type="text/css">.moz-text-html .hse-column-container{max-width:600px !important;width:600px !important}
						.moz-text-html .hse-column{display:table-cell;vertical-align:top}.moz-text-html .hse-section .hse-size-12{max-width:600px !important;width:600px !important}
						[owa] .hse-column-container{max-width:600px !important;width:600px !important}[owa] .hse-column{display:table-cell;vertical-align:top}
						[owa] .hse-section .hse-size-12{max-width:600px !important;width:600px !important}
						@media only screen and (min-width:640px){.hse-column-container{max-width:600px !important;width:600px !important}
						.hse-column{display:table-cell;vertical-align:top}.hse-section .hse-size-12{max-width:600px !important;width:600px !important}
						}@media only screen and (max-width:639px){img.stretch-on-mobile,.hs_rss_email_entries_table img,.hs-stretch-cta .hs-cta-img{height:auto !important;width:100% !important}
						.display_block_on_small_screens{display:block}.hs_padded{padding-left:20px !important;padding-right:20px !important}
						}</style><!--<![endif]--><style type="text/css">body[data-outlook-cycle] img.stretch-on-mobile,body[data-outlook-cycle] .hs_rss_email_entries_table img{height:auto !important;width:100% !important}
						body[data-outlook-cycle] .hs_padded{padding-left:20px !important;padding-right:20px !important}
						a[x-apple-data-detectors]{color:inherit !important;text-decoration:none !important;font-size:inherit !important;font-family:inherit !important;font-weight:inherit !important;line-height:inherit !important}
						#outlook a{padding:0}.yshortcuts a{border-bottom:none !important}a{text-decoration:underline}
						.ExternalClass{width:100%}.ExternalClass,.ExternalClass p,.ExternalClass td,.ExternalClass div,.ExternalClass span,.ExternalClass font{line-height:100%}
						p{margin:0}body{-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;-webkit-font-smoothing:antialiased;moz-osx-font-smoothing:grayscale}
						@media only screen and (max-width:639px){img.stretch-on-mobile,.hs_rss_email_entries_table img,.hs-stretch-cta .hs-cta-img{height:auto !important;width:100% !important}
						}@media only screen and (max-width:639px){img.stretch-on-mobile,.hs_rss_email_entries_table img,.hs-stretch-cta .hs-cta-img{height:auto !important;width:100% !important}
						}</style></head>
						  <body bgcolor="#FFFFFF" style="margin:0 !important; padding:0 !important; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word">
							
						
						
						
						
						
							
						<!--[if gte mso 9]>
						<v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
						  
							<v:fill type="tile" size="100%,100%" color="#FFFFFF"/>
						  
						</v:background>
						<![endif]-->
						
						
							<div class="hse-body-background" style="background-color:#ffffff" bgcolor="#ffffff">
							  <table role="presentation" class="hse-body-wrapper-table" cellpadding="0" cellspacing="0" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; margin:0; padding:0; width:100% !important; min-width:320px !important; height:100% !important" width="100%" height="100%">
								<tbody><tr>
								  <td class="hse-body-wrapper-td" valign="top" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word">
									<div id="hs_cos_wrapper_main" class="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_dnd_area" style="color: inherit; font-size: inherit; line-height: inherit;" data-hs-cos-general-type="widget" data-hs-cos-type="dnd_area">  <div id="section_1659355577058" class="hse-section hse-section-first" style="padding-left:10px; padding-right:10px; padding-top:20px">
						
							
							
							<!--[if !((mso)|(IE))]><!-- -->
							  <div class="hse-column-container" style="min-width:280px; max-width:600px; width:100%; Margin-left:auto; Margin-right:auto; border-collapse:collapse; border-spacing:0; background-color:#FFFFFF" bgcolor="#FFFFFF">
							<!--<![endif]-->
							
							<!--[if (mso)|(IE)]>
							  <div class="hse-column-container" style="min-width:280px;max-width:600px;width:100%;Margin-left:auto;Margin-right:auto;border-collapse:collapse;border-spacing:0;">
							  <table align="center" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;width:600px;" cellpadding="0" cellspacing="0" role="presentation" width="600" bgcolor="#FFFFFF">
							  <tr style="background-color:#FFFFFF;">
							<![endif]-->
						
							<!--[if (mso)|(IE)]>
						  <td valign="top" style="width:600px;">
						<![endif]-->
						<!--[if gte mso 9]>
						  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;width:600px">
						<![endif]-->
						<div id="column_1659355577058_0" class="hse-column hse-size-12">
						  <div id="hs_cos_wrapper_module_16593555647132" class="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_module" style="color: inherit; font-size: inherit; line-height: inherit;" data-hs-cos-general-type="widget" data-hs-cos-type="module"><!-- image_email.module - email-default-modules -->
						
						
						
						
						
						
							
						
						
						<table class="hse-image-wrapper" role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt">
							<tbody>
								<tr>
									<td align="center" valign="top" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; color:#23496d; word-break:break-word; text-align:center; padding:10px 20px; font-size:0px">
										
										<img alt="Coin Aska 02" src="https://20659291.fs1.hubspotusercontent-na1.net/hub/20659291/hubfs/Coin Aska%2002.png?width=400&amp;upscale=true&amp;name=Coin Aska%2002.png" style="outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; max-width:100%; font-size:16px" width="200" align="middle">
										
									</td>
								</tr>
							</tbody>
						</table></div>
						</div>
						<!--[if gte mso 9]></table><![endif]-->
						<!--[if (mso)|(IE)]></td><![endif]-->
						
						
							<!--[if (mso)|(IE)]></tr></table><![endif]-->
						
							</div>
						   
						  </div>
						
						  <div id="section-0" class="hse-section" style="padding-left:10px; padding-right:10px">
						
							
							
							<!--[if !((mso)|(IE))]><!-- -->
							  <div class="hse-column-container" style="min-width:280px; max-width:600px; width:100%; Margin-left:auto; Margin-right:auto; border-collapse:collapse; border-spacing:0; background-color:#FFFFFF; padding-bottom:40px; padding-top:40px" bgcolor="#FFFFFF">
							<!--<![endif]-->
							
							<!--[if (mso)|(IE)]>
							  <div class="hse-column-container" style="min-width:280px;max-width:600px;width:100%;Margin-left:auto;Margin-right:auto;border-collapse:collapse;border-spacing:0;">
							  <table align="center" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;width:600px;" cellpadding="0" cellspacing="0" role="presentation" width="600" bgcolor="#FFFFFF">
							  <tr style="background-color:#FFFFFF;">
							<![endif]-->
						
							<!--[if (mso)|(IE)]>
						  <td valign="top" style="width:600px;padding-bottom:40px; padding-top:40px;">
						<![endif]-->
						<!--[if gte mso 9]>
						  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;width:600px">
						<![endif]-->
						<div id="column-0-0" class="hse-column hse-size-12">
						  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt"><tbody><tr><td class="hs_padded" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; padding:10px 20px"><div id="hs_cos_wrapper_module-0-0-0" class="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_module" style="color: inherit; font-size: inherit; line-height: inherit;" data-hs-cos-general-type="widget" data-hs-cos-type="module"><div id="hs_cos_wrapper_module-0-0-0_" class="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_rich_text" style="color: inherit; font-size: inherit; line-height: inherit;" data-hs-cos-general-type="widget" data-hs-cos-type="rich_text"><p style="mso-line-height-rule:exactly; line-height:175%">Dear User,</p>
						<p style="mso-line-height-rule:exactly; line-height:175%; text-align:left" align="left">Please use the following OTP to confirm the withdrawal request:</p>
						<p style="mso-line-height-rule:exactly; line-height:175%; text-align:left" align="left">&nbsp;</p>
						<p style="mso-line-height-rule:exactly; text-align:center; font-size:24px; line-height:175%" align="center">${param1}</p>
						<p style="mso-line-height-rule:exactly; text-align:center; font-size:24px; line-height:175%" align="center">&nbsp;</p>
						<p style="mso-line-height-rule:exactly; line-height:175%">Your one-time password is confidential. Please do not share the OTP with anyone.</p>
						<p style="mso-line-height-rule:exactly; line-height:175%">&nbsp;</p>
						<p style="mso-line-height-rule:exactly; line-height:175%">Regards,<br>Team Coin Aska</p></div></div></td></tr></tbody></table>
						</div>
						<!--[if gte mso 9]></table><![endif]-->
						<!--[if (mso)|(IE)]></td><![endif]-->
						
						
							<!--[if (mso)|(IE)]></tr></table><![endif]-->
						
							</div>
						   
						  </div>
						
						  <div id="section-1" class="hse-section hse-section-last" style="padding-left:10px; padding-right:10px; padding-bottom:20px">
						
							
							
							<!--[if !((mso)|(IE))]><!-- -->
							  <div class="hse-column-container" style="min-width:280px; max-width:600px; width:100%; Margin-left:auto; Margin-right:auto; border-collapse:collapse; border-spacing:0">
							<!--<![endif]-->
							
							<!--[if (mso)|(IE)]>
							  <div class="hse-column-container" style="min-width:280px;max-width:600px;width:100%;Margin-left:auto;Margin-right:auto;border-collapse:collapse;border-spacing:0;">
							  <table align="center" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;width:600px;" cellpadding="0" cellspacing="0" role="presentation">
							  <tr>
							<![endif]-->
						
							<!--[if (mso)|(IE)]>
						  <td valign="top" style="width:600px;">
						<![endif]-->
						<!--[if gte mso 9]>
						  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;width:600px">
						<![endif]-->
						<div id="column-1-0" class="hse-column hse-size-12">
						  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt"><tbody><tr><td class="hs_padded" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; padding:10px 20px"><div id="hs_cos_wrapper_module_16593546719471" class="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_module" style="color: inherit; font-size: inherit; line-height: inherit;" data-hs-cos-general-type="widget" data-hs-cos-type="module"><!-- follow_me_email.module - email-default-modules -->
						
						
						
						<table role="presentation" align="center" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; width:auto; text-align:center" class="hs_cos_wrapper_type_social_module" width="auto">
						  <tbody>
							<tr align="center">
							  
							  <td style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word">
								<table role="presentation" align="center" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; width:auto; text-align:center" class="hs_cos_wrapper_type_social_module_single" width="auto">
								  <tbody>
									<tr align="center">
									  
									  <td class="display_block_on_small_screens" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; padding:8px 5px; line-height:1; vertical-align:middle" valign="middle">
										<a href="https://instagram.com/Coin Aska.ai?igshid=NWRhNmQxMjQ=" style="color:#00a4bd; mso-line-height-rule:exactly; text-decoration:none !important" data-hs-link-id="0" target="_blank">
										  
										  
										  <img src="https://hs-20659291.f.hubspotstarter.net/hs/hsstatic/TemplateAssets/static-1.108/img/hs_default_template_images/modules/Follow+Me+-+Email/instagram_circle_color.png" alt="Instagram" height="25" style="outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; border:none; width:auto!important; height:25px!important; vertical-align:middle" valign="middle" width="auto">
										  
										</a>
									  </td>
									  
									  
								  </tr>
								</tbody>
							  </table>
								  </td>
							  
							  <td style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word">
								<table role="presentation" align="center" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; width:auto; text-align:center" class="hs_cos_wrapper_type_social_module_single" width="auto">
								  <tbody>
									<tr align="center">
									  
									  <td class="display_block_on_small_screens" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; padding:8px 5px; line-height:1; vertical-align:middle" valign="middle">
										<a href="https://www.linkedin.com/company/Coin Askaai/" style="color:#00a4bd; mso-line-height-rule:exactly; text-decoration:none !important" data-hs-link-id="0" target="_blank">
										  
										  
										  <img src="https://hs-20659291.f.hubspotstarter.net/hs/hsstatic/TemplateAssets/static-1.108/img/hs_default_template_images/modules/Follow+Me+-+Email/linkedin_circle_color.png" alt="LinkedIn" height="25" style="outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; border:none; width:auto!important; height:25px!important; vertical-align:middle" valign="middle" width="auto">
										  
										</a>
									  </td>
									  
									  
								  </tr>
								</tbody>
							  </table>
								  </td>
							  
							  <td style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word">
								<table role="presentation" align="center" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; width:auto; text-align:center" class="hs_cos_wrapper_type_social_module_single" width="auto">
								  <tbody>
									<tr align="center">
									  
									  <td class="display_block_on_small_screens" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; padding:8px 5px; line-height:1; vertical-align:middle" valign="middle">
										<a href="https://twitter.com/Coin Askaai?s=21&amp;t=ryYxPbtEGZ9HjkoHsXJIgQ" style="color:#00a4bd; mso-line-height-rule:exactly; text-decoration:none !important" data-hs-link-id="0" target="_blank">
										  
										  
										  <img src="https://hs-20659291.f.hubspotstarter.net/hs/hsstatic/TemplateAssets/static-1.108/img/hs_default_template_images/modules/Follow+Me+-+Email/twitter_circle_color.png" alt="Twitter" height="25" style="outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; border:none; width:auto!important; height:25px!important; vertical-align:middle" valign="middle" width="auto">
										  
										</a>
									  </td>
									  
									  
								  </tr>
								</tbody>
							  </table>
								  </td>
							  
							  <td style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word">
								<table role="presentation" align="center" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; width:auto; text-align:center" class="hs_cos_wrapper_type_social_module_single" width="auto">
								  <tbody>
									<tr align="center">
									  
									  <td class="display_block_on_small_screens" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; padding:8px 5px; line-height:1; vertical-align:middle" valign="middle">
										<a href="https://www.facebook.com/Coin Askaai/" style="color:#00a4bd; mso-line-height-rule:exactly; text-decoration:none !important" data-hs-link-id="0" target="_blank">
										  
										  
										  <img src="https://hs-20659291.f.hubspotstarter.net/hs/hsstatic/TemplateAssets/static-1.108/img/hs_default_template_images/modules/Follow+Me+-+Email/facebook_circle_color.png" alt="Facebook" height="25" style="outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; border:none; width:auto!important; height:25px!important; vertical-align:middle" valign="middle" width="auto">
										  
										</a>
									  </td>
									  
									  
								  </tr>
								</tbody>
							  </table>
								  </td>
							  
							</tr>
						  </tbody>
						</table></div></td></tr></tbody></table>
						<div id="hs_cos_wrapper_module_16593552032111" class="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_module" style="color: inherit; font-size: inherit; line-height: inherit;" data-hs-cos-general-type="widget" data-hs-cos-type="module"><!-- image_email.module - email-default-modules -->
						
						
						
						
						
						
							
						
						
						<table class="hse-image-wrapper" role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt">
							<tbody>
								<tr>
									<td align="center" valign="top" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; color:#23496d; word-break:break-word; text-align:center; padding:10px 20px; font-size:0px">
										
										<img alt="crypto mutual fund" src="https://20659291.fs1.hubspotusercontent-na1.net/hub/20659291/hubfs/crypto%20mutual%20fund.png?width=700&amp;upscale=true&amp;name=crypto%20mutual%20fund.png" style="outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; max-width:100%; font-size:16px" width="350" align="middle">
										
									</td>
								</tr>
							</tbody>
						</table></div>
						<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt"><tbody><tr><td class="hs_padded" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; padding:10px 20px"><div id="hs_cos_wrapper_module-1-0-0" class="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_module" style="color: inherit; font-size: inherit; line-height: inherit;" data-hs-cos-general-type="widget" data-hs-cos-type="module"><!-- email_footer.module - email-default-modules -->
						
						
						
						
						
						
						
						
						
						
						  
						
						
						
						  
						  
						  
						  
						  
						  
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						<table role="presentation" class="hse-footer hse-secondary" width="100%" cellpadding="0" cellspacing="0" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; font-family:Arial, sans-serif; font-size:12px; line-height:135%; color:#23496d; margin-bottom:0; padding:0">
							<tbody>
								<tr>
									<td align="center" valign="top" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; text-align:center; margin-bottom:0; line-height:135%; padding:10px 20px">
										
										<p style="mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:12px; font-weight:normal; text-decoration:none; font-style:normal; color:#23496d; direction:lrt" dir="lrt">
										  Bhim Digital, Inc, 309 PAWTUCKET BLVD, Lowell, MA 01854, United States
										</p>
										<p style="mso-line-height-rule:exactly">
										  
										  <a data-unsubscribe="true" href="https://hs-20659291.s.hubspotstarter.net/email-unsubscribe/email?product=emailStarter&amp;checkSubscriptions=all&amp;d=VmYj8c957LGxVKgD3Q3_YlyBW2m3bL73_YlyBN1JxwY5GKd_PV20N7q3d_6_DW1LYLPh5Hbg6YN66bBJs1yqQw1&amp;v=2&amp;email=example@example.com" style="mso-line-height-rule:exactly; font-family:Helvetica,Arial,sans-serif; font-size:12px; color:#00a4bd; font-weight:normal; text-decoration:underline; font-style:normal" data-hs-link-id="0" target="_blank">Unsubscribe</a>
										  
										  <a data-unsubscribe="true" href="https://hs-20659291.s.hubspotstarter.net/email-unsubscribe/email?product=emailStarter&amp;d=VmYj8c957LGxVKgD3Q3_YlyBW2m3bL73_YlyBN1JxwY5GKd_PV20N7q3d_6_DW1LYLPh5Hbg6YN66bBJs1yqQw1&amp;v=2&amp;email=example@example.com" style="mso-line-height-rule:exactly; font-family:Helvetica,Arial,sans-serif; font-size:12px; color:#00a4bd; font-weight:normal; text-decoration:underline; font-style:normal" data-hs-link-id="0" target="_blank">Manage preferences</a>
										  
										</p>
										
									</td>
								</tr>
							</tbody>
						</table></div></td></tr></tbody></table>
						</div>
						<!--[if gte mso 9]></table><![endif]-->
						<!--[if (mso)|(IE)]></td><![endif]-->
						
						
							<!--[if (mso)|(IE)]></tr></table><![endif]-->
						
							</div>
						   
						  </div>
						</div>
								  </td>
								</tr>
							  </tbody></table>
							</div>
						  
						</body></html>`
					}
				]
			};
			break;
			case 4:
				body = {
					personalizations: [
						{
							to: [
								{
									email: to
								}
							],
							subject: "Coin Aska : Funds added| Transaction in your Coin Aska wallet"
						}
					],
					from: {
						email: process.env.FROM_EMAIL
					},
					content: [
						{
							type: 'text/html',
							value: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
							<html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml" lang="en">
							   <head>
								  <title></title>
								  <meta property="og:title" content="">
								  <meta name="twitter:title" content="">
								  <meta name="x-apple-disable-message-reformatting">
								  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
								  <meta http-equiv="X-UA-Compatible" content="IE=edge">
								  <meta name="viewport" content="width=device-width, initial-scale=1.0">
								  <!--[if gte mso 9]>
								  <xml>
									 <o:OfficeDocumentSettings>
										<o:AllowPNG/>
										<o:PixelsPerInch>96</o:PixelsPerInch>
									 </o:OfficeDocumentSettings>
								  </xml>
								  <style>
									 ul > li {
									 text-indent: -1em;
									 }
								  </style>
								  <![endif]-->
								  <!--[if mso]>
								  <style type="text/css">
									 body, td {font-family: Arial, Helvetica, sans-serif;}
								  </style>
								  <![endif]-->
								  <base href="https://20659291.hubspotpreview-na1.com" target="_blank">
								  <meta name="generator" content="HubSpot">
								  <meta property="og:url" content="http://20659291.hs-sites.com/-temporary-slug-b753d8ec-ddea-49bd-8aba-bf0c9115bb8b?hs_preview=BsKuZlRg-80719351967">
								  <meta name="robots" content="noindex,follow">
								  <!--[if !((mso)|(IE))]><!-- -->
								  <style type="text/css">.moz-text-html .hse-column-container{max-width:600px !important;width:600px !important}
									 .moz-text-html .hse-column{display:table-cell;vertical-align:top}.moz-text-html .hse-section .hse-size-12{max-width:600px !important;width:600px !important}
									 [owa] .hse-column-container{max-width:600px !important;width:600px !important}[owa] .hse-column{display:table-cell;vertical-align:top}
									 [owa] .hse-section .hse-size-12{max-width:600px !important;width:600px !important}
									 @media only screen and (min-width:640px){.hse-column-container{max-width:600px !important;width:600px !important}
									 .hse-column{display:table-cell;vertical-align:top}.hse-section .hse-size-12{max-width:600px !important;width:600px !important}
									 }@media only screen and (max-width:639px){img.stretch-on-mobile,.hs_rss_email_entries_table img,.hs-stretch-cta .hs-cta-img{height:auto !important;width:100% !important}
									 .display_block_on_small_screens{display:block}.hs_padded{padding-left:20px !important;padding-right:20px !important}
									 }@media screen and (max-width:639px){.social-network-cell{display:inline-block}}
								  </style>
								  <!--<![endif]-->
								  <style type="text/css">body[data-outlook-cycle] img.stretch-on-mobile,body[data-outlook-cycle] .hs_rss_email_entries_table img{height:auto !important;width:100% !important}
									 body[data-outlook-cycle] .hs_padded{padding-left:20px !important;padding-right:20px !important}
									 a[x-apple-data-detectors]{color:inherit !important;text-decoration:none !important;font-size:inherit !important;font-family:inherit !important;font-weight:inherit !important;line-height:inherit !important}
									 #outlook a{padding:0}.yshortcuts a{border-bottom:none !important}a{text-decoration:underline}
									 .ExternalClass{width:100%}.ExternalClass,.ExternalClass p,.ExternalClass td,.ExternalClass div,.ExternalClass span,.ExternalClass font{line-height:100%}
									 p{margin:0}body{-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;-webkit-font-smoothing:antialiased;moz-osx-font-smoothing:grayscale}
									 @media only screen and (max-width:639px){img.stretch-on-mobile,.hs_rss_email_entries_table img,.hs-stretch-cta .hs-cta-img{height:auto !important;width:100% !important}
									 }@media only screen and (max-width:639px){img.stretch-on-mobile,.hs_rss_email_entries_table img,.hs-stretch-cta .hs-cta-img{height:auto !important;width:100% !important}
									 }
								  </style>
							   </head>
							   <body bgcolor="#FFFFFF" style="margin:0 !important; padding:0 !important; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word">
								  <!--[if gte mso 9]>
								  <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
									 <v:fill type="tile" size="100%,100%" color="#FFFFFF"/>
								  </v:background>
								  <![endif]-->
								  <div class="hse-body-background" style="background-color:#ffffff" bgcolor="#ffffff">
								  <table role="presentation" class="hse-body-wrapper-table" cellpadding="0" cellspacing="0" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; margin:0; padding:0; width:100% !important; min-width:320px !important; height:100% !important" width="100%" height="100%">
									 <tbody>
										<tr>
										   <td class="hse-body-wrapper-td" valign="top" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word">
											  <div id="hs_cos_wrapper_main" class="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_dnd_area" style="color: inherit; font-size: inherit; line-height: inherit;" data-hs-cos-general-type="widget" data-hs-cos-type="dnd_area">
											  <div id="section_1659355577058" class="hse-section hse-section-first" style="padding-left:10px; padding-right:10px; padding-top:20px">
											  <!--[if !((mso)|(IE))]><!-- -->
											  <div class="hse-column-container" style="min-width:280px; max-width:600px; width:100%; Margin-left:auto; Margin-right:auto; border-collapse:collapse; border-spacing:0; background-color:#FFFFFF" bgcolor="#FFFFFF">
												 <!--<![endif]-->
												 <!--[if (mso)|(IE)]>
												 <div class="hse-column-container" style="min-width:280px;max-width:600px;width:100%;Margin-left:auto;Margin-right:auto;border-collapse:collapse;border-spacing:0;">
													<table align="center" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;width:600px;" cellpadding="0" cellspacing="0" role="presentation" width="600" bgcolor="#FFFFFF">
													   <tr style="background-color:#FFFFFF;">
														  <![endif]-->
														  <!--[if (mso)|(IE)]>
														  <td valign="top" style="width:600px;">
															 <![endif]-->
															 <!--[if gte mso 9]>
															 <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;width:600px">
																<![endif]-->
																<div id="column_1659355577058_0" class="hse-column hse-size-12">
																   <div id="hs_cos_wrapper_module_16593555647132" class="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_module" style="color: inherit; font-size: inherit; line-height: inherit;" data-hs-cos-general-type="widget" data-hs-cos-type="module">
																	  <!-- image_email.module - email-default-modules -->
																	  <table class="hse-image-wrapper" role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt">
																		 <tbody>
																			<tr>
																			   <td align="center" valign="top" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; color:#23496d; word-break:break-word; text-align:center; padding:10px 20px; font-size:0px">
																				  <img alt="Coin Aska 02" src="https://20659291.fs1.hubspotusercontent-na1.net/hub/20659291/hubfs/Coin Aska%2002.png?width=400&amp;upscale=true&amp;name=Coin Aska%2002.png" style="outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; max-width:100%; font-size:16px" width="200" align="middle">
																			   </td>
																			</tr>
																		 </tbody>
																	  </table>
																   </div>
																</div>
																<!--[if gte mso 9]>
															 </table>
															 <![endif]-->
															 <!--[if (mso)|(IE)]>
														  </td>
														  <![endif]-->
														  <!--[if (mso)|(IE)]>
													   </tr>
													</table>
													<![endif]-->
												 </div>
											  </div>
											  <div id="section-0" class="hse-section" style="padding-left:10px; padding-right:10px">
												 <!--[if !((mso)|(IE))]><!-- -->
												 <div class="hse-column-container" style="min-width:280px; max-width:600px; width:100%; Margin-left:auto; Margin-right:auto; border-collapse:collapse; border-spacing:0; background-color:#FFFFFF; padding-bottom:40px; padding-top:40px" bgcolor="#FFFFFF">
													<!--<![endif]-->
													<!--[if (mso)|(IE)]>
													<div class="hse-column-container" style="min-width:280px;max-width:600px;width:100%;Margin-left:auto;Margin-right:auto;border-collapse:collapse;border-spacing:0;">
													   <table align="center" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;width:600px;" cellpadding="0" cellspacing="0" role="presentation" width="600" bgcolor="#FFFFFF">
														  <tr style="background-color:#FFFFFF;">
															 <![endif]-->
															 <!--[if (mso)|(IE)]>
															 <td valign="top" style="width:600px;padding-bottom:40px; padding-top:40px;">
																<![endif]-->
																<!--[if gte mso 9]>
																<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;width:600px">
																   <![endif]-->
																   <div id="column-0-0" class="hse-column hse-size-12">
																	  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt">
																		 <tbody>
																			<tr>
																			   <td class="hs_padded" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; padding:10px 20px">
																				  <div id="hs_cos_wrapper_module-0-0-0" class="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_module" style="color: inherit; font-size: inherit; line-height: inherit;" data-hs-cos-general-type="widget" data-hs-cos-type="module">
																					 <div id="hs_cos_wrapper_module-0-0-0_" class="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_rich_text" style="color: inherit; font-size: inherit; line-height: inherit;" data-hs-cos-general-type="widget" data-hs-cos-type="rich_text">
																						<p style="mso-line-height-rule:exactly; line-height:175%">Hi ${param1},</p>
																						<p style="mso-line-height-rule:exactly; line-height:175%">&nbsp;</p>
																						<p style="mso-line-height-rule:exactly; line-height:175%">A deposit of the amount of ${param2} has been received in your Coin Aska wallet. The amount will be duly invested in the next Thursday. Open the in-app wallet to view the detail of the transaction.</p>
																						<p style="mso-line-height-rule:exactly; line-height:175%">&nbsp;</p>
																						<p style="mso-line-height-rule:exactly; line-height:175%">Wherever you are in your crypto journey, we’re glad you are with us. Looking forward to long-term wealth creation, together!</p>
																						<p style="mso-line-height-rule:exactly; line-height:175%">&nbsp;</p>
																						<p style="mso-line-height-rule:exactly; line-height:175%">Regards,<br>Team Coin Aska</p>
																					 </div>
																				  </div>
																			   </td>
																			</tr>
																		 </tbody>
																	  </table>
																   </div>
																   <!--[if gte mso 9]>
																</table>
																<![endif]-->
																<!--[if (mso)|(IE)]>
															 </td>
															 <![endif]-->
															 <!--[if (mso)|(IE)]>
														  </tr>
													   </table>
													   <![endif]-->
													</div>
												 </div>
												 <div id="section-1" class="hse-section hse-section-last" style="padding-left:10px; padding-right:10px; padding-bottom:20px">
													<!--[if !((mso)|(IE))]><!-- -->
													<div class="hse-column-container" style="min-width:280px; max-width:600px; width:100%; Margin-left:auto; Margin-right:auto; border-collapse:collapse; border-spacing:0">
													   <!--<![endif]-->
													   <!--[if (mso)|(IE)]>
													   <div class="hse-column-container" style="min-width:280px;max-width:600px;width:100%;Margin-left:auto;Margin-right:auto;border-collapse:collapse;border-spacing:0;">
														  <table align="center" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;width:600px;" cellpadding="0" cellspacing="0" role="presentation">
															 <tr>
																<![endif]-->
																<!--[if (mso)|(IE)]>
																<td valign="top" style="width:600px;">
																   <![endif]-->
																   <!--[if gte mso 9]>
																   <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;width:600px">
																	  <![endif]-->
																	  <div id="column-1-0" class="hse-column hse-size-12">
																		 <div id="hs_cos_wrapper_module_16593552032111" class="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_module" style="color: inherit; font-size: inherit; line-height: inherit;" data-hs-cos-general-type="widget" data-hs-cos-type="module">
																			<!-- image_email.module - email-default-modules -->
																			<table class="hse-image-wrapper" role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt">
																			   <tbody>
																				  <tr>
																					 <td align="center" valign="top" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; color:#23496d; word-break:break-word; text-align:center; padding:10px 20px; font-size:0px">
																						<img alt="Coin Aska Logo_png" src="https://20659291.fs1.hubspotusercontent-na1.net/hub/20659291/hubfs/Coin Aska%20Logo_png.png?width=1120&amp;upscale=true&amp;name=Coin Aska%20Logo_png.png" style="outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; max-width:100%; font-size:16px" width="560" align="middle">
																					 </td>
																				  </tr>
																			   </tbody>
																			</table>
																		 </div>
																		 <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt">
																			<tbody>
																			   <tr>
																				  <td class="hs_padded" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; padding:10px 20px">
																					 <div id="hs_cos_wrapper_module_16593546719471" class="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_module" style="color: inherit; font-size: inherit; line-height: inherit;" data-hs-cos-general-type="widget" data-hs-cos-type="module">
																						<!-- follow_me_email.module - email-default-modules -->
																						<table role="presentation" align="center" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; width:auto; text-align:center" class="hs_cos_wrapper_type_social_module" width="auto">
																						   <tbody>
																							  <tr align="center">
																								 <td class="social-network-cell" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word">
																									<table role="presentation" align="center" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; width:auto; text-align:center" class="hs_cos_wrapper_type_social_module_single" width="auto">
																									   <tbody>
																										  <tr align="center">
																											 <td class="display_block_on_small_screens" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; padding:8px 5px; line-height:1; vertical-align:middle" valign="middle">
																												<a href="https://instagram.com/Coin Aska.ai?igshid=NWRhNmQxMjQ=" style="color:#00a4bd; mso-line-height-rule:exactly; text-decoration:none !important" data-hs-link-id="0" target="_blank">
																												<img src="https://hs-20659291.f.hubspotstarter.net/hs/hsstatic/TemplateAssets/static-1.114/img/hs_default_template_images/modules/Follow+Me+-+Email/instagram_circle_color.png" alt="Instagram" height="25" style="outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; border:none; width:auto!important; height:25px!important; vertical-align:middle" valign="middle" width="auto">
																												</a>
																											 </td>
																										  </tr>
																									   </tbody>
																									</table>
																								 </td>
																								 <td class="social-network-cell" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word">
																									<table role="presentation" align="center" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; width:auto; text-align:center" class="hs_cos_wrapper_type_social_module_single" width="auto">
																									   <tbody>
																										  <tr align="center">
																											 <td class="display_block_on_small_screens" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; padding:8px 5px; line-height:1; vertical-align:middle" valign="middle">
																												<a href="https://www.linkedin.com/company/Coin Askaai/" style="color:#00a4bd; mso-line-height-rule:exactly; text-decoration:none !important" data-hs-link-id="0" target="_blank">
																												<img src="https://hs-20659291.f.hubspotstarter.net/hs/hsstatic/TemplateAssets/static-1.114/img/hs_default_template_images/modules/Follow+Me+-+Email/linkedin_circle_color.png" alt="LinkedIn" height="25" style="outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; border:none; width:auto!important; height:25px!important; vertical-align:middle" valign="middle" width="auto">
																												</a>
																											 </td>
																										  </tr>
																									   </tbody>
																									</table>
																								 </td>
																								 <td class="social-network-cell" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word">
																									<table role="presentation" align="center" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; width:auto; text-align:center" class="hs_cos_wrapper_type_social_module_single" width="auto">
																									   <tbody>
																										  <tr align="center">
																											 <td class="display_block_on_small_screens" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; padding:8px 5px; line-height:1; vertical-align:middle" valign="middle">
																												<a href="https://twitter.com/Coin Askaai?s=21&amp;t=ryYxPbtEGZ9HjkoHsXJIgQ" style="color:#00a4bd; mso-line-height-rule:exactly; text-decoration:none !important" data-hs-link-id="0" target="_blank">
																												<img src="https://hs-20659291.f.hubspotstarter.net/hs/hsstatic/TemplateAssets/static-1.114/img/hs_default_template_images/modules/Follow+Me+-+Email/twitter_circle_color.png" alt="Twitter" height="25" style="outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; border:none; width:auto!important; height:25px!important; vertical-align:middle" valign="middle" width="auto">
																												</a>
																											 </td>
																										  </tr>
																									   </tbody>
																									</table>
																								 </td>
																								 <td class="social-network-cell" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word">
																									<table role="presentation" align="center" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; width:auto; text-align:center" class="hs_cos_wrapper_type_social_module_single" width="auto">
																									   <tbody>
																										  <tr align="center">
																											 <td class="display_block_on_small_screens" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; padding:8px 5px; line-height:1; vertical-align:middle" valign="middle">
																												<a href="https://www.facebook.com/Coin Askaai/" style="color:#00a4bd; mso-line-height-rule:exactly; text-decoration:none !important" data-hs-link-id="0" target="_blank">
																												<img src="https://hs-20659291.f.hubspotstarter.net/hs/hsstatic/TemplateAssets/static-1.114/img/hs_default_template_images/modules/Follow+Me+-+Email/facebook_circle_color.png" alt="Facebook" height="25" style="outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; border:none; width:auto!important; height:25px!important; vertical-align:middle" valign="middle" width="auto">
																												</a>
																											 </td>
																										  </tr>
																									   </tbody>
																									</table>
																								 </td>
																							  </tr>
																						   </tbody>
																						</table>
																					 </div>
																				  </td>
																			   </tr>
																			</tbody>
																		 </table>
																		 <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt">
																			<tbody>
																			   <tr>
																				  <td class="hs_padded" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; padding:10px 20px">
																					 <div id="hs_cos_wrapper_module-1-0-0" class="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_module" style="color: inherit; font-size: inherit; line-height: inherit;" data-hs-cos-general-type="widget" data-hs-cos-type="module">
																						<!-- email_footer.module - email-default-modules -->
																						<table role="presentation" class="hse-footer hse-secondary" width="100%" cellpadding="0" cellspacing="0" style="border-spacing:0 !important; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; font-family:Arial, sans-serif; font-size:12px; line-height:135%; color:#23496d; margin-bottom:0; padding:0">
																						   <tbody>
																							  <tr>
																								 <td align="center" valign="top" style="border-collapse:collapse; mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:15px; color:#23496d; word-break:break-word; text-align:center; margin-bottom:0; line-height:135%; padding:10px 20px">
																									<p style="mso-line-height-rule:exactly; font-family:Arial, sans-serif; font-size:12px; font-weight:normal; text-decoration:none; font-style:normal; color:#23496d; direction:lrt" dir="lrt">
																									   Bhim Digital, Inc, 309 Pawtucket Blvd, Lowell, MA 01854, United States
																									</p>
																									<p style="mso-line-height-rule:exactly">
																									   <a data-unsubscribe="true" href="https://hs-20659291.s.hubspotstarter.net/email-unsubscribe/email?product=emailStarter&amp;checkSubscriptions=all&amp;d=VmYj8c957LGxVKgD3Q3_YlyBW2m3bL73_YlyBN1JxwY5GKd_PV20N7q3d_6_DW1LYLPh5Hbg6YN66bBJs1yqQw1&amp;v=2&amp;email=example@example.com" style="mso-line-height-rule:exactly; font-family:Helvetica,Arial,sans-serif; font-size:12px; color:#00a4bd; font-weight:normal; text-decoration:underline; font-style:normal" data-hs-link-id="0" target="_blank">Unsubscribe</a>
																									   <a data-unsubscribe="true" href="https://hs-20659291.s.hubspotstarter.net/email-unsubscribe/email?product=emailStarter&amp;d=VmYj8c957LGxVKgD3Q3_YlyBW2m3bL73_YlyBN1JxwY5GKd_PV20N7q3d_6_DW1LYLPh5Hbg6YN66bBJs1yqQw1&amp;v=2&amp;email=example@example.com" style="mso-line-height-rule:exactly; font-family:Helvetica,Arial,sans-serif; font-size:12px; color:#00a4bd; font-weight:normal; text-decoration:underline; font-style:normal" data-hs-link-id="0" target="_blank">Manage preferences</a>
																									</p>
																								 </td>
																							  </tr>
																						   </tbody>
																						</table>
																					 </div>
																				  </td>
																			   </tr>
																			</tbody>
																		 </table>
																	  </div>
																	  <!--[if gte mso 9]>
																   </table>
																   <![endif]-->
																   <!--[if (mso)|(IE)]>
																</td>
																<![endif]-->
																<!--[if (mso)|(IE)]>
															 </tr>
														  </table>
														  <![endif]-->
													   </div>
													</div>
												 </div>
										   </td>
										</tr>
									 </tbody>
								  </table>
								  </div>
							   </body>
							</html>`
						}
					]
				};
				break;	
		default:
	}
	return body;
}

// const link = `${baseUrl}/?link=${urlLink}&apn=${appPackage}`
// encodeURI(`${hostUrl}/emailVerification?token=${token}&email=${to}`);

module.exports = { sendEmail, sendSingleEmail, sendGridEmail, sendVerificationEmail, sendPasswordResetEmail, makeDynamicLongLink, getEmailTemplate };
