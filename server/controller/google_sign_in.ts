import { Request, Response, NextFunction } from 'express';
import { ErrSomethingWentWrong } from '../err/error';
import { resFormattor } from '../utils/res_formatter';
import crypto from 'crypto'
import { OAuth2Client, OAuth2ClientOptions } from 'google-auth-library';

/**
 * Handles user login.
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 */
export async function googleSignIn(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {

    const option: OAuth2ClientOptions = {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectUri: process.env.GOOGLE_REDIRECT_URI,
      issuers: [process.env.DOMIN!],
    }

    // const oauth2Client = new google.auth.OAuth2(option);
    const oauth2Client = new OAuth2Client(option);


    const state = crypto.randomBytes(32).toString('hex');

    const authorizationUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      include_granted_scopes: true,
      state: state,
      scope: ['openid profile email'],
      prompt: 'select_account'
    });

    res.redirect(authorizationUrl);
  } catch (error: unknown) {
    console.log('Unkonwn error occured: ' + error)
    res.json(resFormattor(ErrSomethingWentWrong))
  }
};