# Heritage of Hope - Bilingual Text Audit (EN/BN)

Generated on: 2026-05-09
Scope: `web/src` (all places where English + Bengali options are explicitly defined)

## 1) Language System Setup

### 1.1 App-level language state
- File: `web/src/App.jsx`
- Language state is initialized as `en` and passed to layout/routes.

### 1.2 Translation helpers and bilingual object shape
- File: `web/src/content.js`
- `text(en, bn)` creates bilingual objects.
- `resolve(language, value)` returns `value[language]` with `en` fallback.

### 1.3 Language toggle UI labels
- File: `web/src/components/Layout.jsx`
- `navCopy.en.switchTo`: বাংলা
- `navCopy.bn.switchTo`: EN
- `navCopy.en.donate`: Donate Now
- `navCopy.bn.donate`: সহযোগিতার হাত বাড়িয়ে দিন

---

## 2) Shared Bilingual Content Source (`web/src/content.js`)

### 2.1 Navigation labels (`navItems`)
- Home | হোম
- About | আমাদের সম্পর্কে
- Our Work | কাজের ক্ষেত্র
- Impact | প্রভাব
- Gallery | গ্যালারি
- Get Involved | যুক্ত হোন
- Contact | যোগাযোগ

### 2.2 Featured programs (`featuredPrograms`)
1. Kishalaya Pathsala
- Category: Education | শিক্ষা
- Title: Kishalaya Pathsala | কিশলয় পাঠশালা
- Description: Community learning classes and study support for children in Kankandighi. | কঙ্কনদীঘির শিশুদের জন্য কমিউনিটি ক্লাস ও পড়াশোনার সহায়তা।
- Highlight: Foundational learning | ভিত্তিমূলক শিক্ষা

2. Free Health Camps
- Category: Healthcare | স্বাস্থ্য
- Title: Free Health Camps | বিনামূল্যের স্বাস্থ্য শিবির
- Description: Basic checkups, consultations, and referral help for families and children. | পরিবার ও শিশুদের জন্য প্রাথমিক পরীক্ষা, পরামর্শ ও রেফারেল সহায়তা।
- Highlight: Community first aid | কমিউনিটি ফার্স্ট এইড

3. Blood Donation Drives
- Category: Healthcare | স্বাস্থ্য
- Title: Blood Donation Drives | রক্তদান উদ্যোগ
- Description: Volunteer blood donation for thalassemia support and emergency care. | থ্যালাসেমিয়া সহায়তা ও জরুরি সেবার জন্য স্বেচ্ছায় রক্তদান।
- Highlight: Life-saving action | জীবনরক্ষাকারী উদ্যোগ

4. Winter Programme
- Category: Welfare | কল্যাণ
- Title: Winter Programme | শীতকালীন কর্মসূচি
- Description: Winter clothing, sweaters, and school bags for children in need. | প্রয়োজনীয় শিশুদের জন্য শীতের জামা, সোয়েটার ও স্কুল ব্যাগ।
- Highlight: Seasonal support | মৌসুমি সহায়তা

5. Monsoon Relief
- Category: Welfare | কল্যাণ
- Title: Monsoon Relief | বর্ষাকালীন সহায়তা
- Description: Raincoats, umbrellas, and essentials to keep school access steady. | শিক্ষায় বিঘ্ন না ঘটাতে রেনকোট, ছাতা ও জরুরি সামগ্রী প্রদান।
- Highlight: Education without interruption | বিঘ্নহীন শিক্ষা

6. Bornporichoy
- Category: Education | শিক্ষা
- Title: Bornporichoy | বর্ণপরিচয়
- Description: Early literacy sessions for children who need extra learning support. | অতিরিক্ত সহায়তা দরকার এমন শিশুদের জন্য প্রাথমিক সাক্ষরতা সেশন।
- Highlight: Reading support | পড়ার সহায়তা

