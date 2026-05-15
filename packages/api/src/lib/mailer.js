import nodemailer from 'nodemailer'

const SMTP_HOST = process.env.SMTP_HOST
const SMTP_PORT = process.env.SMTP_PORT
const SMTP_USER = process.env.SMTP_USER
const SMTP_PASS = process.env.SMTP_PASS
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || process.env.SMTP_USER

let transporter = null
if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT || '587', 10),
    secure: false,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  })
}

export async function sendNotificationEmail(type, submission) {
  try {
    if (!transporter) {
      console.log('Mailer not configured; skipping email for', type, submission)
      return
    }

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
    console.log('Notification email sent for', type)
  } catch (err) {
    console.error('Failed to send notification email:', err)
  }
}

export default { sendNotificationEmail }
