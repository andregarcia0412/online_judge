import { Injectable } from '@nestjs/common';
import tar from 'tar-stream';
import { TarPackProviderPort } from './tar-pack.provider.port';

@Injectable()
export class TarStreamProvider implements TarPackProviderPort {
  createSourceCodePack(fileName: string, fileContent: string) {
    const pack = tar.pack();
    pack.entry({ name: fileName }, fileContent);
    pack.finalize();

    return pack;
  }
}