### 2.3 Activity posts (`activityPosts`)
1. Winter Program 2026 | শীতকালীন কর্মসূচি ২০২৬
- Warm clothes and new school bags were distributed before the new school term started. | নতুন স্কুল শুরু হওয়ার আগে শিশুদের হাতে গরম জামা ও নতুন স্কুল ব্যাগ তুলে দেওয়া হয়।
- Location: Kankandighi, Raidighi | কঙ্কনদীঘি, রাইদীঘি

2. Durga Puja Dignity Drive | দুর্গাপূজা উপহার উদ্যোগ
- Children received new clothes while mothers received sarees and household sheets. | শিশুরা পেয়েছে নতুন জামা, মায়েরা পেয়েছে নতুন শাড়ি ও চাদর।
- Location: Kankandighi, Raidighi | কঙ্কনদীঘি, রাইদীঘি

3. Monsoon Protection Initiative | বর্ষা সুরক্ষা উদ্যোগ
- Raincoats and umbrellas helped families reach the learning space through the rainy season. | রেনকোট ও ছাতা বর্ষাকালেও পরিবারগুলিকে শিক্ষাকেন্দ্রে পৌঁছাতে সাহায্য করেছে।
- Location: Kishalaya community | কিশলয় কমিউনিটি

### 2.4 Facebook posts (`facebookPosts`)
1. Winter Program 2026 | শীতকালীন কর্মসূচি ২০২৬
- Warm clothes and school bags were distributed before the new term began. | নতুন সেশন শুরুর আগে শিশুদের গরম জামা ও স্কুল ব্যাগ দেওয়া হয়।

2. Durga Puja Gift Drive | দুর্গাপূজা উপহার উদ্যোগ
- With OCWE we distributed clothes, sarees, and sheets before Durga Puja. | OCWE-এর সহযোগিতায় দুর্গাপূজার আগে জামা, শাড়ি ও চাদর বিতরণ করা হয়।

3. Monsoon Relief Support | বর্ষার সহায়তা
- Raincoats and umbrellas helped children and families reach class in rain. | বৃষ্টিতেও ক্লাসে আসতে শিশু ও পরিবারকে রেনকোট ও ছাতা দেওয়া হয়।

4. Free Health Camp | বিনামূল্যের স্বাস্থ্য শিবির
- Free heart and sugar checkups were held with medical guidance support. | বিনামূল্যে হার্ট ও সুগার পরীক্ষা এবং চিকিৎসা পরামর্শ দেওয়া হয়।

5. Winter Clothing Distribution | শীতবস্ত্র বিতরণ
- Sweaters and warm shawls were shared with children and mothers. | শিশু ও মায়েদের মধ্যে সোয়েটার ও গরম শাল বিতরণ করা হয়।

6. Kishalaya Pathsala Launch | কিশলয় পাঠশালার সূচনা
- Our new learning space launched in Kankandighi with local support. | স্থানীয় সহযোগিতায় কঙ্কনদীঘিতে নতুন পাঠশালার সূচনা হয়।

### 2.5 Impact metrics (`impactMetrics`)
- children supported | শিশুর কাছে পৌঁছেছি আমরা
- health & education drives | স্বাস্থ্য ও শিক্ষা উদ্যোগ
- active partner organizations | সক্রিয় সহযোগী সংস্থা
- communities served | উপকৃত গ্রাম/এলাকা

### 2.6 Fund allocation (`fundAllocation`)
- Education | শিক্ষা
- Healthcare | স্বাস্থ্য
- Relief drives | মৌসুমি ত্রাণ সহায়তা
- Operations | পরিচালনা ব্যয়

### 2.7 Gallery items (`galleryItems`)
- Education | শিক্ষা
- Learning in Kishalaya | কিশলয়ে পাঠদান

- Healthcare | স্বাস্থ্য
- Free health camp | বিনামূল্যের স্বাস্থ্য শিবির

- Welfare | কল্যাণ
- Winter distribution | শীতকালীন বিতরণ

- Education | শিক্ষা
- Notebook distribution day | খাতা বিতরণের দিন

- Healthcare | স্বাস্থ্য
- Blood donation drive | রক্তদান কর্মসূচি

- Welfare | কল্যাণ
- Monsoon relief | বর্ষাকালীন সহায়তা

