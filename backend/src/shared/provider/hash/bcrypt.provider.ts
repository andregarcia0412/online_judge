import { Injectable } from '@nestjs/common';
import { HashProviderPort } from './hash.provider.port';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptProvider implements HashProviderPort {
  private readonly salt: number;

  constructor(private readonly configService: ConfigService) {
    this.salt = Number(configService.get<string>('BCRYPT_SALT')) ?? 10;
  }

  generateHash(password: string): Promise<string> {
    return bcrypt.hash(password, this.salt);
  }
  compare(passwordType: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compareSync(passwordType, passwordHash);
  }
}
