import nodemailer from 'nodemailer'
import { logger } from './logger'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendEmail(to: string, subject: string, html: string) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    logger.warn('Email not configured, skipping send', { to, subject })
    return
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
    })
    logger.info('Email sent successfully', { to, subject })
  } catch (error) {
    logger.error('Failed to send email', { to, subject, error })
    throw error
  }
}

export async function sendWelcomeEmail(to: string, username: string) {
  const html = `
    <h1>Welcome to RoCode, ${username}!</h1>
    <p>Start practicing Luau problems and climb the leaderboards.</p>
    <a href="${process.env.NEXT_PUBLIC_APP_URL}">Get Started</a>
  `
  await sendEmail(to, 'Welcome to RoCode!', html)
}

export async function sendSolveNotificationEmail(to: string, problemTitle: string) {
  const html = `
    <h1>Congratulations!</h1>
    <p>You solved: ${problemTitle}</p>
    <p>Keep up the great work!</p>
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/problems">Solve More Problems</a>
  `
  await sendEmail(to, `You solved: ${problemTitle}`, html)
}

