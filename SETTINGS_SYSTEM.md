# Site Settings System Documentation

## Overview

The Heritage of Hope admin panel includes a comprehensive site settings system that allows administrators to manage all organization-related information from a single, user-friendly interface.

## Features

### 1. Organization Information Management
- **Organization Name**: The official name of the organization
- **Phone**: Primary contact phone number
- **Email**: Primary contact email address  
- **Address**: Full organization office address
- **Establishment Year**: When the organization was founded
- **Registered Badge/Number**: Official registration or license number

### 2. Social & Web Presence
- **Facebook URL**: Link to official Facebook page
- Additional social links can be easily added (Twitter, Instagram, LinkedIn, etc.)

### 3. Homepage Content
- **Navbar Subtitle**: Tagline displayed in the site navigation
- **Footer Mission Statement**: Organization mission text shown in the footer

## How to Use

### Accessing Settings
1. Log in as an administrator
2. Navigate to **Admin Dashboard**
3. Click on **Settings** in the sidebar
4. All available settings are displayed in organized fieldsets

### Updating Settings
1. Modify any field you need to update
2. Leave fields blank if you don't want to change them
3. Click **Save Settings** to store changes
4. You'll see a confirmation message showing how many settings were updated

### Best Practices
- Keep organization name consistent across all platforms
- Ensure phone and email are current and monitored
- Update the address if your office location changes
- Keep mission statement concise but impactful (under 500 characters recommended)
- Verify external URLs (Facebook, etc.) work correctly before saving

## Technical Details

### Database Schema
Settings are stored in the `SiteContent` table with the following structure:
- `page`: Always "settings" for site settings
- `section`: "org" for organization settings
- `fieldKey`: The setting identifier (e.g., "phone", "email")
- `valueEn`: English value
- `valueBn`: Bengali value (for future multilingual support)
- `createdAt`/`updatedAt`: Timestamps

### API Endpoints

#### Get All Settings
```
GET /api/admin/settings
```

**Response:**
```json
{
  "success": true,
  "data": {
    "phone": {
      "en": "+88 (0) 171 234 5678",
      "bn": null
    },
    "email": {
      "en": "contact@heritageofhope.org",
      "bn": null
    }
  }
}
```

#### Update Settings
```
PATCH /api/admin/settings
```

**Request Body:**
```json
{
  "orgName": "Heritage of Hope",
  "phone": "+88 (0) 171 234 5678",
  "email": "contact@heritageofhope.org",
  "address": "123 Main Street, Dhaka, Bangladesh"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orgName": "Heritage of Hope",
    "phone": "+88 (0) 171 234 5678",
    "email": "contact@heritageofhope.org",
    "address": "123 Main Street, Dhaka, Bangladesh"
  }
}
```

#### Get Specific Setting
```
GET /api/admin/settings/:key
```

**Example:** `GET /api/admin/settings/phone`

**Response:**
```json
{
  "success": true,
  "data": {
    "key": "phone",
    "en": "+88 (0) 171 234 5678",
    "bn": null
  }
}
```

### Frontend Integration

The settings page automatically:
- Loads all current settings when the page opens
- Validates input (email format, URL format, length limits)
- Shows a toast notification on success/failure
- Provides a "Reload" button to revert unsaved changes
- Disables the save button while processing

### Validation Rules

| Field | Validation | Max Length |
|-------|-----------|-----------|
| Organization Name | 2-200 characters | 200 |
| Phone | 5-20 characters | 20 |
| Email | Valid email format | unlimited |
| Address | 10-500 characters | 500 |
| Facebook URL | Valid URL format | unlimited |
| Registered Badge | Any text | 100 |
| Est. Year | Any text | 50 |
| Navbar Subtitle | Any text | 200 |
| Footer Mission | Any text | 500 |

## Future Enhancements

1. **Multilingual Support**
   - Add fields for Bengali translations of all settings
   - Toggle between English/Bengali on the frontend

2. **Additional Settings**
   - Operating hours
   - Office address with Google Maps integration
   - Multiple phone numbers and emails
   - More social media profiles
   - Organization logo/branding colors

3. **Settings Categories**
   - Separate pages for different setting types
   - Settings versioning and change history
   - Template-based settings for consistency

4. **Backup & Recovery**
   - Export settings as JSON
   - Import settings from JSON
   - Settings rollback to previous versions

## Troubleshooting

### Settings Not Saving
- Check that you have admin permissions
- Verify all fields pass validation
- Check browser console for error messages
- Try reloading the page and retrying

### Settings Not Displaying on Frontend
- Clear browser cache
- Verify settings were actually saved
- Check that the frontend is using the correct API endpoint
- Review frontend component props and data binding

### Validation Errors
- Email must be in valid format: `user@example.com`
- URLs must start with `http://` or `https://`
- Phone numbers should be 5-20 characters
- Address should be at least 10 characters

## Audit Trail

All settings changes are logged in the `AuditLog` table with:
- Admin ID who made the change
- Action type: `UPDATE_SETTINGS`
- Timestamp of the change
- Note about which settings were modified

These logs help track who changed what and when for compliance and oversight.
