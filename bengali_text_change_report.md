# Bengali Text Audit — Round 2 Suggestions
**Heritage of Hope Foundation Website**
Audited: May 2026 | Scope: All 234 EN/BN pairs across `web/src`

> Round 1 suggestions have been applied. This document covers the remaining issues found in the updated strings, focusing on three patterns:
> - **মাঠ-literal** — "field/ground" words used literally instead of idiomatically
> - **formal-register** — bureaucratic or administrative Bengali where warm spoken Bengali is needed
> - **english-in-bengali** — English words or acronyms left untranslated in Bengali script

---

## Issue Patterns Found

| Pattern | Count | Description |
|---|---|---|
| `মাঠ-literal` | 4 | 'মাঠপর্যায়' and 'মাঠের' used as calques of "field/ground-level" |
| `formal-register` | 14 | Bureaucratic compounds ('প্রদান', 'বিতরণ', 'তদারকি', 'সমন্বয়') instead of spoken Bengali |
| `english-in-bengali` | 5 | English words in Bengali script ('প্রোগ্রাম সাপোর্ট', 'সোশ্যাল মিডিয়া', 'টিমের', 'কমিউনিটিই', 'CSR') |
| `verbose` | 1 | Form label that is a full sentence instead of a short label |

---

## 🔴 Change Recommended (19 items)

---

### 1. "মাঠপর্যায়ের" — Community coordination label

**File:** `web/src/content.js`
**English:** Community coordination and field programs
**Current:** জনসংযোগ ও মাঠপর্যায়ের কাজ
**Suggested:** জনসংযোগ ও তৃণমূল পর্যায়ের কাজ
**Pattern:** `মাঠ-literal`

**Reason:** 'মাঠপর্যায়' is a bureaucratic compound — a direct calque of the English "field level" used in government reports and policy documents. 'মাঠ' literally means a field or playground, which sounds odd when applied to community work. Bengali speakers use 'তৃণমূল পর্যায়' (grassroots level) for this concept, or more warmly 'মানুষের কাছে গিয়ে' (going to people directly).

---

### 2. "মাঠপর্যায়ের" — Volunteer role label

**File:** `web/src/content.js`
**English:** Field Volunteers
**Current:** মাঠপর্যায়ের স্বেচ্ছাসেবক
**Suggested:** মাঠে-কাজের স্বেচ্ছাসেবক
**Pattern:** `মাঠ-literal`

**Reason:** Same 'মাঠপর্যায়' issue. For a volunteer role label, 'মাঠে-কাজের স্বেচ্ছাসেবক' (volunteers who work on-ground) is more natural. Alternatively 'সরাসরি সেবার স্বেচ্ছাসেবক' (direct-service volunteers) avoids the 'মাঠ' word entirely while conveying the same meaning.

---

### 3. "মাঠপর্যায়ে" — Homepage section heading

**File:** `web/src/pages/Home.jsx`
**English:** What we do on the ground
**Current:** মাঠপর্যায়ে আমাদের কার্যক্রম
**Suggested:** মানুষের দোরগোড়ায় আমাদের কাজ
**Pattern:** `মাঠ-literal`

