export const text = (en, bn) => ({ en, bn })

export const resolve = (language, value) => {
  if (value === null || value === undefined) {
    return ''
  }

  if (typeof value === 'object') {
    if ('en' in value || 'bn' in value) {
      const localized = value[language] ?? value.en ?? value.bn
      return typeof localized === 'string' || typeof localized === 'number' ? localized : ''
    }

    const firstRenderable = Object.values(value).find(
      (entry) => typeof entry === 'string' || typeof entry === 'number',
    )

    return firstRenderable ?? ''
  }

  return value
}
