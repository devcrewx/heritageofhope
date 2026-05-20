const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? ''
    : '')

const endpointMap = {
  contact: '/api/forms/contact',
  volunteer: '/api/forms/volunteer',
  partner: '/api/forms/partner',
}

export async function submitFormWeb3(formData, formName = 'contact') {
  const endpoint = endpointMap[formName]
  if (!endpoint) throw new Error(`Unknown form type: ${formName}`)

  const raw = Object.fromEntries(formData.entries())

  let body
  if (formName === 'contact') {
    const subject = raw.subject || ''
    body = {
      name: raw.name || '',
      email: raw.email || '',
      message: subject ? `[${subject}] ${raw.message || ''}` : (raw.message || ''),
    }
  } else if (formName === 'volunteer') {
    body = {
      name: raw.name || '',
      email: raw.email || '',
      phone: raw.phone || '',
      interest: raw.area_of_interest || '',
      message: raw.availability
        ? `Availability: ${raw.availability}\n\n${raw.message || ''}`
        : (raw.message || ''),
    }
  } else if (formName === 'partner') {
    body = {
      organizationName: raw.organization_name || '',
      contactPerson: raw.contact_person || '',
      email: raw.email || '',
      phone: raw.phone || '',
      inquiry: raw.partnership_type
        ? `Partnership type: ${raw.partnership_type}\n\n${raw.message || ''}`
        : (raw.message || ''),
    }
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const result = await response.json()

    if (response.ok && result.success) {
      return { success: true, message: result.message || 'Form submitted successfully!' }
    } else {
      return { success: false, message: result.error || 'Form submission failed.' }
    }
  } catch (error) {
    return { success: false, message: 'Network error. Please try again.' }
  }
}
