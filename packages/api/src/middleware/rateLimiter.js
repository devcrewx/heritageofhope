import rateLimit from 'express-rate-limit'

export const adminRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: parseInt(process.env.ADMIN_RATE_LIMIT || '120', 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
})
