import multer from 'multer'

// Use memory storage — files stored in RAM before upload to Cloudinary
const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
  const allowedMimes = {
    image: ['image/jpeg', 'image/png', 'image/webp'],
    pdf: ['application/pdf'],
    any: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  }

  const limit = req.query.fileType === 'pdf' ? 'pdf' : 'image'
  const allowed = allowedMimes[limit] || allowedMimes.any

  if (allowed.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error(`File type not allowed. Accepted: ${allowed.join(', ')}`))
  }
}

const limits = {
  fileSize: 10 * 1024 * 1024, // 10MB max
}

export const upload = multer({
  storage,
  fileFilter,
  limits,
})
