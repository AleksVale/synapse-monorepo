import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class HotmartValidator {
  validateHottok(receivedToken: string, expectedToken: string): boolean {
    try {
      if (!receivedToken || !expectedToken) {
        return false;
      }

      return crypto.timingSafeEqual(
        Buffer.from(receivedToken),
        Buffer.from(expectedToken),
      );
    } catch (error) {
      console.error('Hotmart hottok validation error:', error);
      return false;
    }
  }
}