- Welfare | কল্যাণ
- Community feast by the river | নদীর ধারে সামাজিক ভোজ

- Education | শিক্ষা
- Students reading at Kishalaya | কিশলয়ে শিক্ষার্থীদের পঠনপাঠন

- Welfare | কল্যাণ
- Sarees for mothers — Durga Puja | মায়েদের জন্য শাড়ি — দুর্গাপূজা

- Welfare | কল্যাণ
- Durga Puja clothes for children | শিশুদের জন্য পূজার নতুন জামা

- Healthcare | স্বাস্থ্য
- Pre-donation health checkup | রক্তদানপূর্ব স্বাস্থ্য পরীক্ষা

- Welfare | কল্যাণ
- Children celebrating together | শিশুদের আনন্দ উদযাপন

### 2.8 Showcase image labels (`showcaseImages`)
- Children receiving winter support | শিশুদের শীতবস্ত্র প্রদান
- Health camp participation | স্বাস্থ্য শিবিরে অংশগ্রহণ
- Community registration and outreach | মানুষের পাশে, মানুষের সাথে
- Registration certificate | নিবন্ধন সনদ

### 2.9 Donation ladder (`donationSteps`)
- one child gets warm clothing | এক শিশুর জন্য শীতবস্ত্র
- learning materials for a month | এক মাসের শিক্ষা উপকরণ
- health outreach support | স্বাস্থ্যসেবা কার্যক্রমে সহায়তা
- sponsor a learning journey | একজনের শিক্ষার দায়িত্ব নিন

### 2.10 Volunteer roles (`volunteerRoles`)
- Teaching support | শিক্ষাদানে সহায়তা
- Event coordination | আয়োজন সমন্বয়
- Photography | ফটোগ্রাফি
- Social media | সোশ্যাল মিডিয়া
- Healthcare assistance | স্বাস্থ্যসেবায় সহায়তা

### 2.11 Partners (`partners`)
- OCWE | OCWE
- B.P. Poddar Hospital | B.P. Poddar Hospital
- Thalassaemic Guardians Association | Thalassaemic Guardians Association

### 2.12 Team members (`teamMembers`)
- Founder Team | প্রতিষ্ঠাতা সদস্য
- Community coordination and field programs | জনসংযোগ ও মাঠপর্যায়ের কাজ

- Program Support | প্রোগ্রাম সাপোর্ট
- Planning, logistics and volunteer support | পরিকল্পনা ও স্বেচ্ছাসেবক ব্যবস্থাপনা

- Field Volunteers | মাঠপর্যায়ের স্বেচ্ছাসেবক
- Direct service delivery and follow-up | সরাসরি সেবা প্রদান ও তদারকি

---

## 3) Page-wise and Section-wise Bilingual Definitions

## 3.1 Layout (`web/src/components/Layout.jsx`)
### Header
- Registered NGO | West Bengal | নিবন্ধিত সংস্থা | পশ্চিমবঙ্গ
- Language switch labels:
  - EN state button text: বাংলা
  - BN state button text: EN
- Donate CTA:
  - EN: Donate Now
  - BN: সহযোগিতার হাত বাড়িয়ে দিন
- Navigation labels pulled from `navItems` in `content.js`.

### Footer
- Children, women and communities in South 24 Parganas, West Bengal. | দক্ষিণ ২৪ পরগণার শিশু, নারী ও সম্প্রদায়ের পাশে আমরা কাজ করি।
- Follow us on Facebook | ফেসবুকে আমাদের সাথে যুক্ত থাকুন

