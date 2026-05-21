import pino from 'pino'

const isDev = process.env.NODE_ENV !== 'production'

export const logger = pino({
  level: process.env.LOG_LEVEL || (isDev ? 'debug' : 'info'),
  ...(isDev && {
    transport: {
      target: 'pino-pretty',
      options: { colorize: true, translateTime: 'HH:MM:ss.l' },
    },
  }),
  redact: {
    paths: ['req.headers.authorization', 'req.headers.cookie', 'body.password', 'body.currentPassword', 'body.newPassword'],
    censor: '[REDACTED]',
  },
})

console.log = (...args) => logger.info(...args)
console.warn = (...args) => logger.warn(...args)
console.error = (...args) => logger.error(...args)
console.debug = (...args) => logger.debug(...args)
