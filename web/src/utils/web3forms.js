/**
 * Web3Forms utility for handling form submissions
 * Configuration: Update .env with your Web3Forms access key
 */

export async function submitFormWeb3(formData, formName = 'contact') {
  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY
  const toEmail = import.meta.env.VITE_WEB3FORMS_TO_EMAIL

  if (!accessKey || accessKey.includes('your_access_key')) {
    console.error(
      'Web3Forms access key not configured. Please update .env file with your Web3Forms key from https://web3forms.com/'
    )
    throw new Error(
      'Web3Forms not configured. Please add your access key to .env'
    )
  }

  // Prepare form data
  const submissionData = new FormData()
  
  // Add Web3Forms required fields
  submissionData.append('access_key', accessKey)
  submissionData.append('to_email', toEmail)
  
  // Add redirect URL
  submissionData.append('redirect', '/thank-you')
  
  // Add form-specific subject line
  const subjectLines = {
    contact: 'New Contact Form Submission - Heritage of Hope',
    volunteer: 'New Volunteer Application - Heritage of Hope',
    partner: 'New Partner Inquiry - Heritage of Hope',
  }
  submissionData.append('subject', subjectLines[formName] || 'New Form Submission')

  // Add optional from_name
  submissionData.append('from_name', 'Heritage of Hope Website')

  // Add all form fields from the provided FormData
  for (const [key, value] of formData.entries()) {
    submissionData.append(key, value)
  }

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: submissionData,
    })

    const data = await response.json()

    if (data.success) {
      return { success: true, message: 'Form submitted successfully!' }
    } else {
      return {
        success: false,
        message: data.message || 'Form submission failed. Please try again.',
      }
    }
  } catch (error) {
    console.error('Form submission error:', error)
    return {
      success: false,
      message: 'An error occurred while submitting the form. Please try again.',
    }
  }
}