## 3.2 Home (`web/src/pages/Home.jsx`)
### Hero copy object (`copy`)
- Lighting lives, one step at a time | সেবার আলোয় প্রতিটি পদক্ষেপে নতুন প্রাণের ছোঁয়া
- Education, healthcare and dignity for underserved communities. | প্রান্তিক মানুষের জন্য শিক্ষা, স্বাস্থ্য ও মর্যাদা।
- Heritage of Hope Foundation works across South 24 Parganas through learning spaces, health outreach and seasonal relief. | Heritage of Hope Foundation দক্ষিণ ২৪ পরগণায় শিক্ষাকেন্দ্র, স্বাস্থ্যসেবা ও মৌসুমি ত্রাণের মাধ্যমে কাজ করে।
- Empowering Communities | Registered NGO | মানুষের ক্ষমতায়ন | নিবন্ধিত সংস্থা
- Registered NGO | নিবন্ধিত সংস্থা
- Est. 2024 | প্রতিষ্ঠিত ২০২৪
- Govt. of West Bengal | পশ্চিমবঙ্গ সরকার
- Support a Program | আমাদের কর্মসূচিতে সাহায্য করুন
- Explore Our Work | আমাদের কাজ দেখুন
- Our footprint so far | আমাদের কাজের পরিধি
- Mission pillars | মূল লক্ষ্য
- From the Facebook timeline | ফেসবুকের পাতা থেকে
- Your small gift creates big change. | আপনার ছোট অনুদান বড় পরিবর্তন আনতে পারে।
- Even small support helps us keep classes running, respond to health needs and serve families with dignity. | সামান্য সাহায্যও আমাদের শিক্ষাকেন্দ্রগুলি সচল রাখতে, স্বাস্থ্যের প্রয়োজন মেটাতে এবং মানুষের পাশে মর্যাদার সঙ্গে দাঁড়াতে সাহায্য করে।

### Hero and other section strings
- Kishalaya Pathsala, Kankandighi | Community learning moment | কিশলয় পাঠশালা, কঙ্কনদীঘি | শিক্ষার আনন্দময় মুহূর্ত
- Registration proof available on About page | নিবন্ধন সংক্রান্ত প্রমাণ 'আমাদের সম্পর্কে' পাতায় দেখুন
- Donate | অনুদান
- Registration certificate preview | নিবন্ধন সনদের ঝলক
- Impact snapshot | এক নজরে আমাদের প্রভাব
- What we do on the ground | মাঠপর্যায়ে আমাদের কার্যক্রম
- Stories, updates and event photos | সাফল্যের গল্প, সংবাদ ও অনুষ্ঠানের ছবি
- Donate now | আজই সাহায্যের হাত বাড়িয়ে দিন

### Home sections using shared bilingual datasets
- Impact snapshot cards: `impactMetrics`
- Mission pillars cards: `featuredPrograms`
- Facebook timeline cards: `facebookPosts`
- Photo mosaic captions: `showcaseImages`

## 3.3 About (`web/src/pages/About.jsx`)
### Intro/story copy object (`copy`)
- Rooted in community. Driven by impact. | কমিউনিটিই আমাদের ভিত্তি। সেবার মাধ্যমেই আমাদের পথচলা।
- We work directly with the people we serve, ensuring every initiative brings lasting, positive change. | আমরা যাদের সেবা করি তাদের সাথে সরাসরি কাজ করি, নিশ্চিত করে যে প্রতিটি উদ্যোগ স্থায়ী ও ইতিবাচক পরিবর্তন নিয়ে আসে।
- Mission | আমাদের লক্ষ্য
- Vision | ভবিষ্যত পরিকল্পনা
- Core values | আমাদের আদর্শ
- Legally registered and transparent | আইনগতভাবে নিবন্ধিত ও স্বচ্ছ
- Our story | আমাদের গল্প
- The foundation began from direct work with children and women in underserved areas. | শিশু ও নারীদের সঙ্গে সরাসরি কাজের অভিজ্ঞতা থেকেই ফাউন্ডেশনের শুরু।

