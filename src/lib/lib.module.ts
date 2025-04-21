import { Module } from '@nestjs/common';
import { LibService } from './lib.service';

@Module({
  exports: [LibService],
  providers: [LibService]
})
export class LibModule { }
