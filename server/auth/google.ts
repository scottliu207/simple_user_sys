
import { OAuth2Client, OAuth2ClientOptions, VerifyIdTokenOptions } from 'google-auth-library/';


const option: OAuth2ClientOptions = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URI,
}

async function verify(token: string) {
  const client = new OAuth2Client(option)

  const verifyOpt: VerifyIdTokenOptions = {
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  }

  const ticket = await client.verifyIdToken(verifyOpt);
  const payload = ticket.getPayload();
  if (!payload) {
    throw new Error('Google payload not found.')
  }
  const userid = payload['sub'];
  console.log(userid)
}