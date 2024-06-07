
import { OAuth2Client, OAuth2ClientOptions, VerifyIdTokenOptions } from 'google-auth-library/';
import { AuthStrategy, StrategyTokenPayload, StrategyUserProfile } from './base';

const option: OAuth2ClientOptions = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URI,
}


/**
 * Google auth for strategy pattern
 */
export class AuthGoogle implements AuthStrategy {
  private client = new OAuth2Client(option)
  async getToken(code: string): Promise<StrategyTokenPayload> {
    try {

      const { tokens } = await this.client.getToken(code)
      this.client.setCredentials(tokens)
      return { accessToken: tokens.access_token!, refreshToken: tokens.refresh_token!, idToken: tokens.id_token! }
    } catch (error) {
      throw new Error(`Failed to exchange token from Google, ${error}`)
    }
  }

  async getUserProfile(token: string): Promise<StrategyUserProfile | null> {
    const verifyOpt: VerifyIdTokenOptions = {
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    }

    const ticket = await this.client.verifyIdToken(verifyOpt);
    const payload = ticket.getPayload();
    if (!payload) {
      return null
    }

    return payload
  }

  async refreshToken(refreshToken: string): Promise<string | null> {
    try {
      this.client.setCredentials({ refresh_token: refreshToken })
      const res = await this.client.refreshAccessToken()
      if (!res.credentials.access_token) {
        return null
      }

      return res.credentials.access_token
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        return null
      }
      throw new Error(`Failed to exchange token from Google, ${error}`)
    }
  }

  async revoke(accessToken: string): Promise<void> {
    try {
      const client = new OAuth2Client(option)
      client.setCredentials({ access_token: accessToken })
      await client.revokeCredentials()
    } catch (error: any) {
      console.log(`Failed to revoke Google credentials, ${error}`)
      return
    }
  }
}