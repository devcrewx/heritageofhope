import { useOutletContext } from 'react-router-dom'
import { donationSteps, resolve, volunteerRoles, text } from '../content'

const demoUpiQr = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNbuCgdtNT6LH1bCGXtIZGt76s4Qpd8ybiFQ&s'

function GetInvolved() {
  const { language } = useOutletContext()

  const copy = {
    en: {
      title: 'Join us in making a difference.',
      intro:
        'Whether through donations, volunteering, or partnerships, your involvement drives our mission forward.',
      qrTitle: 'Scan to donate',
      qrBody:
        'Use this demo UPI QR code to make a quick contribution. You can also use the bank details above for direct transfers.',
    },
    bn: {
      title: 'পরিবর্তন আনতে আমাদের সাথে যোগ দিন।',
      intro:
        'অনুদান, স্বেচ্ছাসেবা বা অংশীদারিত্ব—আপনার অংশগ্রহণ আমাদের লক্ষ্য পূরণে সহায়ক।',
      qrTitle: 'স্ক্যান করে অনুদান দিন',
      qrBody:
        'ডেমো ইউপিআই কিউআর কোড স্ক্যান করে দ্রুত অনুদান দিতে পারেন। সরাসরি ট্রান্সফারের জন্য উপরের ব্যাংক তথ্যও ব্যবহার করতে পারেন।',
    },
  }

  return (
    <main className="page-stack page-involved">
      <section className="panel split-panel" id="donate" data-reveal>
        <div>
          <p className="eyebrow">Get Involved</p>
          <h1 className="page-title">{copy[language].title}</h1>
          <p>{copy[language].intro}</p>
        </div>
        <div className="mini-panel accent-panel">
          <p className="meta">Bank details</p>
          <p>Heritage of Hope Foundation</p>
          <p>State Bank of India, Ruby Park Branch</p>
          <p>A/C No: 43107075580</p>
          <p>IFSC: SBIN0008438</p>
        </div>
      </section>

      <section className="panel split-panel donation-panel" data-reveal>
        <div>
          <div className="section-head">
            <p>{resolve(language, text('Donation ladder', 'অনুদান ও তার প্রভাব'))}</p>
            <h2>{resolve(language, text('What your support can do', 'আপনার সহায়তা কী করতে পারে'))}</h2>
          </div>
          <div className="donation-ladder-list">
            {donationSteps.map((step) => (
              <article key={step.amount} className="donation-option card value-card" data-reveal>
                <span className="donation-amount">{step.amount}</span>
                <p>{resolve(language, step.title)}</p>
              </article>
            ))}
          </div>
        </div>
        <aside className="mini-panel accent-panel qr-panel">
          <div className="section-head">
            <p>{resolve(language, text('UPI payment', 'ইউপিআই পেমেন্ট'))}</p>
            <h2>{copy[language].qrTitle}</h2>
          </div>
          <div className="qr-frame">
            <img
              src={demoUpiQr}
              alt={resolve(language, text('Demo UPI QR code for donations', 'অনুদানের জন্য ডেমো ইউপিআই কিউআর কোড'))}
              loading="lazy"
            />
          </div>
          <p className="qr-note">{copy[language].qrBody}</p>
        </aside>
      </section>

      <section className="panel split-panel" data-reveal>
        <div>
          <div className="section-head">
            <p>{resolve(language, text('Volunteer', 'স্বেচ্ছাসেবা'))}</p>
            <h2>{resolve(language, text('People matter more than perfection', 'অভিজ্ঞতার চেয়ে সদিচ্ছাই বড় শক্তি'))}</h2>
          </div>
          <div className="card-grid two-up">
            {volunteerRoles.map((role) => (
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
        <form className="contact-form form-panel" name="volunteer-form" method="POST" action="/thank-you" data-netlify="true" netlify-honeypot="bot-field">
          <input type="hidden" name="form-name" value="volunteer-form" />
          <input type="hidden" name="bot-field" />
          <input type="hidden" name="_redirect" value="/thank-you" />
          <div className="section-head">
            <p>{resolve(language, text('Volunteer form', 'স্বেচ্ছাসেবক হিসেবে যোগদানের ফর্ম'))}</p>
            <h2>{resolve(language, text('Join the team', 'টিমে যোগ দিন'))}</h2>
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
              <input id="volunteer-phone" name="phone" type="tel" required pattern="[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}" title="Please enter a valid phone number" />
            </div>
          </div>
          <div className="form-grid two-col">
            <div className="field">
              <label htmlFor="volunteer-role">{resolve(language, text('Area of interest', 'আগ্রহের ক্ষেত্র'))}</label>
              <select id="volunteer-role" name="area_of_interest" required>
                <option value="">{resolve(language, text('Choose one', 'একটি বেছে নিন'))}</option>
                {volunteerRoles.map((role) => (
                  <option key={resolve(language, role)} value={resolve(language, role)}>
                    {resolve(language, role)}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="volunteer-availability">{resolve(language, text('Availability', 'সময় দেওয়ার সুযোগ'))}</label>
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
          <button type="submit" className="btn btn-solid">
            {resolve(language, text('Submit volunteer interest', 'স্বেচ্ছাসেবক হিসেবে আবেদন করুন'))}
          </button>
        </form>
      </section>

      <section className="panel split-panel" data-reveal>
        <div>
          <div className="section-head">
            <p>{resolve(language, text('Partner with us', 'আমাদের উদ্যোগের সঙ্গী হোন'))}</p>
            <h2>{resolve(language, text('For CSR, hospitals and institutions', 'CSR, হাসপাতাল ও প্রতিষ্ঠানের জন্য'))}</h2>
          </div>
          <p>
            {resolve(
              language,
              text(
                'Partnerships help scale learning spaces, health camps, and seasonal support.',
                'যৌথ উদ্যোগে আমরা আরও বেশি মানুষের কাছে শিক্ষা ও স্বাস্থ্যসেবা পৌঁছে দিতে পারি।',
              ),
            )}
          </p>
          <figure className="partner-photo-frame" data-reveal>
            <img
              src="/assets/get_involved_partner.webp"
              alt={resolve(
                language,
                text(
                  'Partnership-led community outreach activity by Heritage of Hope Foundation',
                  'হেরিটেজ অফ হোপ ফাউন্ডেশনের অংশীদারিত্বভিত্তিক কমিউনিটি আউটরিচ কার্যক্রম',
                ),
              )}
              loading="lazy"
            />
            <figcaption>
              {resolve(
                language,
                text(
                  'Partnerships help us scale education, healthcare, and seasonal welfare with accountability.',
                  'অংশীদারিত্বের মাধ্যমে আমরা জবাবদিহিতার সাথে শিক্ষা, স্বাস্থ্যসেবা ও মৌসুমি সহায়তা আরও বিস্তৃত করতে পারি।',
                ),
              )}
            </figcaption>
          </figure>
        </div>
        <form className="contact-form form-panel" name="partner-form" method="POST" action="/thank-you" data-netlify="true" netlify-honeypot="bot-field">
          <input type="hidden" name="form-name" value="partner-form" />
          <input type="hidden" name="bot-field" />
          <input type="hidden" name="_redirect" value="/thank-you" />
          <div className="section-head">
            <p>{resolve(language, text('Partner inquiry', 'অংশীদারিত্বের জন্য যোগাযোগ'))}</p>
            <h2>{resolve(language, text('Start a collaboration', 'সহযোগিতার হাত বাড়িয়ে দিন'))}</h2>
          </div>
          <div className="field">
            <label htmlFor="org-name">{resolve(language, text('Organization name', 'সংস্থার নাম'))}</label>
            <input id="org-name" name="organization_name" type="text" required />
          </div>
          <div className="field">
            <label htmlFor="contact-person">{resolve(language, text('Contact person', 'যোগাযোগের জন্য ব্যক্তির নাম'))}</label>
            <input id="contact-person" name="contact_person" type="text" required />
          </div>
          <div className="form-grid two-col">
            <div className="field">
              <label htmlFor="partner-email">{resolve(language, text('Email', 'ইমেল'))}</label>
              <input id="partner-email" name="email" type="email" required />
            </div>
            <div className="field">
              <label htmlFor="partner-phone">{resolve(language, text('Phone', 'ফোন নম্বর'))}</label>
              <input id="partner-phone" name="phone" type="tel" required pattern="[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}" title="Please enter a valid phone number" />
            </div>
          </div>
          <div className="field">
            <label htmlFor="partnership-type">{resolve(language, text('Type of partnership', 'অংশীদারিত্বের ধরন'))}</label>
            <select id="partnership-type" name="partnership_type" required>
              <option value="">{resolve(language, text('Choose one', 'একটি বেছে নিন'))}</option>
              <option value="csr">CSR</option>
              <option value="hospital">Hospital / Medical</option>
              <option value="institution">Institution / School</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="partner-message">{resolve(language, text('Message', 'বার্তা'))}</label>
            <textarea id="partner-message" name="message" rows="5" required minLength="10" />
          </div>
          <button type="submit" className="btn btn-solid">
            {resolve(language, text('Submit partner inquiry', 'অংশীদার হিসেবে যোগাযোগ করুন'))}
          </button>
        </form>
      </section>
    </main>
  )
}

export default GetInvolved
