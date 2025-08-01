require("dotenv").config();

module.exports = {
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_NAME: process.env.DB_NAME,
  DB_DEPLOY: process.env.DB_DEPLOY,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  USERNAME: process.env.USERNAME,
  ACCESS_KEY: process.env.ACCESS_KEY,
  PORT: process.env.PORT,
  PARTNER_ID: process.env.PARTNER_ID,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  
  WOMPI_PRIVATE_KEY: process.env.WOMPI_PRIVATE_KEY,
  WOMPI_PUBLIC_KEY: process.env.WOMPI_PUBLIC_KEY,
  WOMPI_INTEGRITY_SECRET: process.env.WOMPI_INTEGRITY_SECRET,
  WOMPI_EVENT_KEY: process.env.WOMPI_EVENT_KEY,
  
  WOMPI_API_URL: process.env.WOMPI_API_URL || 'https://production.wompi.co/v1',
  WOMPI_SANDBOX_API_URL: process.env.WOMPI_SANDBOX_API_URL || 'https://sandbox.wompi.co/v1',
  NODE_ENV: process.env.NODE_ENV || 'development',

    // ✅ AGREGAR LA FUNCIÓN QUE FALTABA
  getWompiApiUrl: function() {
    return process.env.NODE_ENV === 'production' 
      ? (process.env.WOMPI_API_URL || 'https://production.wompi.co/v1')
      : (process.env.WOMPI_SANDBOX_API_URL || 'https://sandbox.wompi.co/v1');
  },

  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:3001', 
  
  TAXXA_API_URL:  process.env.TAXXA_API_URL,
  TAXXA_EMAIL: process.env.TAXXA_EMAIL,
  TAXXA_PASSWORD: process.env.TAXXA_PASSWORD,
  CURRENT_TOKEN: process.env.CURRENT_TOKEN,
  MI_PAQUETE_API_KEY: process.env.MI_PAQUETE_API_KEY,
  MI_PAQUETE_URL: process.env.MI_PAQUETE_URL,
  MI_PAQUETE_SESSION_TRACKER: process.env.MI_PAQUETE_SESSION_TRACKER,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_SECURE: process.env.SMTP_SECURE,
  SMTP_USER: process.env.SMTP_USER,
};