### Values and section strings
- Compassion | সহানুভূতি
- Transparency | স্বচ্ছতা
- Community | জনসেবা
- Empowerment | ক্ষমতায়ন
- Grounded in field realities | বাস্তব অভিজ্ঞতার ভিত্তিতে পথচলা
- Improve lives through education, healthcare, and basic support. | শিক্ষা, স্বাস্থ্যসেবা ও জরুরি সহায়তার মাধ্যমে মানুষের জীবনযাত্রার মান উন্নত করা।
- A Bengal where every child can learn and live with dignity. | এমন এক বাংলা, যেখানে প্রতিটি শিশু শিক্ষা ও মর্যাদার সঙ্গে বেড়ে উঠবে।
- How we work | আমরা কীভাবে কাজ করি
- Each program is built on local trust and measurable impact. | আমাদের প্রতিটি উদ্যোগ স্থানীয় মানুষের আস্থা ও কাজের স্বচ্ছতার ওপর ভিত্তি করে পরিচালিত হয়।
- Registration and accountability | নিবন্ধন ও জবাবদিহিতা
- Heritage of Hope Foundation is a registered NGO committed to transparency and dedicated service in West Bengal. | হেরিটেজ অফ হোপ ফাউন্ডেশন একটি নিবন্ধিত এনজিও, যা পশ্চিমবঙ্গে স্বচ্ছতা ও নিবেদিত সেবার মাধ্যমে কাজ করছে।
- Team snapshot | আমাদের টিমের এক ঝলক
- About | আমাদের সম্পর্কে

### About sections using shared bilingual datasets
- Partner chips: `partners`
- Team cards: `teamMembers`

## 3.4 Our Work (`web/src/pages/OurWork.jsx`)
### Intro copy object (`copy`)
- Initiatives designed for real-world impact. | আমাদের প্রতিটি উদ্যোগ বাস্তব পরিবর্তনের লক্ষ্যে পরিকল্পিত।
- Our active programs focus on education, healthcare, and community welfare to bring comprehensive support to those who need it most. | শিক্ষা, স্বাস্থ্যসেবা ও সমাজকল্যাণ—এই তিন ক্ষেত্রকেই আমরা গুরুত্ব দিই, যাতে প্রান্তিক মানুষের কাছে আমরা প্রকৃত সাহায্য পৌঁছে দিতে পারি।

### Section strings
- Education | Healthcare | Welfare | শিক্ষা | স্বাস্থ্য | কল্যাণ
- Our Approach | আমাদের দৃষ্টিভঙ্গি
- How we execute programs | কীভাবে আমরা কর্মসূচি বাস্তবায়ন করি
- Identify community needs | স্থানীয় চাহিদা যাচাই
- Collaborate with local partners | স্থানীয় মানুষদের সাথে যৌথ উদ্যোগ
- Execute program and track impact | কাজের বাস্তবায়ন ও অগ্রগতি পর্যবেক্ষণ
- Provide ongoing support and review | ধারাবাহিক সেবা ও মূল্যায়ন
- Join the mission | আমাদের উদ্যোগে সামিল হোন
- By partnering with us or volunteering, you help us bring these programs to life in underserved communities. | আমাদের সাথে যুক্ত হয়ে আপনিও প্রান্তিক মানুষের কাছে এই সেবাগুলো পৌঁছে দিতে পারেন।
- Support this work | আমাদের এই প্রচেষ্টায় সাহায্য করুন

### Our Work sections using shared bilingual datasets
- Program cards: `featuredPrograms`

## 3.5 Impact (`web/src/pages/Impact.jsx`)
### Intro copy object (`copy`)
- Transparency and measurable change. | স্বচ্ছতা এবং পরিমাপযোগ্য পরিবর্তন।
- Explore the numbers and stories that showcase the direct results of our community-driven approach. | আমাদের সমাজসেবামূলক কাজের বাস্তব ফলাফল ও মানুষের বদলে যাওয়ার গল্পগুলো দেখুন।

### Section strings
- Impact | প্রভাব
- Our Promise | আমাদের প্রতিশ্রুতি
- Accountability to our donors and community. | দাতাদের প্রতি স্বচ্ছতা ও মানুষের প্রতি আমাদের দায়িত্ববোধ।
- Fund utilization | তহবিলের ব্যবহার
- How support is used | আপনাদের সাহায্য কীভাবে ব্যবহৃত হয়
- Community Feedback | কমিউনিটির মতামত
- "Thanks to Kishalaya Pathsala and the Foundation, our children receive dedicated guidance and winter support that keeps them learning year-round." | "কিশলয় পাঠশালা ও ফাউন্ডেশনের কারণে আমাদের ছেলেমেয়েরা যত্নশীল শিক্ষা ও শীতের সহায়তা পাচ্ছে, যা তাদের সারা বছর পড়াশোনায় যুক্ত রাখে।"
- Annual report | বার্ষিক প্রতিবেদন
- Our 2025-2026 Impact Report is currently being compiled and will be available for download soon. | ২০২৫-২৬ সালের কাজের বার্ষিক প্রতিবেদন তৈরির কাজ চলছে, শীঘ্রই এখানে দেখতে পাবেন।

