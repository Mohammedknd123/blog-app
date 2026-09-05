# Critical Configuration for Deployed Backend

## Issue: Password Reset & Email Links Not Working

The backend needs to know the correct frontend URL to generate email verification and password reset links.

### Steps to Fix:

1. **Go to your Render Dashboard**
   - Open https://dashboard.render.com
   - Find your backend service (likely named `blog-app-*`)

2. **Add Environment Variables:**
   - Click on your backend service
   - Go to **Settings** → **Environment**
   - Add these environment variables:

   ```
   CLIENT_DOMAIN=https://blog-app-frontend-699o.onrender.com
   ```

   **Important:** No trailing slash! Use exactly: `https://blog-app-frontend-699o.onrender.com`

3. **Save and Redeploy**
   - Click **Save Changes**
   - The service will automatically redeploy with the new environment variables

### Verify Email Credentials Are Set:

Make sure these environment variables are also set on Render:

- `APP_EMAIL_ADDRESS` - Your Gmail address
- `APP_EMAIL_PASSWORD` - Your Gmail App Password (not regular password)

**For Gmail App Password:**

1. Go to https://myaccount.google.com/apppasswords
2. Select Mail and Windows (or other device)
3. Copy the generated 16-character password
4. Use this as `APP_EMAIL_PASSWORD` in Render

### After Configuration:

- Registration will now properly send verification emails and show success popup
- Password reset links will work correctly and point to your deployed frontend
- All email notifications will be reliably delivered

## Testing:

1. Try registering a new account - you should get a success popup
2. Check your email for verification link
3. Test forgot password - link should be clickable and valid
