import nodemailer from 'nodemailer'

const SMTP_HOST = process.env.SMTP_HOST
const SMTP_PORT = process.env.SMTP_PORT
const SMTP_USER = process.env.SMTP_USER
const SMTP_PASS = process.env.SMTP_PASS
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || process.env.SMTP_USER
const WEB3FORMS_KEY = process.env.WEB3FORMS_ACCESS_KEY
const WEB3FORMS_TO = process.env.WEB3FORMS_TO_EMAIL || NOTIFY_EMAIL

let transporter = null
if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
  const smtpPort = parseInt(SMTP_PORT || '587', 10)
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  })
}

/**
 * Fallback to Web3Forms if SMTP is not available
 */
async function sendWeb3Fallback(type, submission) {
  if (!WEB3FORMS_KEY) {
    console.warn('Web3Forms fallback skipped: No access key provided.')
    return false
  }

  try {
    const subjectMap = {
      contact: 'New contact form submission',
      volunteer: 'New volunteer submission',
      partner: 'New partnership inquiry',
    }

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        to_email: WEB3FORMS_TO,
        subject: subjectMap[type] || `New ${type} submission`,
        from_name: 'Heritage of Hope API (Fallback)',
        message: `New ${type} submission received.`,
        ...submission,
      }),
    })

    const result = await response.json()
    if (result.success) {
      console.log('Notification sent successfully via Web3Forms fallback for', type)
      return true
    } else {
      console.error('Web3Forms fallback failed:', result.message)
      return false
    }
  } catch (err) {
    console.error('Critical failure in Web3Forms fallback:', err)
    return false
  }
}

export async function sendNotificationEmail(type, submission) {
  // 1. Try SMTP if configured
  if (transporter) {
    try {
      const subjectMap = {
        contact: 'New contact form submission',
        volunteer: 'New volunteer submission',
        partner: 'New partnership inquiry',
      }

      const subject = subjectMap[type] || `New ${type} submission`
      const html = `<p>New <strong>${type}</strong> submission received.</p>
        <pre>${JSON.stringify(submission, null, 2)}</pre>`

      await transporter.sendMail({
        from: `${SMTP_USER}`,
        to: NOTIFY_EMAIL,
        subject,
        html,
      })
      console.log('Notification email sent via SMTP for', type)
      return // Success
    } catch (err) {
      console.error('SMTP delivery failed, attempting Web3Forms fallback:', err)
    }
  } else {
    console.log('SMTP not configured; attempting Web3Forms fallback for', type)
  }

  // 2. Fallback to Web3Forms
  await sendWeb3Fallback(type, submission)
}

export async function sendEmail({ to, subject, html, text }) {
  if (transporter) {
    try {
      await transporter.sendMail({
        from: process.env.FROM_EMAIL || process.env.SMTP_USER || 'noreply@heritageofhope.org',
        to,
        subject,
        html,
        text,
      })
      console.log('Email sent via SMTP to', to)
      return
    } catch (err) {
      console.error('SMTP delivery failed, attempting Web3Forms fallback:', err)
    }
  } else {
    console.log('SMTP not configured; attempting Web3Forms fallback')
  }

  if (!WEB3FORMS_KEY) {
    console.warn('Web3Forms fallback skipped: No access key provided.')
    return
  }

  try {
    const plainText = text || html?.replace(/<[^>]*>/g, '') || subject
    await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        to_email: WEB3FORMS_TO,
        subject: `[Password Reset] ${subject}`,
        from_name: 'Heritage of Hope API (Email Fallback)',
        message: `This is a password reset notification that could not be delivered via SMTP to ${to}.\n\n---\n${plainText}`,
      }),
    })
    console.log('Email notification sent via Web3Forms fallback for', subject)
  } catch (err) {
    console.error('Web3Forms fallback failed:', err)
  }
}

export default { sendNotificationEmail, sendEmail }
