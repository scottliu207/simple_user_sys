import { AuthStrategy, StrategyTokenPayload, StrategyUserProfile } from './base';
import { generateToken } from '../utils/token';

/**
 * Basic auth for strategy pattern, it only has refresh token for now.
 */
export class AuthBasic implements AuthStrategy {
  async getToken(code: string): Promise<StrategyTokenPayload> {
    return {};
  }

  async getUserProfile(token: string): Promise<StrategyUserProfile | null> {
    return null;
  }

  async refreshToken(refreshToken: string): Promise<string | null> {
    return generateToken();
  }

  async revoke(refreshToken: string): Promise<void> {
  }
}
