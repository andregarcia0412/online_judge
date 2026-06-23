import { Module } from '@nestjs/common';
import { SystemServicePort } from './interface/system.service.port';
import { SystemController } from './system.controller';
import { SystemService } from './system.service';

@Module({
  controllers: [SystemController],
  providers: [{ provide: SystemServicePort, useClass: SystemService }],
})
export class SystemModule {}