### Impact sections using shared bilingual datasets
- Metric cards: `impactMetrics`
- Fund bars: `fundAllocation`

## 3.6 Gallery (`web/src/pages/Gallery.jsx`)
### Intro copy object (`copy`)
- Moments of hope and action. | আমাদের সমাজসেবামূলক কাজের কিছু বিশেষ মুহূর্ত।
- A visual journey through our health camps, learning centers, and community outreach events. | আমাদের স্বাস্থ্য শিবির, শিক্ষাকেন্দ্র এবং বিভিন্ন সামাজিক অনুষ্ঠানের কিছু খণ্ডচিত্র।

### Filter and helper strings
- All | সব
- Education | শিক্ষা
- Healthcare | স্বাস্থ্য
- Welfare | কল্যাণ
- Explore | ঘুরে দেখুন
- Filter photos by our core impact areas. | বিভাগ অনুযায়ী ছবিগুলো দেখুন।

### Gallery cards using shared bilingual dataset
- Card title + category: `galleryItems`

## 3.7 Get Involved (`web/src/pages/GetInvolved.jsx`)
### Intro/QR copy object (`copy`)
- Join us in making a difference. | পরিবর্তন আনতে আমাদের সাথে যোগ দিন।
- Whether through donations, volunteering, or partnerships, your involvement drives our mission forward. | অনুদান, স্বেচ্ছাসেবা বা অংশীদারিত্ব—আপনার অংশগ্রহণ আমাদের লক্ষ্য পূরণে সহায়ক।
- Scan to donate | স্ক্যান করে অনুদান দিন
- Use this demo UPI QR code to make a quick contribution. You can also use the bank details above for direct transfers. | ডেমো ইউপিআই কিউআর কোড স্ক্যান করে দ্রুত অনুদান দিতে পারেন। সরাসরি ট্রান্সফারের জন্য উপরের ব্যাংক তথ্যও ব্যবহার করতে পারেন।

### Donation + volunteer + partner strings
- Donation ladder | অনুদান ও তার প্রভাব
- What your support can do | আপনার সহায়তা কী করতে পারে
- UPI payment | ইউপিআই পেমেন্ট
- Demo UPI QR code for donations | অনুদানের জন্য ডেমো ইউপিআই কিউআর কোড
- Volunteer | স্বেচ্ছাসেবা
- People matter more than perfection | মানুষ নিখুঁততার চেয়ে বেশি গুরুত্বপূর্ণ
- Support field execution, coordination, and regular follow-up. | মাঠের কাজ, সমন্বয় ও নিয়মিত ফলো-আপে সহায়তা করুন।
- Volunteer form | স্বেচ্ছাসেবক হিসেবে যোগদানের ফর্ম
- Join the team | টিমে যোগ দিন
- Name | নাম
- Email | ইমেল
- Phone | ফোন
- Area of interest | আগ্রহের ক্ষেত্র
- Choose one | একটি বেছে নিন
- Availability | সময় দেওয়ার সুযোগ
- Weekends | ছুটির দিনে
- Weekdays | কাজের দিনে
- Occasionally | মাঝে মাঝে
- Message | বার্তা
- Submit volunteer interest | স্বেচ্ছাসেবক হিসেবে আবেদন করুন
- Partner with us | আমাদের উদ্যোগের সঙ্গী হোন
- For CSR, hospitals and institutions | CSR, হাসপাতাল ও অন্যান্য প্রতিষ্ঠানের জন্য
- Bank details | ব্যাংক তথ্য
- Partnerships help scale learning spaces, health camps, and seasonal support. | যৌথ উদ্যোগে আমরা আরও বেশি মানুষের কাছে শিক্ষা ও স্বাস্থ্যসেবা পৌঁছে দিতে পারি।
- Partnership-led community outreach activity by Heritage of Hope Foundation | হেরিটেজ অফ হোপ ফাউন্ডেশনের অংশীদারিত্বভিত্তিক কমিউনিটি আউটরিচ কার্যক্রম
- Partnerships help us scale education, healthcare, and seasonal welfare with accountability. | অংশীদারিত্বের মাধ্যমে আমরা জবাবদিহিতার সাথে শিক্ষা, স্বাস্থ্যসেবা ও মৌসুমি সহায়তা আরও বিস্তৃত করতে পারি।
- Partner inquiry | অংশীদারিত্বের জন্য যোগাযোগ
- Start a collaboration | সহযোগিতার হাত বাড়িয়ে দিন
- Organization name | সংস্থার নাম
- Contact person | যোগাযোগের জন্য ব্যক্তির নাম
- Phone | ফোন নম্বর
- Type of partnership | অংশীদারিত্বের ধরন
- Submit partner inquiry | অংশীদার হিসেবে যোগাযোগ করুন

