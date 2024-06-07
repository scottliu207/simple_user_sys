export type StrategyTokenPayload = {
    idToken?: string;
    accessToken?: string;
    refreshToken?: string;
  };
  
  export type StrategyUserProfile = {
    name?: string;
    email?: string;
    picture?: string;
  };
  
  /**
   * Strategy pattern for authentication
   */
  export interface AuthStrategy {
    getToken(code: string): Promise<StrategyTokenPayload>;
    getUserProfile(token: string): Promise<StrategyUserProfile | null>;
    refreshToken(refreshToken: string): Promise<string | null>;
    revoke(refreshToken: string): Promise<void>;
  }
  