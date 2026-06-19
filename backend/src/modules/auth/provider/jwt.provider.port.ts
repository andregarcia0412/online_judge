import { JwtPayload } from 'jsonwebtoken';

export interface JwtProviderPort {
  generateAccessToken(subject: string, payload?: object): string;
  generateRefreshToken(subject: string): string;
  verifyRefreshToken(token: string): string | JwtPayload;
}

export const JwtProviderPort = Symbol('JwtProviderPort');
