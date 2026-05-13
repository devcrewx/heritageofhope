# Web3Forms Setup Instructions

## Step 1: Register & Get Access Key

1. Visit [https://web3forms.com/](https://web3forms.com/)
2. Click "Get Started" or "Sign Up"
3. Enter your email: **devcrewx@gmail.com**
4. Verify the email (check inbox)
5. Once verified, you'll see your **Access Key** on the dashboard
6. Copy the access key

## Step 2: Set Environment Variable

In `/home/DevCrewX/Projects/heritageofhope/web/.env` (create if doesn't exist):

```
VITE_WEB3FORMS_ACCESS_KEY=your_access_key_here
```

Replace `your_access_key_here` with the actual key from Web3Forms.

## Step 3: Email Configuration

All form submissions will go to: **devcrewx@gmail.com**

To change later to NGO email:
- Update `TO_EMAIL` in the form submission code
- Or configure in Web3Forms dashboard

## Step 4: Testing

1. Fill out a form on the website
2. Submit
3. You should receive an email at devcrewx@gmail.com
4. Check spam/promotions folder if not in inbox

## Forms Configured

- **Contact Form** → /contact page → Email: devcrewx@gmail.com
- **Volunteer Form** → /get-involved page → Email: devcrewx@gmail.com
- **Partner Inquiry Form** → /get-involved page → Email: devcrewx@gmail.com

All redirect to `/thank-you` page after submission.

---

## Web3Forms Features Enabled

✅ CAPTCHA spam protection (included free)
✅ 30-day submission storage
✅ Custom redirect to thank-you page
✅ Unlimited submissions
✅ Direct email delivery

---

## Future: Switch to NGO Email

Once you have the NGO email:
1. Add new verified email to Web3Forms account
2. Update `TO_EMAIL` in form submissions
3. Redeploy

Or create a separate Web3Forms access key for the NGO email.
