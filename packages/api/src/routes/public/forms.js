import express from 'express'
import { body, validationResult } from 'express-validator'
import { prisma } from '../../lib/prisma.js'
import { sendNotificationEmail } from '../../lib/mailer.js'

const router = express.Router()

// POST /api/forms/contact - Save contact form submission
router.post(
  '/contact',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('message').trim().notEmpty().withMessage('Message is required'),
    body('phone').optional().trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const { name, email, phone, message } = req.body
      
      const submission = await prisma.contactSubmission.create({
        data: {
          name,
          email,
          phone: phone || null,
          message,
        },
      })

      // Record audit log
      try {
        await prisma.auditLog.create({
          data: {
            adminId: null,
            action: 'CREATE',
            tableName: 'contact_submissions',
            recordId: submission.id,
            note: `Contact from ${name} <${email}>`,
          },
        })
      } catch (e) {
        console.error('Failed to write audit log for contact submission:', e)
      }

      // Try sending notification email (non-blocking)
      try {
        await sendNotificationEmail('contact', submission)
      } catch (e) {
        console.error('Email notification error (contact):', e)
      }
      // TODO: Send email notification to admin
      // await sendNotificationEmail('contact', submission)

      res.status(201).json({
        success: true,
        message: 'Your message has been received. We will get back to you soon.',
        id: submission.id,
      })
    } catch (error) {
      console.error('Contact form error:', error)
      res.status(500).json({ error: 'Failed to submit form' })
    }
  }
)

// POST /api/forms/volunteer - Save volunteer form submission
router.post(
  '/volunteer',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('interest').optional().trim(),
    body('message').optional().trim(),
    body('phone').optional().trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const { name, email, phone, interest, message } = req.body
      
      const submission = await prisma.volunteerSubmission.create({
        data: {
          name,
          email,
          phone: phone || null,
          interest: interest || null,
          message: message || null,
        },
      })

      // Record audit log
      try {
        await prisma.auditLog.create({
          data: {
            adminId: null,
            action: 'CREATE',
            tableName: 'volunteer_submissions',
            recordId: submission.id,
            note: `Volunteer interest from ${name} <${email}>`,
          },
        })
      } catch (e) {
        console.error('Failed to write audit log for volunteer submission:', e)
      }

      // Send notification email (best-effort)
      try {
        await sendNotificationEmail('volunteer', submission)
      } catch (e) {
        console.error('Email notification error (volunteer):', e)
      }
      // TODO: Send email notification to admin

      res.status(201).json({
        success: true,
        message: 'Thank you for your interest! We will contact you soon.',
        id: submission.id,
      })
    } catch (error) {
      console.error('Volunteer form error:', error)
      res.status(500).json({ error: 'Failed to submit form' })
    }
  }
)

// POST /api/forms/partner - Save partner inquiry form submission
router.post(
  '/partner',
  [
    body('organizationName').trim().notEmpty().withMessage('Organization name is required'),
    body('contactPerson').trim().notEmpty().withMessage('Contact person name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').optional().trim(),
    body('inquiry').optional().trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const { organizationName, contactPerson, email, phone, inquiry } = req.body
      
      const submission = await prisma.partnerSubmission.create({
        data: {
          organizationName,
          contactPerson,
          email,
          phone: phone || null,
          inquiry: inquiry || null,
        },
      })

      // Record audit log
      try {
        await prisma.auditLog.create({
          data: {
            adminId: null,
            action: 'CREATE',
            tableName: 'partner_submissions',
            recordId: submission.id,
            note: `Partner inquiry from ${organizationName} <${email}>`,
          },
        })
      } catch (e) {
        console.error('Failed to write audit log for partner submission:', e)
      }

      // Send notification email (best-effort)
      try {
        await sendNotificationEmail('partner', submission)
      } catch (e) {
        console.error('Email notification error (partner):', e)
      }
      // TODO: Send email notification to admin

      res.status(201).json({
        success: true,
        message: 'Your partnership inquiry has been received. We will review and contact you soon.',
        id: submission.id,
      })
    } catch (error) {
      console.error('Partner form error:', error)
      res.status(500).json({ error: 'Failed to submit form' })
    }
  }
)

export default router
