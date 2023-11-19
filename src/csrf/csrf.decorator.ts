import { SetMetadata } from '@nestjs/common';
export const CsrfToken = () => SetMetadata('csrf', true);