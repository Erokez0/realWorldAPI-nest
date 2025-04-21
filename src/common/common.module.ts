import { Module } from '@nestjs/common';
import { RequestResponseInterceptor } from './interceptors/request-response.interceptor';

@Module({
  providers: [RequestResponseInterceptor],
  exports: [RequestResponseInterceptor]
})
export class CommonModule { }
