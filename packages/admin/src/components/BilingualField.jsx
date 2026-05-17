/**
 * BilingualField.jsx
 * Component for editing EN and BN text side by side
 */

import { AlertCircle } from 'lucide-react'

export default function BilingualField({
  label,
  enValue,
  bnValue,
  onEnChange,
  onBnChange,
  labelEn,
  labelBn,
  valueEn,
  valueBn,
  onChangeEn,
  onChangeBn,
  type = 'text',
  isTextArea,
  required = false,
  bnRequired = false,
  errorEn,
  errorBn,
}) {
  const resolvedLabelEn = labelEn ?? label ?? 'English'
  const resolvedLabelBn = labelBn ?? label ?? 'Bangla'
  const resolvedValueEn = valueEn ?? enValue ?? ''
  const resolvedValueBn = valueBn ?? bnValue ?? ''
  const resolvedOnChangeEn = onChangeEn ?? onEnChange ?? (() => {})
  const resolvedOnChangeBn = onChangeBn ?? onBnChange ?? (() => {})
  const resolvedIsTextArea = typeof isTextArea === 'boolean' ? isTextArea : type === 'textarea'

  const containerStyle = {
    marginBottom: '1.25rem',
  }

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: 600,
    color: '#0f172a',
    fontSize: '0.95rem',
  }

  const fieldGroupStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.85rem',
  }

  const inputStyle = {
    padding: '0.65rem 0.8rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.4rem',
    fontSize: '0.95rem',
    fontFamily: 'inherit',
    width: '100%',
  }

  const textareaStyle = {
    ...inputStyle,
    minHeight: '4rem',
    resize: 'vertical',
  }

  const labelColumnStyle = {
    fontSize: '0.8rem',
    color: '#64748b',
    fontWeight: 500,
    marginBottom: '0.35rem',
  }

  const errorStyle = {
    color: '#ef4444',
    fontSize: '0.85rem',
    marginTop: '0.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  }

  return (
    <div style={containerStyle}>
      <div style={fieldGroupStyle}>
        <div>
          <label style={labelStyle}>
            {resolvedLabelEn}
            {required && <span style={{ color: '#ef4444' }}>*</span>}
          </label>
          <div style={labelColumnStyle}>English</div>
          {resolvedIsTextArea ? (
            <textarea
              value={resolvedValueEn}
              onChange={(e) => resolvedOnChangeEn(e.target.value)}
              style={{
                ...textareaStyle,
                borderColor: errorEn ? '#ef4444' : '#d1d5db',
              }}
              tabIndex={0}
            />
          ) : (
            <input
              type={type}
              value={resolvedValueEn}
              onChange={(e) => resolvedOnChangeEn(e.target.value)}
              style={{
                ...inputStyle,
                borderColor: errorEn ? '#ef4444' : '#d1d5db',
              }}
            />
          )}
          {errorEn && (
            <div style={errorStyle}>
              <AlertCircle size={14} />
              {errorEn}
            </div>
          )}
        </div>
        <div>
          <label style={labelStyle}>
            {resolvedLabelBn}
            {bnRequired && <span style={{ color: '#ef4444' }}>*</span>}
          </label>
          <div style={labelColumnStyle}>
            বাংলা
            {!bnRequired && resolvedValueEn && !resolvedValueBn && <span style={{ color: '#f59e0b', marginLeft: '0.3rem' }}>○</span>}
          </div>
          {resolvedIsTextArea ? (
            <textarea
              value={resolvedValueBn}
              onChange={(e) => resolvedOnChangeBn(e.target.value)}
              style={{
                ...textareaStyle,
                borderColor: errorBn ? '#ef4444' : (!bnRequired && resolvedValueEn && !resolvedValueBn ? '#fbbf24' : '#d1d5db'),
              }}
              tabIndex={0}
            />
          ) : (
            <input
              type={type}
              value={resolvedValueBn}
              onChange={(e) => resolvedOnChangeBn(e.target.value)}
              style={{
                ...inputStyle,
                borderColor: errorBn ? '#ef4444' : (!bnRequired && resolvedValueEn && !resolvedValueBn ? '#fbbf24' : '#d1d5db'),
              }}
            />
          )}
          {errorBn && (
            <div style={errorStyle}>
              <AlertCircle size={14} />
              {errorBn}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
