import nodemailer from 'nodemailer';
import { ContactRequest } from '@your-scope/shared';

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendContactNotification(contact: ContactRequest): Promise<void> {
  const { name, email, company, message, scheduleCall, preferredDate } = contact;
  
  // Prepare email content
  const subject = scheduleCall 
    ? `New Call Request from ${name}`
    : `New Contact Request from ${name}`;
    
  const callDetails = scheduleCall && preferredDate
    ? `\n\nScheduled Call Details:\nPreferred Date: ${preferredDate.toLocaleString()}`
    : '';
    
  const companyInfo = company ? `\nCompany: ${company}` : '';
  
  const text = `
New contact request received:

Name: ${name}
Email: ${email}${companyInfo}
Message: ${message}${callDetails}

This is an automated message from the DataSecure contact form.
  `.trim();

  // Send email
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: process.env.CONTACT_NOTIFICATION_EMAIL,
    subject,
    text,
  });
} 