import 'dotenv/config'
import { createApp } from './app.js'

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason)
})

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err)
})

const app = createApp()
const port = process.env.PORT || 3001

app.listen(port, '0.0.0.0', () => {
  console.log(`API listening on port ${port}`)
})
