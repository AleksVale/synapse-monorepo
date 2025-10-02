import { Injectable } from '@nestjs/common';

@Injectable()
export class EduzzValidator {
  validateToken(payloadToken: string, expectedToken: string): boolean {
    try {
      if (!payloadToken || !expectedToken) {
        return false;
      }

      return payloadToken === expectedToken;
    } catch (error) {
      console.error('Eduzz token validation error:', error);
      return false;
    }
  }
}