### Get Involved sections using shared bilingual datasets
- Donation ladder cards: `donationSteps`
- Volunteer role cards/select options: `volunteerRoles`

## 3.8 Contact (`web/src/pages/Contact.jsx`)
### Intro copy object (`copy`)
- We’d love to hear from you. | আমরা আপনার কথা শুনতে চাই।
- Reach out to us for inquiries, partnerships, or just to say hello. | যেকোনো তথ্যের জন্য বা আমাদের কাজের অংশীদার হতে নির্দ্বিধায় যোগাযোগ করুন।

### Contact page strings
- Contact | যোগাযোগ
- Response time | উত্তর দেওয়ার সময়
- Usually within 2 business days | সাধারণত ২ কর্মদিবসের মধ্যে
- Phone | ফোন নম্বর
- Email | ইমেল
- Address | ঠিকানা
- Contact form | যোগাযোগের ফর্ম
- Send us a direct message | আমাদের সরাসরি লিখুন
- Name | নাম
- Your name | আপনার নাম
- Subject | বিষয়
- Message | বার্তা
- Tell us how you want to help | আপনার বার্তার বিস্তারিত এখানে লিখুন
- Send message | বার্তা পাঠান
- Featured from Facebook | ফেসবুকের বিশেষ মুহূর্ত
- Recent moments from the page | পেজের সাম্প্রতিক মুহূর্ত
- Visit Official Facebook Page | অফিসিয়াল ফেসবুক পেজ দেখুন

### Contact sections using shared bilingual datasets
- Facebook cards: `facebookPosts` (slice 3-6)
- Photo mosaic captions: `showcaseImages`

## 3.9 Not Found (`web/src/pages/NotFound.jsx`)
- Page not found | পেজ পাওয়া যায়নি
- Return to the homepage to continue exploring. | আমাদের প্রধান পাতায় ফিরে যান।
- Go home | মূল পাতায় ফিরে যান

## 3.10 Thank You (`web/src/pages/ThankYou.jsx`)
- Submission received | আপনার বার্তাটি আমরা পেয়েছি
- Thank you for reaching out. | যোগাযোগ করার জন্য ধন্যবাদ।
- We will review your message and respond as soon as possible. | আমরা আপনার বার্তার গুরুত্ব বুঝে দ্রুতই আপনার সাথে যোগাযোগ করব।
- Return home | মূল পাতায় ফিরে যান

---

## 4) Notes

- This document includes all explicit EN/BN instances found via:
  - `text(en, bn)` definitions
  - local `copy.en` and `copy.bn` objects
  - local `navCopy.en` and `navCopy.bn` objects
- Hardcoded strings that are not defined with two-language alternatives (for example some aria-labels, image alt text, static metadata labels, and non-localized option values) are intentionally excluded from this bilingual-only inventory.
