import sgMail, { MailDataRequired } from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

/**
 * Sends a user verification email.
 * @param address - Receiver's email address.
 * @param username - Receiver's name, username will show on the email context.
 * @param token - Verification token to be included in the email.
 */
export async function sendEmail(address: string, username: string, token: string): Promise<void> {
    const appName = "The Scott's Simple User Sys";

    const emailText = `
    Hello ${username},
    
    Thank you for registering with ${appName}. To complete your registration, please verify your email address by clicking the link below:
    
    ${process.env.EMAIL_REDIRECT}?token=${token}
    
    If the above link does not work, please copy and paste the following URL into your web browser:
    
    ${process.env.EMAIL_REDIRECT}?token=${token}
    
    If you did not create an account with ${appName}, please ignore this email.
    
    Best regards,
    The Scott's Simple User Sys
  `;

    const emailHtml = `<!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <title>Email Verification</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f6f6f6;
              margin: 0;
              padding: 0;
              -webkit-text-size-adjust: none;
          }
          .container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .content {
              text-align: left;
          }
          .content p {
              color: #555555;
              line-height: 1.6;
          }
          .content a {
              color: #007bff;
              text-decoration: none;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="content">
              <p>Hello ${username},</p>
              <p>Thank you for registering with ${appName}. To complete your registration, please verify your email address by clicking the link below:</p>
              <p><a href="${process.env.EMAIL_REDIRECT}?token=${token}">${process.env.EMAIL_REDIRECT}?token=${token}</a></p>
              <p>If the above link does not work, please copy and paste the following URL into your web browser:</p>
              <p><a href="${process.env.EMAIL_REDIRECT}?token=${token}">${process.env.EMAIL_REDIRECT}?token=${token}</a></p>
              <p>If you did not create an account with ${appName}, please ignore this email.</p>
              <p>Best regards,<br>${appName}</p>
          </div>
      </div>
  </body>
  </html>`;

    const msg: MailDataRequired = {
        to: address,
        from: process.env.SENDGRID_FROM!,
        subject: `Verify Your Email Address for ${appName}`,
        text: emailText,
        html: emailHtml,
    };

    try {
        const sgRes = await sgMail.send(msg);
        if (sgRes[0].statusCode !== 202) {
            throw new Error('Sending email failed.');
        }
    } catch (error) {
        throw new Error('Sending email failed: ' + error);
    }
}