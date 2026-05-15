/**
 * BilingualField.jsx
 * Component for editing EN and BN text side by side
 */

export default function BilingualField({ 
  label, 
  enValue, 
  bnValue, 
  onEnChange, 
  onBnChange, 
  type = 'text',
  required = false,
  bnRequired = false 
}) {
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

  return (
    <div style={containerStyle}>
      <label style={labelStyle}>
        {label}
        {required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
      <div style={fieldGroupStyle}>
        <div>
          <div style={labelColumnStyle}>English</div>
          {type === 'textarea' ? (
            <textarea
              value={enValue || ''}
              onChange={(e) => onEnChange(e.target.value)}
              style={textareaStyle}
              tabIndex={0}
            />
          ) : (
            <input
              type={type}
              value={enValue || ''}
              onChange={(e) => onEnChange(e.target.value)}
              style={inputStyle}
            />
          )}
        </div>
        <div>
          <div style={labelColumnStyle}>
            বাংলা
            {!bnRequired && enValue && !bnValue && <span style={{ color: '#f59e0b', marginLeft: '0.3rem' }}>○</span>}
          </div>
          {type === 'textarea' ? (
            <textarea
              value={bnValue || ''}
              onChange={(e) => onBnChange(e.target.value)}
              style={{
                ...textareaStyle,
                borderColor: !bnRequired && enValue && !bnValue ? '#fbbf24' : '#d1d5db',
              }}
              tabIndex={0}
            />
          ) : (
            <input
              type={type}
              value={bnValue || ''}
              onChange={(e) => onBnChange(e.target.value)}
              style={{
                ...inputStyle,
                borderColor: !bnRequired && enValue && !bnValue ? '#fbbf24' : '#d1d5db',
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
