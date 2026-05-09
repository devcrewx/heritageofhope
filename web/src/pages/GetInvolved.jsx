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
      title: 'পরিবর্তন আনতে পাশে থাকুন।',
      intro:
        'অনুদান, স্বেচ্ছাসেবা বা অংশীদারিত্ব—যেভাবেই পারেন, পাশে থাকলে আমাদের কাজ এগোয়।',
      qrTitle: 'স্ক্যান করে অনুদান দিন',
      qrBody:
        'এই ডেমো ইউপিআই কিউআর কোড স্ক্যান করে সহজে অনুদান দিতে পারেন। চাইলে উপরের ব্যাংক তথ্য দিয়েও টাকা পাঠাতে পারেন।',
    },
  }

  return (
    <main className="page-stack page-involved">
      <section className="panel split-panel" id="donate" data-reveal>
        <div>
          <p className="eyebrow">{resolve(language, text('Get Involved', 'সাথে থাকুন'))}</p>
          <h1 className="page-title">{copy[language].title}</h1>
          <p>{copy[language].intro}</p>
        </div>
        <div className="mini-panel accent-panel">
          <p className="meta">{resolve(language, text('Bank details', 'ব্যাংক তথ্য'))}</p>
          <p>Heritage of Hope Foundation</p>
          <p>{resolve(language, text('State Bank of India, Ruby Park Branch', 'স্টেট ব্যাংক অফ ইন্ডিয়া, রুবি পার্ক ব্রাঞ্চ'))}</p>
          <p>{resolve(language, text('A/C No: 43107075580', 'হিসাব নম্বর: 43107075580'))}</p>
          <p>{resolve(language, text('IFSC: SBIN0008438', 'আইএফএসসি: SBIN0008438'))}</p>
        </div>
      </section>

      <section className="panel split-panel donation-panel" data-reveal>
        <div>
          <div className="section-head">
            <p>{resolve(language, text('Donation ladder', 'দানে কী হয়'))}</p>
            <h2>{resolve(language, text('What your support can do', 'আপনার সাহায্যে কী করা যায়'))}</h2>
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
              alt={resolve(language, text('Demo UPI QR code for donations', 'দানের জন্য ডেমো ইউপিআই কিউআর কোড'))}
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
            <h2>{resolve(language, text('People matter more than perfection', 'মানুষ আগে, পারফেকশন পরে'))}</h2>
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
            <p>{resolve(language, text('Volunteer form', 'স্বেচ্ছাসেবক ফর্ম'))}</p>
            <h2>{resolve(language, text('Join the team', 'দলে যোগ দিন'))}</h2>
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
            <p>{resolve(language, text('Partner with us', 'আমাদের সাথে কাজ করুন'))}</p>
            <h2>{resolve(language, text('For CSR, hospitals and institutions', 'CSR, হাসপাতাল আর অন্য প্রতিষ্ঠানগুলোর জন্য'))}</h2>
          </div>
          <p>
            {resolve(
              language,
              text(
                'Partnerships help scale learning spaces, health camps, and seasonal support.',
                'একসাথে কাজ করলে আমরা আরও বেশি মানুষের কাছে পড়াশোনা আর স্বাস্থ্যসেবা পৌঁছে দিতে পারি।',
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
                  'হেরিটেজ অফ হোপ ফাউন্ডেশনের অংশীদারদের সাথে করা কাজ',
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
        <form className="contact-form form-panel" name="partner-form" method="POST" action="/thank-you" data-netlify="true" netlify-honeypot="bot-field">
          <input type="hidden" name="form-name" value="partner-form" />
          <input type="hidden" name="bot-field" />
          <input type="hidden" name="_redirect" value="/thank-you" />
          <div className="section-head">
            <p>{resolve(language, text('Partner inquiry', 'পার্টনারশিপের কথা'))}</p>
            <h2>{resolve(language, text('Start a collaboration', 'চলুন একসাথে কাজ করি'))}</h2>
          </div>
          <div className="field">
            <label htmlFor="org-name">{resolve(language, text('Organization name', 'সংস্থার নাম'))}</label>
            <input id="org-name" name="organization_name" type="text" required />
          </div>
          <div className="field">
            <label htmlFor="contact-person">{resolve(language, text('Contact person', 'যার সাথে কথা বলব তার নাম'))}</label>
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
          <button type="submit" className="btn btn-solid">
            {resolve(language, text('Submit partner inquiry', 'পার্টনারশিপের কথা পাঠান'))}
          </button>
        </form>
      </section>
    </main>
  )
}

export default GetInvolved
