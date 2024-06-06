
import { OAuth2Client, OAuth2ClientOptions, TokenPayload, VerifyIdTokenOptions } from 'google-auth-library/';

const option: OAuth2ClientOptions = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URI,
}

const client = new OAuth2Client(option)

export async function verify(token: string): Promise<TokenPayload | null> {
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
  return payload
}

export async function getTokens(code: string): Promise<{ access_token: string; refresh_token: string, id_token: string }> {
  try {
    const { tokens } = await client.getToken(code)
    client.setCredentials(tokens)
    console.log(tokens)

    return { access_token: tokens.access_token!, refresh_token: tokens.refresh_token!, id_token: tokens.id_token! }
  } catch (error) {
    throw new Error(`Failed to exchange token from Google, ${error}`)
  }
}

// export async function refreshTokens(token: string): Promise<{ access_token: string; refresh_token: string, id_token: string }> {
//   try {
//     const res = await client.refreshAccessToken()
//     res
//     client.setCredentials(tokens)
//     console.log(tokens)

//     return { access_token: tokens.access_token!, refresh_token: tokens.refresh_token!, id_token: tokens.id_token! }
//   } catch (error) {
//     throw new Error(`Failed to exchange token from Google, ${error}`)
//   }
// }

// export async function revokeToken(token: string): Promise<{ access_token: string; refresh_token: string, id_token: string }> {
//   try {
//     const { tokens } = await client.revokeToken(token)
//     client.setCredentials(tokens)
//     console.log(tokens)

//     return { access_token: tokens.access_token!, refresh_token: tokens.refresh_token!, id_token: tokens.id_token! }
//   } catch (error) {
//     throw new Error(`Failed to exchange token from Google, ${error}`)
//   }
// }


