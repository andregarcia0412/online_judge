export interface TarPackProviderPort {
  createSourceCodePack(fileName: string, fileContent: string): any;
}

export const TarPackProviderPort = Symbol('TarPackProviderPort');
