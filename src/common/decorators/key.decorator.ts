import { SetMetadata } from '@nestjs/common';

export const Key = (keyName: string) => SetMetadata('key', keyName)
