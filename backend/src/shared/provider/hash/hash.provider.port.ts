export interface HashProviderPort {
  generateHash(password: string): Promise<string>;
  compare(passwordType: string, passwordHash: string): Promise<boolean>;
}

export const HashProviderPort = Symbol('HashProviderPort');