**Reason:** 'মাঠপর্যায়ে' (at field level) is the bureaucratic calque of "on the ground". This is a homepage heading meant to be warm and engaging. 'মানুষের দোরগোড়ায় আমাদের কাজ' (our work at people's doorstep) is vivid, specifically Bengali in register, and communicates direct community reach far more effectively than the administrative phrasing.

---

### 4. "মাঠের কাজের" — About section heading

**File:** `web/src/pages/About.jsx`
**English:** Grounded in field realities
**Current:** মাঠের কাজের গল্প
**Suggested:** বাস্তব অভিজ্ঞতার গল্প
**Pattern:** `মাঠ-literal`

**Reason:** 'মাঠের কাজের গল্প' reads literally as "stories of work in the field/playground" — the 'মাঠ' is a physical space, not a register of experience. The intended meaning is "grounded in real-world experience". 'বাস্তব অভিজ্ঞতার গল্প' (stories from real experience) or 'মানুষের মাঝ থেকে' (from among the people) captures this naturally without the literal-field problem.

---

### 5. "সেবা প্রদান ও তদারকি" — Service delivery label

**File:** `web/src/content.js`
**English:** Direct service delivery and follow-up
**Current:** সরাসরি সেবা প্রদান ও তদারকি
**Suggested:** সরাসরি সেবা পৌঁছে দেওয়া ও খোঁজখবর রাখা
**Pattern:** `formal-register`

**Reason:** 'সেবা প্রদান' (service provision) and 'তদারকি' (supervision/oversight) are both heavy bureaucratic words that belong in government programme documents, not an NGO website. The OurWork page already uses the natural 'খোঁজখবর রাখি' style for the same concept — matching that register here creates consistency and warmth.

---

### 6. "আয়োজন সমন্বয়" — Volunteer role label

**File:** `web/src/content.js`
**English:** Event coordination
**Current:** আয়োজন সমন্বয়
**Suggested:** অনুষ্ঠান গোছানো
**Pattern:** `formal-register`

**Reason:** 'সমন্বয়' (coordination) is a formal corporate and administrative term. For a grassroots NGO volunteer role, 'অনুষ্ঠান গোছানো' (organising / putting the event together) is how actual Bengali speakers describe this activity — it is direct, active, and natural.

---

### 7. "স্বেচ্ছাসেবক ব্যবস্থাপনা" — Planning label

**File:** `web/src/content.js`
**English:** Planning, logistics and volunteer support
**Current:** পরিকল্পনা ও স্বেচ্ছাসেবক ব্যবস্থাপনা
**Suggested:** পরিকল্পনা ও স্বেচ্ছাসেবকদের সামলানো
**Pattern:** `formal-register`

**Reason:** 'ব্যবস্থাপনা' (management) is another corporate-administrative compound. The OurWork page already uses 'সামলানো' naturally — 'স্বেচ্ছাসেবকদের সামলানো' is consistent with that warmer register and how volunteers actually talk about coordinating with each other.

---

### 8. "প্রোগ্রাম সাপোর্ট" — Fund allocation label

**File:** `web/src/content.js`
**English:** Program Support
**Current:** প্রোগ্রাম সাপোর্ট
**Suggested:** কর্মসূচি সহায়তা
**Pattern:** `english-in-bengali`

**Reason:** Both words are transliterated English in Bengali script. This is a fund allocation category label visible on the Impact page — a donor reading the fund utilisation chart in Bengali mode should see Bengali. 'কর্মসূচি সহায়তা' is the natural Bengali equivalent and is consistent with how other fund categories on the same chart are labelled ('মৌসুমি কল্যাণ সহায়তা', 'পরিচালনা ব্যয়' etc.).

---

### 9. "সোশ্যাল মিডিয়া" — Volunteer role label

**File:** `web/src/content.js`
**English:** Social media
**Current:** সোশ্যাল মিডিয়া
**Suggested:** সামাজিক মাধ্যম
**Pattern:** `english-in-bengali`

**Reason:** 'সোশ্যাল মিডিয়া' is English in Bengali script. 'সামাজিক মাধ্যম' is the accepted, widely used Bengali equivalent — used by all major Bengali publications, news channels, and broadcasters. This appears as a volunteer area-of-interest option, so it should be in natural Bengali.

---

### 10. "পড়ার সহায়তা" — Volunteer role label

**File:** `web/src/content.js`
**English:** Reading support
**Current:** পড়ার সহায়তা
**Suggested:** পড়তে সাহায্য করা
**Pattern:** `formal-register`

**Reason:** 'পড়ার সহায়তা' is a bureaucratic noun phrase that sounds like a programme activity code. 'পড়তে সাহায্য করা' (helping to read) is how a teacher, parent, or volunteer would describe this naturally. It is direct, active, and warm.

---

### 11. "ভিত্তিমূলক শিক্ষা" — Program highlight

**File:** `web/src/content.js`
**English:** Foundational learning
**Current:** ভিত্তিমূলক শিক্ষা
**Suggested:** শুরু থেকে শেখা
**Pattern:** `formal-register`

**Reason:** 'ভিত্তিমূলক' is a Sanskrit-derived formal academic term that Bengali speakers rarely use in everyday speech — it appears mostly in formal education policy writing. For an NGO running a community school for underserved children, 'শুরু থেকে শেখা' (learning from the beginning) is warmer and more relatable. 'প্রাথমিক শিক্ষা' (primary/elementary learning) is also acceptable if a slightly more formal label is preferred.

---

### 12. "এক নজরে আমাদের প্রভাব" — Homepage stats heading

**File:** `web/src/pages/Home.jsx`
**English:** Impact snapshot
**Current:** এক নজরে আমাদের প্রভাব
**Suggested:** এক নজরে আমাদের কাজ
**Pattern:** `formal-register`

**Reason:** 'প্রভাব' (impact/influence) was identified in the first audit as academic-sounding. The Impact page correctly uses 'ফলাফল' instead. This string on the homepage still uses 'প্রভাব'. Replacing it with 'এক নজরে আমাদের কাজ' (our work at a glance) is natural, consistent with the site's voice, and avoids the academic register.

---

### 13. "জীবনরক্ষাকারী উদ্যোগ" — Program highlight label

**File:** `web/src/content.js`
**English:** Life-saving action
**Current:** জীবনরক্ষাকারী উদ্যোগ
**Suggested:** জীবন বাঁচানোর উদ্যোগ
**Pattern:** `formal-register`

**Reason:** 'জীবনরক্ষাকারী' is a long compound adjective that Bengali speakers rarely say aloud — it reads like a phrase from a medical or legal document. 'জীবন বাঁচানোর উদ্যোগ' (initiative to save lives) conveys the identical meaning in natural spoken Bengali.

---

### 14. "সামাজিক ভোজ" — Gallery / caption label

**File:** `web/src/content.js`
**English:** Community feast by the river
**Current:** নদীর ধারে সামাজিক ভোজ
**Suggested:** নদীর ধারে একসাথে খাওয়া
**Pattern:** `formal-register`

**Reason:** 'সামাজিক ভোজ' (social feast) sounds like a formal state banquet or official reception — not an informal community meal by a river. The English phrase describes something warm and informal. 'নদীর ধারে একসাথে খাওয়া' (eating together by the river) is exactly how any Bengali speaker would describe this gathering, and it is far more evocative as a photo caption.

---

### 15. "কমিউনিটিই" — About page title

**File:** `web/src/pages/About.jsx`
**English:** Rooted in community. Driven by impact.
**Current:** কমিউনিটিই আমাদের শক্তি। মানুষের পাশে থাকাই আমাদের কাজ।
**Suggested:** মানুষের মধ্যেই আমাদের শিকড়। কাজের ফলই আমাদের পথ দেখায়।
**Pattern:** `english-in-bengali`

**Reason:** The page title begins with 'কমিউনিটিই' — an English word in Bengali possessive form. Every other About heading avoids English borrowings. More importantly, the suggested Bengali rendering is semantically closer to the English: 'মানুষের মধ্যেই আমাদের শিকড়' (our roots are among people) mirrors "rooted in community" precisely, while 'কাজের ফলই আমাদের পথ দেখায়' (the results of our work guide our path) captures "driven by impact" in a way that feels written in Bengali, not translated from English.

---

### 16. "টিমের এক ঝলক" — About team section

**File:** `web/src/pages/About.jsx`
**English:** Team snapshot
**Current:** টিমের এক ঝলক
**Suggested:** আমাদের দলের এক ঝলক
**Pattern:** `english-in-bengali`

**Reason:** 'টিমের' uses the English word 'team' in Bengali possessive form. 'দলের এক ঝলক' is the natural Bengali equivalent. Adding 'আমাদের' (our) makes it complete and warm — 'আমাদের দলের এক ঝলক' (a glimpse of our team).

---

### 17. "দানে কী হয়" — Donation section heading

**File:** `web/src/pages/GetInvolved.jsx`
**English:** Donation ladder
**Current:** দানে কী হয়
**Suggested:** অনুদানে কী বদলায়
**Pattern:** `register-mismatch`

**Reason:** 'দানে কী হয়' (what happens with a donation) reads as an uncertain, slightly casual question — like something a child might ask. For a section heading on a donation page it lacks confidence. 'অনুদানে কী বদলায়' (what changes with your donation) is equally accessible and conversational but carries purpose and momentum. Note also that 'দান' has a religious/charity connotation in Bengali — 'অনুদান' (donation/grant) is the more neutral, modern term.

---

### 18. "CSR" — Partner section label

**File:** `web/src/pages/GetInvolved.jsx`
**English:** For CSR, hospitals and institutions
**Current:** CSR, হাসপাতাল আর অন্য প্রতিষ্ঠানগুলোর জন্য
**Suggested:** কর্পোরেট, হাসপাতাল ও অন্যান্য প্রতিষ্ঠানের জন্য
**Pattern:** `english-in-bengali`

**Reason:** 'CSR' stands alone as an English acronym in a Bengali sentence without translation or explanation. While educated Bengali readers may recognise it, a label in Bengali mode should be in Bengali. 'কর্পোরেট সামাজিক দায়িত্ব' is the full form but unwieldy as a label — 'কর্পোরেট' alone is widely understood, shorter, and fits naturally in the sentence.

---

### 19. "বিঘ্নহীন শিক্ষা" — Program tagline

**File:** `web/src/content.js`
**English:** Education without interruption
**Current:** বিঘ্নহীন শিক্ষা
**Suggested:** অবিরাম শিক্ষা
**Pattern:** `formal-register`

**Reason:** 'বিঘ্নহীন' is a Sanskrit-heavy formal adjective that Bengali speakers rarely use in conversation — it appears mostly in literary or formal writing. 'অবিরাম শিক্ষা' (continuous/uninterrupted learning) is cleaner and more natural as a program tagline. For an even more human register, 'পড়াশোনা যেন থেমে না যায়' (so that learning doesn't stop) could work as a tagline, though it is longer.

---

## 🟡 Minor Suggestions (8 items)

---

### 20. "আনন্দ উদযাপন" — Image caption

**File:** `web/src/content.js`
**English:** Children celebrating together
**Current:** শিশুদের আনন্দ উদযাপন
**Suggested:** শিশুদের একসাথে আনন্দ
**Pattern:** `formal-register`

**Reason:** 'উদযাপন' (celebration) is correct but slightly formal for a photo caption. 'একসাথে আনন্দ' (joy together) is lighter and more natural as an image label. Photo captions should describe what you see, not use event-management language.

---

### 21. "শীতবস্ত্র প্রদান" — Image caption

**File:** `web/src/content.js`
**English:** Children receiving winter support
**Current:** শিশুদের শীতবস্ত্র প্রদান
**Suggested:** শিশুদের হাতে শীতের পোশাক
**Pattern:** `formal-register`

**Reason:** 'প্রদান' (provision/bestowal) is a formal administrative verb used in government disbursement contexts. 'শিশুদের হাতে শীতের পোশাক' (winter clothes into children's hands) is warmer and visual — a photo caption should describe what is seen in the image, not summarise it in administrative language.

---

### 22. "স্বাস্থ্যসেবা কার্যক্রমে সহায়তা" — Partner/volunteer tag

**File:** `web/src/content.js`
**English:** health outreach support
**Current:** স্বাস্থ্যসেবা কার্যক্রমে সহায়তা
**Suggested:** স্বাস্থ্যসেবায় পাশে থাকা
**Pattern:** `formal-register`

**Reason:** 'কার্যক্রমে সহায়তা' (support in the programme) is bureaucratic as a short tag. 'স্বাস্থ্যসেবায় পাশে থাকা' (being alongside in healthcare) is natural, brief, and consistent with the site's recurring 'পাশে' idiom that appears throughout.

---

### 23. "আধিকারিক দলিল" — About documents tab

**File:** `web/src/pages/About.jsx`
**English:** Official documents
**Current:** আধিকারিক দলিল
**Suggested:** সরকারি কাগজপত্র
**Pattern:** `formal-register`

**Reason:** 'আধিকারিক' is a formal Bengali rendering of 'official' that sounds slightly stiff and old-fashioned. 'সরকারি কাগজপত্র' (government papers/documents) is the natural phrase any Bengali speaker would use. If the label must be short, 'দলিলপত্র' alone is cleaner. This is minor — the current version is not wrong, only formal.

---

### 24. "যার সাথে কথা বলব তার নাম" — Partner form field label

**File:** `web/src/pages/GetInvolved.jsx`
**English:** Contact person
**Current:** যার সাথে কথা বলব তার নাম
**Suggested:** যোগাযোগের ব্যক্তি
**Pattern:** `verbose`

**Reason:** 'যার সাথে কথা বলব তার নাম' is a complete sentence used as a form field label — it is too long and conversational for a label. Form field labels in Bengali should be short and scannable. 'যোগাযোগের ব্যক্তি' (contact person) or 'দায়িত্বশীল ব্যক্তির নাম' (name of the responsible person) are both clean and appropriately brief.

---

### 25. "কিশলয় কমিউনিটি" — Gallery / content tag

**File:** `web/src/content.js`
**English:** Kishalaya community
**Current:** কিশলয় কমিউনিটি
**Suggested:** কিশলয়ের মানুষজন
**Pattern:** `english-in-bengali`

**Reason:** 'কমিউনিটি' is English in Bengali script. 'কিশলয়ের মানুষজন' (the people of Kishalaya) is natural and warm. 'কিশলয় পরিবার' (Kishalaya family) is another option that emphasises belonging.

---

### 26. "খাতা বিতরণের দিন" — Gallery caption

**File:** `web/src/content.js`
**English:** Notebook distribution day
**Current:** খাতা বিতরণের দিন
**Suggested:** খাতা দেওয়ার দিন
**Pattern:** `formal-register`

**Reason:** 'বিতরণ' (distribution) is the formal administrative word used in government schemes (e.g. রেশন বিতরণ, ত্রাণ বিতরণ). 'খাতা দেওয়ার দিন' (the day of giving notebooks) is exactly how any Bengali speaker would describe this event — warm, simple, and child-centric.

---

### 27. "রক্তদানপূর্ব স্বাস্থ্য পরীক্ষা" — Program highlight

**File:** `web/src/content.js`
**English:** Pre-donation health checkup
**Current:** রক্তদানপূর্ব স্বাস্থ্য পরীক্ষা
**Suggested:** রক্ত দেওয়ার আগে স্বাস্থ্য পরীক্ষা
**Pattern:** `formal-register`

**Reason:** 'রক্তদানপূর্ব' strings three morphemes together into one compound. Bengali speakers say 'রক্ত দেওয়ার আগে' (before giving blood) — the meaning is identical but the phrasing is natural spoken Bengali rather than a medical report compound.

---

### 28. "শীতকালীন বিতরণ" — Gallery/caption label

**File:** `web/src/content.js`
**English:** Winter distribution
**Current:** শীতকালীন বিতরণ
**Suggested:** শীতের জিনিস দেওয়া
**Pattern:** `formal-register`

**Reason:** 'শীতকালীন বিতরণ' is a stripped administrative tag that removes all warmth from the actual event. The event involves giving warm clothes and bags to children. 'শীতের জিনিস দেওয়া' (giving winter things) or 'শীতবস্ত্র পৌঁছে দেওয়া' (delivering winter clothes) is natural and human.

---

## ✅ Strings Confirmed Natural — No Change Needed

| File | English | Bengali | Note |
|---|---|---|---|
| Layout.jsx | Donate Now | সহযোগিতার হাত বাড়িয়ে দিন | Warm idiom. Keep. |
| content.js | Community registration and outreach | মানুষের পাশে, মানুষের সাথে | Better than English. Keep. |
| About.jsx | We work directly with the people we serve… | আমরা সরাসরি মানুষের পাশে দাঁড়াই… | Updated from Round 1. Natural. |
| OurWork.jsx | Identify community needs | পাড়ার দরকারটা আগে বুঝে নিই | Excellent conversational register. |
| OurWork.jsx | Execute program and track impact | কাজটা করি আর কী হলো দেখি | Natural first-person plural. |
| OurWork.jsx | Provide ongoing support and review | চলতে থাকা সহায়তা আর খোঁজখবর রাখি | 'খোঁজখবর রাখি' is perfect. |
| content.js | sponsor a learning journey | একজনের শিক্ষার দায়িত্ব নিন | 'দায়িত্ব নিন' is culturally resonant. |
| Home.jsx | Even small support helps us… | অল্প সাহায্যেও আমাদের ক্লাস চালানো… | Natural structure. 'সামলানো' is right. |
| Impact.jsx | Fund utilization | টাকা কোথায় খরচ হয় | Plain spoken Bengali. Excellent. |
| Impact.jsx | How support is used | আপনাদের সাহায্য কীভাবে কাজে লাগে | Warm and direct. |
| GetInvolved.jsx | Whether through donations, volunteering… | অনুদান, স্বেচ্ছাসেবা বা অংশীদারিত্ব… | Natural. Em-dash works in Bengali too. |
| Contact.jsx | Response time | কত তাড়াতাড়ি উত্তর পাবেন | Conversational. Natural. |
| content.js | Durga Puja clothes for children | শিশুদের জন্য পূজার নতুন জামা | 'পূজার নতুন জামা' is culturally perfect. |
| content.js | Durga Puja Dignity Drive | দুর্গাপূজা উপহার উদ্যোগ | Natural and specific. |
| content.js | Monsoon relief / Monsoon Relief Support | বর্ষাকালীন সহায়তা / বর্ষার সহায়তা | Both natural. |
| content.js | Relief drives | মৌসুমি কল্যাণ সহায়তা | Updated from Round 1. Correct. |
| Home.jsx | Heritage of Hope Foundation works across South 24 Parganas… | হেরিটেজ অফ হোপ ফাউন্ডেশন দক্ষিণ ২৪ পরগণায়… | Updated from Round 1. Natural. |
| content.js | Community first aid | প্রাথমিক স্বাস্থ্যসেবা | Updated from Round 1. Correct. |
| About.jsx | Vision | আমাদের দৃষ্টিভঙ্গি | Updated from Round 1. Correct. |
| About.jsx | Empowerment | স্বনির্ভরতা | Updated from Round 1. Warm. |
| About.jsx | Community (value) | সম্প্রদায় | Updated from Round 1. Correct. |
| content.js | children supported | শিশুর কাছে পৌঁছানো হয়েছে | Updated from Round 1. Passive form correct for metric. |
| GetInvolved.jsx | People matter more than perfection | মানুষই আমাদের সবচেয়ে বড় শক্তি, দক্ষতা নয় | Updated from Round 1. Natural. |
| OurWork.jsx | Collaborate with local partners | স্থানীয় অংশীদারদের সাথে যৌথ উদ্যোগ | Updated from Round 1. Correct. |
| content.js | Sarees for mothers — Durga Puja | মায়েদের জন্য শাড়ি — দুর্গাপূজা | Simple and natural. |
| content.js | one child gets warm clothing | এক শিশুর জন্য শীতবস্ত্র | Clean donation ladder item. |
| GetInvolved.jsx | Start a collaboration | চলুন একসাথে কাজ করি | Natural and inviting. |
| Contact.jsx | We'd love to hear from you. | আমরা আপনার কথা শুনতে চাই। | Direct and warm. |

---

## Priority Fix Order

Fix these first — highest visibility or highest impact on donor/volunteer trust:

1. **#15 — About page title** (`কমিউনিটিই`) — first thing a visitor reads on About
2. **#3 — Homepage heading** (`মাঠপর্যায়ে`) — prominent section heading on the homepage
3. **#8 — Fund chart label** (`প্রোগ্রাম সাপোর্ট`) — English in Bengali on the Impact page damages credibility
4. **#9 — Volunteer role** (`সোশ্যাল মিডিয়া`) — English in Bengali on a form dropdown
5. **#12 — Homepage stats** (`এক নজরে আমাদের প্রভাব`) — 'প্রভাব' flagged twice across both audits now
6. **#1–4 — All মাঠপর্যায় instances** — apply as a batch find-replace across content.js, Home.jsx, About.jsx

---

## Quick Find-Replace Reference

Use these to batch-fix the most common patterns:

| Find | Replace with | Pattern |
|---|---|---|
| মাঠপর্যায়ের কাজ | তৃণমূল পর্যায়ের কাজ | মাঠ-literal |
| মাঠপর্যায়ের স্বেচ্ছাসেবক | মাঠে-কাজের স্বেচ্ছাসেবক | মাঠ-literal |
| মাঠপর্যায়ে আমাদের কার্যক্রম | মানুষের দোরগোড়ায় আমাদের কাজ | মাঠ-literal |
| মাঠের কাজের গল্প | বাস্তব অভিজ্ঞতার গল্প | মাঠ-literal |
| প্রোগ্রাম সাপোর্ট | কর্মসূচি সহায়তা | english-in-bengali |
| সোশ্যাল মিডিয়া | সামাজিক মাধ্যম | english-in-bengali |
| টিমের এক ঝলক | আমাদের দলের এক ঝলক | english-in-bengali |
| কিশলয় কমিউনিটি | কিশলয়ের মানুষজন | english-in-bengali |
| বিতরণের দিন | দেওয়ার দিন | formal-register |
| সেবা প্রদান | সেবা পৌঁছে দেওয়া | formal-register |
| আয়োজন সমন্বয় | অনুষ্ঠান গোছানো | formal-register |
| ব্যবস্থাপনা | সামলানো | formal-register |

---

*Document prepared for Heritage of Hope Foundation development team — Round 2.*
*All suggestions aim to maintain a warm, spoken Bengali register consistent with how the NGO speaks to its community.*