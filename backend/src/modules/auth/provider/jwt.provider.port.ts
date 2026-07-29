export type RefreshTokenPayload = {
  sub: string;
  jti: string;
  exp: number;
  iat: number;
};

export interface JwtProviderPort {
  generateAccessToken(subject: string, payload?: object): string;
  generateRefreshToken(subject: string): string;
  verifyRefreshToken(token: string): RefreshTokenPayload;
}

export const JwtProviderPort = Symbol('JwtProviderPort');
