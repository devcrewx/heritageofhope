import { useOutletContext } from 'react-router-dom'
import { useState } from 'react'
import { resolve, text } from '../content'
import DocumentModal from '../components/DocumentModal'
import { submitFormWeb3 } from '../utils/web3forms'

function GetInvolved() {
  const { language, siteContent } = useOutletContext()
  const { getInvolved } = siteContent
  const page = getInvolved.pageContent || {}
  const partnerPhoto = page.heroImage || '/assets/get_involved_partner.webp'
  const upiQrImage = page.upiQrImage || page.upiQr || '/docs/upi-qr.jpeg'

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
          <p className="eyebrow">{resolve(language, text('Get Involved', 'সাথে থাকুন'))}</p>
          <h1 className="page-title">{resolve(language, page.title || text('Join us in making a difference.', 'পরিবর্তন আনতে পাশে থাকুন।'))}</h1>
          <p>{resolve(language, page.intro || text('Whether through donations, volunteering, or partnerships, your involvement drives our mission forward.', 'অনুদান, স্বেচ্ছাসেবা বা অংশীদারিত্ব—যেভাবেই পারেন, পাশে থাকলে আমাদের কাজ এগোয়।'))}</p>
        </div>
        <div className="mini-panel accent-panel">
          <p className="meta">{resolve(language, page.bankLabel || text('Bank details', 'ব্যাংক তথ্য'))}</p>
          <p>{resolve(language, page.bank?.name || 'Heritage of Hope Foundation')}</p>
          <p>{resolve(language, page.bank?.branch || text('State Bank of India, Ruby Park Branch', 'স্টেট ব্যাংক অফ ইন্ডিয়া, রুবি পার্ক ব্রাঞ্চ'))}</p>
          <p>{resolve(language, page.bank?.account || text('A/C No: 43107075580', 'হিসাব নম্বর: 43107075580'))}</p>
          <p>{resolve(language, page.bank?.ifsc || text('IFSC: SBIN0008438', 'আইএফএসসি: SBIN0008438'))}</p>
          <div style={{ marginTop: '0.75rem' }}>
            <button type="button" className="btn btn-ghost" onClick={() => { setModalDoc({ src: page.chequeSpecimen || '/docs/empty-cheque.jpeg', title: resolve(language, page.chequeSpecimenLabel || text('Specimen cheque', 'উদাহরণ চেক')) }); setModalOpen(true) }}>
              {resolve(language, page.chequeSpecimenLabel || text('View specimen cheque', 'চেক দেখুন'))}
            </button>
          </div>
        </div>
      </section>

      <DocumentModal open={modalOpen} onClose={() => setModalOpen(false)} title={modalDoc?.title || ''} src={modalDoc?.src || ''} type="image" />

      <section className="panel split-panel donation-panel" data-reveal>
        <div>
          <div className="section-head">
            <p>{resolve(language, page.donationLabel || text('Donation ladder', 'অনুদানে কী বদলায়'))}</p>
            <h2>{resolve(language, page.donationHeading || text('What your support can do', 'আপনার সাহায্যে কী করা যায়'))}</h2>
          </div>
          <div className="donation-ladder-list">
            {(page.donationSteps || getInvolved.donationSteps || []).map((step) => (
              <article key={step.amount || step.id} className="donation-option card value-card" data-reveal>
                <span className="donation-amount">{step.amount}</span>
                <p>{resolve(language, step.title)}</p>
              </article>
            ))}
          </div>
        </div>
        <aside className="mini-panel accent-panel qr-panel">
          <div className="section-head">
            <p>{resolve(language, page.paymentLabel || text('UPI payment', 'ইউপিআই পেমেন্ট'))}</p>
            <h2>{resolve(language, page.paymentHeading || page.qrTitle || text('Scan to donate', 'স্ক্যান করে অনুদান দিন'))}</h2>
          </div>
          <div className="qr-frame">
            <img
              src={upiQrImage}
              alt={resolve(language, page.upiQrAlt || text('Official UPI QR code for donations', 'দানের জন্য আনুষ্ঠানিক ইউপিআই কিউআর কোড'))}
              loading="lazy"
            />
          </div>
          <div style={{ marginTop: '0.75rem' }}>
            <a className="btn btn-solid" href={page.upiIntentUrl || 'upi://pay?pa=8420119790%40okbizaxis&pn=Heritage%20of%20Hope%20Foundation&cu=INR'}>
              {resolve(language, page.upiCta || text('Pay via UPI app', 'UPI অ্যাপ দিয়ে পেমেন্ট করুন'))}
            </a>
          </div>
          <p className="qr-note" style={{ marginTop: '0.45rem' }}>{resolve(language, page.upiHint || text('On mobile, this opens your installed UPI app directly.', 'মোবাইলে চাপলে আপনার UPI অ্যাপ খুলে যাবে।'))}</p>
          <p className="qr-note">{resolve(language, page.upiFallback || text('If no UPI app opens on this device, please use the QR code above to complete payment.', 'এই ডিভাইসে UPI অ্যাপ না খুললে, উপরের QR কোড স্ক্যান করে পেমেন্ট সম্পন্ন করুন।'))}</p>
          <p className="qr-note">{resolve(language, page.qrBody || text('Scan this official UPI QR code to donate. You can also use the bank details above for direct transfers. After donating, email us your UTR for a receipt.', 'আনুষ্ঠানিক ইউপিআই কিউআর কোড স্ক্যান করে অনুদান দিন। চাইলে উপরের ব্যাংক তথ্য দিয়েও টাকা পাঠাতে পারেন। দানের পরে রসিদের জন্য UTR ইমেল করুন।'))}</p>
        </aside>
      </section>

      <section className="panel split-panel" data-reveal>
        <div>
          <div className="section-head">
            <p>{resolve(language, page.volunteerLabel || text('Volunteer', 'স্বেচ্ছাসেবা'))}</p>
            <h2>{resolve(language, page.volunteerHeading || text('People matter more than perfection', 'মানুষই আমাদের সবচেয়ে বড় শক্তি, দক্ষতা নয়'))}</h2>
          </div>
          <div className="card-grid two-up">
            {(page.volunteerRoles || getInvolved.volunteerRoles || []).map((role) => (
              <article key={resolve(language, role)} className="card value-card" data-reveal>
                <div className="card-body">
                  <h3>{resolve(language, role)}</h3>
                  <p>
                    {resolve(
                      language,
                      text(
                        'Support field execution, coordination, and regular follow-up.',
                        'মাঠের কাজ, সমন্বয় ও নিয়মিত ফলো-আপে সহায়তা করুন।',
                      ),
                    )}
                  </p>
                </div>
              </article>
            ))}
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
            <p>{resolve(language, page.volunteerFormLabel || text('Volunteer form', 'স্বেচ্ছাসেবক ফর্ম'))}</p>
            <h2>{resolve(language, page.volunteerFormHeading || text('Join the team', 'দলে যোগ দিন'))}</h2>
          </div>
          <div className="field">
            <label htmlFor="volunteer-name">{resolve(language, text('Name', 'নাম'))}</label>
            <input id="volunteer-name" name="name" type="text" required />
          </div>
          <div className="form-grid two-col">
            <div className="field">
              <label htmlFor="volunteer-email">{resolve(language, text('Email', 'ইমেল'))}</label>
              <input id="volunteer-email" name="email" type="email" required />
            </div>
            <div className="field">
              <label htmlFor="volunteer-phone">{resolve(language, text('Phone', 'ফোন'))}</label>
              <input id="volunteer-phone" name="phone" type="tel" required pattern="[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}" title={resolve(language, text('Please enter a valid phone number', 'একটি সঠিক ফোন নম্বর দিন'))} />
            </div>
          </div>
          <div className="form-grid two-col">
            <div className="field">
              <label htmlFor="volunteer-role">{resolve(language, text('Area of interest', 'আগ্রহের ক্ষেত্র'))}</label>
              <select id="volunteer-role" name="area_of_interest" required>
                <option value="">{resolve(language, text('Choose one', 'একটি বেছে নিন'))}</option>
                {(page.volunteerRoles || getInvolved.volunteerRoles || []).map((role) => (
                  <option key={resolve(language, role)} value={resolve(language, role)}>
                    {resolve(language, role)}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="volunteer-availability">{resolve(language, text('Availability', 'কখন সময় দিতে পারবেন'))}</label>
              <select id="volunteer-availability" name="availability" required>
                <option value="">{resolve(language, text('Choose one', 'একটি বেছে নিন'))}</option>
                <option value="weekends">{resolve(language, text('Weekends', 'ছুটির দিনে'))}</option>
                <option value="weekdays">{resolve(language, text('Weekdays', 'কাজের দিনে'))}</option>
                <option value="occasional">{resolve(language, text('Occasionally', 'মাঝে মাঝে'))}</option>
              </select>
            </div>
          </div>
          <div className="field">
            <label htmlFor="volunteer-message">{resolve(language, text('Message', 'বার্তা'))}</label>
            <textarea id="volunteer-message" name="message" rows="5" required minLength="10" />
          </div>
          <button type="submit" className="btn btn-solid" disabled={volunteerSubmitting}>
            {volunteerSubmitting ? resolve(language, text('Submitting...', 'আবেদন পাঠাচ্ছি...')) : resolve(language, text('Submit volunteer interest', 'স্বেচ্ছাসেবক হিসেবে আবেদন করুন'))}
          </button>
        </form>
      </section>

      <section className="panel split-panel" data-reveal>
        <div>
          <div className="section-head">
            <p>{resolve(language, page.partnerLabel || text('Partner with us', 'আমাদের সাথে কাজ করুন'))}</p>
            <h2>{resolve(language, page.partnerHeading || text('For CSR, hospitals and institutions', 'কর্পোরেট, হাসপাতাল ও অন্যান্য প্রতিষ্ঠানের জন্য'))}</h2>
          </div>
          <p>
            {resolve(language, page.partnerSubtitle || text('Partnerships help scale learning spaces, health camps, and seasonal support.', 'একসাথে কাজ করলে আমরা আরও বেশি মানুষের কাছে পড়াশোনা আর স্বাস্থ্যসেবা পৌঁছে দিতে পারি।'))}
          </p>
          <figure className="partner-photo-frame" data-reveal>
            <img
              src={partnerPhoto}
              alt={resolve(
                language,
                text(
                  'Partnership-led community outreach activity by Heritage of Hope Foundation',
                  'হেরিটেজ অফ হোপ ফাউন্ডেশনের সামাজিক কার্যক্রম',
                ),
              )}
              loading="lazy"
            />
            <figcaption>
              {resolve(
                language,
                text(
                  'Partnerships help us scale education, healthcare, and seasonal welfare with accountability.',
                  'একসাথে কাজ করলে আমরা শিক্ষা, স্বাস্থ্য আর মৌসুমি সাহায্য আরও বেশি মানুষের কাছে পৌঁছে দিতে পারি।',
                ),
              )}
            </figcaption>
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
            <p>{resolve(language, page.partnerFormLabel || text('Partner inquiry', 'পার্টনারশিপের কথা'))}</p>
            <h2>{resolve(language, page.partnerFormHeading || text('Start a collaboration', 'চলুন একসাথে কাজ করি'))}</h2>
          </div>
          <div className="field">
            <label htmlFor="org-name">{resolve(language, text('Organization name', 'সংস্থার নাম'))}</label>
            <input id="org-name" name="organization_name" type="text" required />
          </div>
          <div className="field">
            <label htmlFor="contact-person">{resolve(language, text('Contact person', 'যোগাযোগের ব্যক্তি'))}</label>
            <input id="contact-person" name="contact_person" type="text" required />
          </div>
          <div className="form-grid two-col">
            <div className="field">
              <label htmlFor="partner-email">{resolve(language, text('Email', 'ইমেল'))}</label>
              <input id="partner-email" name="email" type="email" required />
            </div>
            <div className="field">
              <label htmlFor="partner-phone">{resolve(language, text('Phone', 'ফোন নম্বর'))}</label>
              <input id="partner-phone" name="phone" type="tel" required pattern="[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}" title={resolve(language, text('Please enter a valid phone number', 'একটি সঠিক ফোন নম্বর দিন'))} />
            </div>
          </div>
          <div className="field">
            <label htmlFor="partnership-type">{resolve(language, text('Type of partnership', 'কী ধরনের কাজ'))}</label>
            <select id="partnership-type" name="partnership_type" required>
              <option value="">{resolve(language, text('Choose one', 'একটি বেছে নিন'))}</option>
              <option value="csr">CSR</option>
              <option value="hospital">{resolve(language, text('Hospital / Medical', 'হাসপাতাল / চিকিৎসা'))}</option>
              <option value="institution">{resolve(language, text('Institution / School', 'প্রতিষ্ঠান / স্কুল'))}</option>
              <option value="other">{resolve(language, text('Other', 'অন্যান্য'))}</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="partner-message">{resolve(language, text('Message', 'বার্তা'))}</label>
            <textarea id="partner-message" name="message" rows="5" required minLength="10" />
          </div>
          <button type="submit" className="btn btn-solid" disabled={partnerSubmitting}>
            {partnerSubmitting ? resolve(language, text('Submitting...', 'পাঠাচ্ছি...')) : resolve(language, text('Submit partner inquiry', 'পার্টনারশিপের কথা পাঠান'))}
          </button>
        </form>
      </section>
    </main>
  )
}

export default GetInvolved
