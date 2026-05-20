import { useOutletContext } from 'react-router-dom'
import { useState } from 'react'
import { resolve, text } from '../utils/i18n'
import DocumentModal from '../components/DocumentModal'
import { submitFormWeb3 } from '../utils/web3forms'

function GetInvolved() {
  const { language, siteContent } = useOutletContext()
  const { getInvolved } = siteContent
  const page = getInvolved.pageContent || {}
  const hero = getInvolved.hero
  const bank = getInvolved.bankDetails
  const partnerSection = getInvolved.partnerSection
  const volunteer = getInvolved.volunteer
  const partnerPhoto = partnerSection.image

  const [modalOpen, setModalOpen] = useState(false)
  const [modalDoc, setModalDoc] = useState(null)
  const [volunteerSubmitting, setVolunteerSubmitting] = useState(false)
  const [volunteerStatus, setVolunteerStatus] = useState(null)
  const [partnerSubmitting, setPartnerSubmitting] = useState(false)
  const [partnerStatus, setPartnerStatus] = useState(null)

  return (
    <main className="page-stack page-involved">
      <section className="panel split-panel" id="donate" data-reveal>
        <div>
          <p className="eyebrow">{resolve(language, page.eyebrow)}</p>
          <h1 className="page-title">{resolve(language, hero.pageTitle)}</h1>
          <p>{resolve(language, hero.intro)}</p>
        </div>
        <div className="mini-panel accent-panel">
          <p className="meta">{resolve(language, text('Bank details', 'ব্যাংক তথ্য'))}</p>
          <p>{bank.accountName}</p>
          <p>{bank.bankName}</p>
          <p>{bank.accountNumber}</p>
          <p>{bank.ifsc}</p>
          <div style={{ marginTop: '0.75rem' }}>
            <button type="button" className="btn btn-ghost" onClick={() => { setModalDoc({ src: getInvolved.specimenChequeImage, title: resolve(language, text('Specimen cheque', 'নমুনা চেক')) }); setModalOpen(true) }}>
              {resolve(language, text('View specimen cheque', 'চেক দেখুন'))}
            </button>
          </div>
        </div>
      </section>

      <DocumentModal open={modalOpen} onClose={() => setModalOpen(false)} title={modalDoc?.title || ''} src={modalDoc?.src || ''} type="image" />

      <section className="panel split-panel donation-panel" data-reveal>
        <div>
          <div className="section-head">
            <p>{resolve(language, page.donationLabel)}</p>
            <h2>{resolve(language, page.donationHeading)}</h2>
          </div>
          <div className="donation-ladder-list">
            {getInvolved.donationTiers && getInvolved.donationTiers.length > 0
              ? getInvolved.donationTiers.map((tier) => (
                  <article key={tier.amount} className="donation-option card value-card" data-reveal>
                    <span className="donation-amount">&#x20B9;{tier.amount}</span>
                    <p>{resolve(language, tier.label)}</p>
                  </article>
                ))
              : null}
          </div>
        </div>
        <aside className="mini-panel accent-panel qr-panel">
          <div className="section-head">
            <p>{resolve(language, page.paymentLabel)}</p>
            <h2>{resolve(language, page.paymentHeading)}</h2>
          </div>
          <div className="qr-frame">
            <img
              src={getInvolved.upiImage}
              alt="Official UPI QR code for donations"
              loading="lazy"
            />
          </div>
          <div style={{ marginTop: '0.75rem' }}>
            <a className="btn btn-solid" href={getInvolved.upiDeepLink}>
              Pay via UPI app
            </a>
          </div>
          <p className="qr-note" style={{ marginTop: '0.45rem' }}>On mobile, this opens your installed UPI app directly.</p>
          <p className="qr-note">If no UPI app opens on this device, please use the QR code above to complete payment.</p>
          <p className="qr-note">Scan this official UPI QR code to donate. You can also use the bank details above for direct transfers. After donating, email us your UTR for a receipt.</p>
        </aside>
      </section>

      <section className="panel split-panel" data-reveal>
        <div>
          <div className="section-head">
            <p>{resolve(language, page.volunteerLabel)}</p>
            <h2>{resolve(language, page.volunteerHeading)}</h2>
          </div>
          <div className="card-grid two-up">
            {volunteer.roles && volunteer.roles.length > 0
              ? volunteer.roles.map((role) => (
                  <article key={resolve(language, role.title)} className="card value-card" data-reveal>
                    <div className="card-body">
                      <h3>{resolve(language, role.title)}</h3>
                      <p>{resolve(language, role.description)}</p>
                    </div>
                  </article>
                ))
              : null}
          </div>
        </div>
        <form
          className="contact-form form-panel"
          onSubmit={async (e) => {
            e.preventDefault()
            setVolunteerSubmitting(true)
            setVolunteerStatus(null)
            try {
              const formData = new FormData(e.target)
              const result = await submitFormWeb3(formData, 'volunteer')
              if (result.success) {
                setVolunteerStatus({ type: 'success', message: result.message })
                e.target.reset()
                window.location.href = '/thank-you'
              } else {
                setVolunteerStatus({ type: 'error', message: result.message })
              }
            } catch (error) {
              setVolunteerStatus({ type: 'error', message: 'Failed to submit form. Please try again.' })
            } finally {
              setVolunteerSubmitting(false)
            }
          }}
        >
          {volunteerStatus && (
            <div style={{ padding: '1rem', marginBottom: '1rem', borderRadius: '0.5rem', backgroundColor: volunteerStatus.type === 'success' ? '#d4edda' : '#f8d7da', color: volunteerStatus.type === 'success' ? '#155724' : '#721c24', border: `1px solid ${volunteerStatus.type === 'success' ? '#c3e6cb' : '#f5c6cb'}` }}>
              {volunteerStatus.message}
            </div>
          )}
          <div className="section-head">
            <p>{resolve(language, page.volunteerFormLabel)}</p>
            <h2>{resolve(language, page.volunteerFormHeading)}</h2>
          </div>
          <div className="field">
            <label htmlFor="volunteer-name">Name</label>
            <input id="volunteer-name" name="name" type="text" required />
          </div>
          <div className="form-grid two-col">
            <div className="field">
              <label htmlFor="volunteer-email">Email</label>
              <input id="volunteer-email" name="email" type="email" required />
            </div>
            <div className="field">
              <label htmlFor="volunteer-phone">Phone</label>
              <input id="volunteer-phone" name="phone" type="tel" required pattern="[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}" title="Please enter a valid phone number" />
            </div>
          </div>
          <div className="form-grid two-col">
            <div className="field">
              <label htmlFor="volunteer-role">Area of interest</label>
              <select id="volunteer-role" name="area_of_interest" required>
                <option value="">Choose one</option>
                {volunteer.roles && volunteer.roles.length > 0
                  ? volunteer.roles.map((role) => (
                      <option key={resolve(language, role.title)} value={resolve(language, role.title)}>
                        {resolve(language, role.title)}
                      </option>
                    ))
                  : null}
              </select>
            </div>
            <div className="field">
              <label htmlFor="volunteer-availability">Availability</label>
              <select id="volunteer-availability" name="availability" required>
                <option value="">Choose one</option>
                <option value="weekends">Weekends</option>
                <option value="weekdays">Weekdays</option>
                <option value="occasional">Occasionally</option>
              </select>
            </div>
          </div>
          <div className="field">
            <label htmlFor="volunteer-message">Message</label>
            <textarea id="volunteer-message" name="message" rows="5" required minLength="10" />
          </div>
          <button type="submit" className="btn btn-solid" disabled={volunteerSubmitting}>
            {volunteerSubmitting ? 'Submitting...' : 'Submit volunteer interest'}
          </button>
        </form>
      </section>

      <section className="panel split-panel" data-reveal>
        <div>
          <div className="section-head">
            <p>{resolve(language, page.partnerLabel)}</p>
            <h2>{resolve(language, page.partnerHeading)}</h2>
          </div>
          <p>{resolve(language, page.partnerSubtitle)}</p>
          <figure className="partner-photo-frame" data-reveal>
            <img
              src={partnerPhoto}
              alt="Partnership-led community outreach activity by Heritage of Hope Foundation"
              loading="lazy"
            />
            <figcaption>{resolve(language, partnerSection.body)}</figcaption>
          </figure>
        </div>
        <form
          className="contact-form form-panel"
          onSubmit={async (e) => {
            e.preventDefault()
            setPartnerSubmitting(true)
            setPartnerStatus(null)
            try {
              const formData = new FormData(e.target)
              const result = await submitFormWeb3(formData, 'partner')
              if (result.success) {
                setPartnerStatus({ type: 'success', message: result.message })
                e.target.reset()
                window.location.href = '/thank-you'
              } else {
                setPartnerStatus({ type: 'error', message: result.message })
              }
            } catch (error) {
              setPartnerStatus({ type: 'error', message: 'Failed to submit form. Please try again.' })
            } finally {
              setPartnerSubmitting(false)
            }
          }}
        >
          {partnerStatus && (
            <div style={{ padding: '1rem', marginBottom: '1rem', borderRadius: '0.5rem', backgroundColor: partnerStatus.type === 'success' ? '#d4edda' : '#f8d7da', color: partnerStatus.type === 'success' ? '#155724' : '#721c24', border: `1px solid ${partnerStatus.type === 'success' ? '#c3e6cb' : '#f5c6cb'}` }}>
              {partnerStatus.message}
            </div>
          )}
          <div className="section-head">
            <p>{resolve(language, page.partnerFormLabel)}</p>
            <h2>{resolve(language, page.partnerFormHeading)}</h2>
          </div>
          <div className="field">
            <label htmlFor="org-name">Organization name</label>
            <input id="org-name" name="organization_name" type="text" required />
          </div>
          <div className="field">
            <label htmlFor="contact-person">Contact person</label>
            <input id="contact-person" name="contact_person" type="text" required />
          </div>
          <div className="form-grid two-col">
            <div className="field">
              <label htmlFor="partner-email">Email</label>
              <input id="partner-email" name="email" type="email" required />
            </div>
            <div className="field">
              <label htmlFor="partner-phone">Phone number</label>
              <input id="partner-phone" name="phone" type="tel" required pattern="[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}" title="Please enter a valid phone number" />
            </div>
          </div>
          <div className="field">
            <label htmlFor="partnership-type">Type of partnership</label>
            <select id="partnership-type" name="partnership_type" required>
              <option value="">Choose one</option>
              <option value="csr">CSR</option>
              <option value="hospital">Hospital / Medical</option>
              <option value="institution">Institution / School</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="partner-message">Message</label>
            <textarea id="partner-message" name="message" rows="5" required minLength="10" />
          </div>
          <button type="submit" className="btn btn-solid" disabled={partnerSubmitting}>
            {partnerSubmitting ? 'Submitting...' : 'Submit partner inquiry'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default GetInvolved
