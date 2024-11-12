import * as nodemailer from 'nodemailer';

async function testSmtpConnection() {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_DOMAIN,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    socketTimeout: 5000,
    connectionTimeout: 5000,
    debug: true,
  });

  try {
    console.log('Attempting SMTP connection...');
    await transporter.verify();
    console.log('SMTP connection successful!');
  } catch (error) {
    console.error('Failed to connect to SMTP server:', error);
  }
}

testSmtpConnection();
