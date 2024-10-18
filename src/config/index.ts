export const PORT = process.env.PORT;
export const MONGO_URL = process.env.MONGO_URL;
export const SESSION_SECRET = process.env.SESSION_SECRET;
export const JWT_SECRET = process.env.JWT_SECRET as string;
export const NODE_ENV = process.env.NODE_ENV || 'development';

export const MAILER = {
  HOST: process.env.MAILER_HOST,
  USER: process.env.MAILER_USER,
  PASSWORD: process.env.MAILER_PASSWORD,
  PORT: process.env.MAILER_PORT,
};

export const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY as string;

export const REDIS_URL = process.env.REDIS_URL as string;
