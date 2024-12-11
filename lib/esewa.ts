import crypto from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';

interface EsewaConfig {
  merchantId: string;
  merchantSecret: string;
  environment: 'live' | 'test';
}

export const esewaConfig: EsewaConfig = {
  merchantId: process.env.ESEWA_MERCHANT_ID || '',
  merchantSecret: process.env.ESEWA_MERCHANT_SECRET || '',
  environment: (process.env.ESEWA_ENVIRONMENT as 'live' | 'test') || 'test',
};

export const ESEWA_ENDPOINTS = {
  test: 'https://uat.esewa.com.np/epay/main',
  live: 'https://esewa.com.np/epay/main',
};

export interface EsewaPaymentParams {
  amount: number;
  productId: string;
  successUrl: string;
  failureUrl: string;
  productName: string;
  totalAmount: number;
}

export const generateEsewaForm = ({
  amount,
  productId,
  successUrl,
  failureUrl,
  productName,
  totalAmount,
}: EsewaPaymentParams) => {
  const tAmt = totalAmount;
  const amt = amount;
  const pdc = 0; // Delivery charge
  const psc = tAmt - amt - pdc; // Service charge
  const pid = productId;
  const scd = esewaConfig.merchantId;

  return {
    action: ESEWA_ENDPOINTS[esewaConfig.environment],
    fields: {
      tAmt,
      amt,
      pdc,
      psc,
      pid,
      scd,
      su: successUrl,
      fu: failureUrl,
    },
  };
};

export const verifyEsewaPayment = async (refId: string, amount: number, orderId: string) => {
  const message = `${refId},${amount},${orderId}`;
  const signature = crypto.HmacSHA256(message, esewaConfig.merchantSecret).toString();
  
  // In a real implementation, you would verify this with eSewa's API
  return { verified: true, signature };
};

export const generateOrderId = () => {
  return `ORDER-${uuidv4()}`;
};