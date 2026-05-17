import { body, param, query, validationResult } from 'express-validator'

// Middleware to handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg,
        value: err.value,
      })),
    })
  }
  next()
}

// Common validators
export const validateTextInput = (fieldName, min = 1, max = 500) => 
  body(fieldName)
    .trim()
    .isLength({ min, max })
    .withMessage(`${fieldName} must be between ${min} and ${max} characters`)
    .escape()

export const validateEmail = () =>
  body('email')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail()

export const validatePassword = () =>
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')

export const validateNumber = (fieldName, min = 0, max = 999999) =>
  body(fieldName)
    .isInt({ min, max })
    .withMessage(`${fieldName} must be a number between ${min} and ${max}`)

export const validatePercentage = (fieldName) =>
  body(fieldName)
    .isInt({ min: 0, max: 100 })
    .withMessage(`${fieldName} must be a percentage between 0 and 100`)

export const validateUrl = (fieldName) =>
  body(fieldName)
    .if(body(fieldName).notEmpty())
    .isURL()
    .withMessage(`${fieldName} must be a valid URL`)

export const validateDate = (fieldName) =>
  body(fieldName)
    .if(body(fieldName).notEmpty())
    .isISO8601()
    .withMessage(`${fieldName} must be a valid date`)

export const validateBoolean = (fieldName) =>
  body(fieldName)
    .if(body(fieldName).notEmpty())
    .isBoolean()
    .withMessage(`${fieldName} must be true or false`)

export const validateId = (paramName = 'id') =>
  param(paramName)
    .isInt({ min: 1 })
    .withMessage(`${paramName} must be a valid ID`)

// Composite validators for common use cases
export const validateBilingualText = (enFieldName, bnFieldName, min = 1, max = 500) => [
  validateTextInput(enFieldName, min, max),
  body(bnFieldName)
    .if(body(bnFieldName).notEmpty())
    .trim()
    .isLength({ max })
    .withMessage(`${bnFieldName} must be at most ${max} characters`),
]

export const validateContactInfo = () => [
  validateTextInput('name', 2, 100),
  validateEmail(),
  validateTextInput('subject', 5, 200),
  validateTextInput('message', 10, 5000),
]

export const validateDonationTier = () => [
  validateNumber('amount', 1, 1000000),
  validateTextInput('labelEn', 5, 200),
  body('labelBn')
    .if(body('labelBn').notEmpty())
    .trim()
    .isLength({ max: 200 })
    .withMessage('labelBn must be at most 200 characters'),
]

export const validateFundAllocation = () => [
  validateTextInput('categoryEn', 2, 100),
  body('categoryBn')
    .if(body('categoryBn').notEmpty())
    .trim()
    .isLength({ max: 100 })
    .withMessage('categoryBn must be at most 100 characters'),
  validatePercentage('percentage'),
]

// Team member validators
export const validateTeamMember = () => [
  body('name')
    .trim()
    .notEmpty().withMessage('Member name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('roleEn')
    .if(body('roleEn').notEmpty())
    .trim()
    .isLength({ max: 100 })
    .withMessage('roleEn must be at most 100 characters'),
  body('roleBn')
    .if(body('roleBn').notEmpty())
    .trim()
    .isLength({ max: 100 })
    .withMessage('roleBn must be at most 100 characters'),
]

// Activity post validators
export const validateActivityPost = () => [
  body('titleEn')
    .trim()
    .notEmpty().withMessage('Title (English) is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  body('titleBn')
    .if(body('titleBn').notEmpty())
    .trim()
    .isLength({ max: 200 })
    .withMessage('Title (Bengali) must be at most 200 characters'),
  body('descriptionEn')
    .if(body('descriptionEn').notEmpty())
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description (English) must be at most 2000 characters'),
  body('descriptionBn')
    .if(body('descriptionBn').notEmpty())
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description (Bengali) must be at most 2000 characters'),
  body('date')
    .if(body('date').notEmpty())
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date'),
  body('published')
    .if(body('published').notEmpty())
    .isBoolean()
    .withMessage('Published must be true or false'),
]

// Gallery item validators
export const validateGalleryItem = () => [
  body('altEn')
    .if(body('altEn').notEmpty())
    .trim()
    .isLength({ max: 200 })
    .withMessage('Alt text (English) must be at most 200 characters'),
  body('altBn')
    .if(body('altBn').notEmpty())
    .trim()
    .isLength({ max: 200 })
    .withMessage('Alt text (Bengali) must be at most 200 characters'),
  body('category')
    .if(body('category').notEmpty())
    .trim()
    .isIn(['gallery', 'team', 'events', 'programs'])
    .withMessage('Category must be one of: gallery, team, events, programs'),
]

// Partner validators
export const validatePartner = () => [
  body('name')
    .trim()
    .notEmpty().withMessage('Partner name is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('Name must be between 2 and 200 characters'),
  body('active')
    .if(body('active').notEmpty())
    .isBoolean()
    .withMessage('Active must be true or false'),
]

// Reorder validators
export const validateReorderArray = () =>
  body()
    .custom((value) => {
      if (!Array.isArray(value.items || value.members || value.partners || value.posts)) {
        throw new Error('Items array is required');
      }
      return true;
    })

