import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class EduzzValidator {
  validateSignature(
    payload: string,
    signature: string,
    secret: string,
  ): boolean {
    try {
      if (!payload || !signature || !secret) {
        return false;
      }

      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');

      return expectedSignature === signature;
    } catch (error) {
      console.error('Eduzz signature validation error:', error);
      return false;
    }
  }

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
