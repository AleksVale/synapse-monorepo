import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class KiwifyValidator {
  validateSignature(
    payload: string,
    signature: string,
    secret: string,
  ): boolean {
    try {
      const hmac = crypto.createHmac('sha256', secret);
      hmac.update(payload);
      const calculatedSignature = hmac.digest('hex');

      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(calculatedSignature),
      );
    } catch (error) {
      console.error('Kiwify signature validation error:', error);
      return false;
    }
  }
}
