# MAVEK BCS - Namecheap cPanel Node.js Deployment Guide

## Overview

This guide walks you through deploying the MAVEK BCS application to Namecheap Shared Hosting with Node.js support.

**Prerequisites:**
- Namecheap Shared Hosting account (Stellar/Stellar Plus/Stellar Business)
- cPanel access
- Domain: `mavekbcs.com`
- MySQL database already set up on Namecheap

---

## Step 1: Prepare the Deployment Package

This ZIP file contains:
- ✅ `dist/` - Compiled frontend and backend
- ✅ `package.json` - Dependencies list
- ✅ `pnpm-lock.yaml` - Locked dependency versions
- ✅ `node_modules/` - Pre-installed dependencies (if included)
- ✅ `.env.example` - Environment variables template

---

## Step 2: Upload to Namecheap

### 2.1 Access cPanel

1. Log in to Namecheap account
2. Go to **Hosting** → **Manage**
3. Click **cPanel** button
4. Log in with your cPanel credentials

### 2.2 Upload Files via File Manager

1. In cPanel, click **File Manager**
2. Navigate to **public_html** folder
3. Click **Upload** button
4. Select the `mavek-bcs.zip` file
5. Wait for upload to complete
6. Right-click on ZIP file → **Extract**
7. Confirm extraction to `public_html/mavek-bcs/`

### 2.3 Alternative: Upload via SFTP

If File Manager is slow:

```bash
# Using SFTP client (FileZilla, WinSCP, etc.)
Host: ftp.mavekbcs.com
Username: cpanel_username
Password: cpanel_password
Port: 22 (SFTP)

# Upload to: /home/username/public_html/mavek-bcs/
```

---

## Step 3: Set Up Node.js App in cPanel

### 3.1 Create Node.js Application

1. In cPanel, search for **"Setup Node.js App"**
2. Click **Create Application**
3. Fill in the following:

| Field | Value |
|-------|-------|
| **Node.js Version** | 20 or 22 (latest stable) |
| **Application Root** | `/home/username/public_html/mavek-bcs` |
| **Application URL** | `mavekbcs.com` (or `www.mavekbcs.com`) |
| **Application Startup File** | `dist/index.js` |
| **Passenger log file** | `/home/username/logs/mavek-bcs.log` |

4. Click **Create**

### 3.2 Set Environment Variables

After creating the app:

1. Click the **gear icon** next to your app
2. Scroll to **Environment Variables** section
3. Add the following variables:

```
DATABASE_URL=mysql://username:password@localhost:3306/mavekbcs_db
JWT_SECRET=your_secure_random_string_here
NODE_ENV=production
VITE_APP_TITLE=MAVEK BCS
VITE_APP_LOGO=https://mavekbcs.com/logo.png
```

4. Save changes

---

## Step 4: Configure Database Connection

### 4.1 Get MySQL Credentials from Namecheap

1. In cPanel, click **MySQL Databases**
2. Find your database and note:
   - **Database Name**: `mavekbcs_db`
   - **Username**: Your MySQL user
   - **Password**: Your MySQL password
   - **Hostname**: Usually `localhost` or `127.0.0.1`

### 4.2 Update DATABASE_URL

In Node.js App settings, update:

```
DATABASE_URL=mysql://username:password@localhost:3306/mavekbcs_db
```

Replace:
- `username` - Your MySQL username
- `password` - Your MySQL password
- `mavekbcs_db` - Your database name

---

## Step 5: Configure Domain & SSL

### 5.1 Point Domain to Namecheap

1. In Namecheap, go to **Domain List** → **mavekbcs.com**
2. Click **Manage**
3. Go to **Nameservers** tab
4. Set to Namecheap nameservers:
   - `ns1.namecheap.com`
   - `ns2.namecheap.com`
   - `ns3.namecheap.com`
   - `ns4.namecheap.com`

### 5.2 Enable SSL Certificate

1. In cPanel, click **AutoSSL** or **SSL/TLS**
2. Install SSL certificate for `mavekbcs.com`
3. Wait for certificate to be issued (usually 5-30 minutes)

### 5.3 Force HTTPS

1. In cPanel, click **Domains**
2. Find `mavekbcs.com`
3. Enable **Force HTTPS Redirect**

---

## Step 6: Configure Email (Zoho Mail)

### 6.1 Add MX Records

1. In Namecheap, go to **Domain** → **Advanced DNS**
2. Add Zoho Mail MX records:

| Type | Host | Value | Priority |
|------|------|-------|----------|
| MX | @ | mx.zoho.com | 10 |
| MX | @ | mx2.zoho.com | 20 |
| MX | @ | mx3.zoho.com | 30 |

3. Add SPF record:

```
TXT @ v=spf1 include:zoho.com ~all
```

4. Add DKIM record (from Zoho Mail settings)

### 6.2 Test Email

1. Go to Zoho Mail: https://mail.zoho.com
2. Log in with your email
3. Send a test email to verify

---

## Step 7: Verify Deployment

### 7.1 Check Application Status

1. In cPanel, go to **Setup Node.js App**
2. Your app should show **Running** status
3. Click **Restart** if needed

### 7.2 Test Website

1. Open browser: `https://mavekbcs.com`
2. Check if homepage loads
3. Test login functionality
4. Check database connectivity

### 7.3 Check Logs

If app doesn't work:

1. In cPanel, click **Setup Node.js App**
2. Click **gear icon** → **View Logs**
3. Check `/home/username/logs/mavek-bcs.log` for errors

---

## Step 8: Troubleshooting

### Issue: "Application not running"

**Solution:**
1. Check Node.js version compatibility
2. Verify `dist/index.js` exists
3. Check environment variables are set
4. Restart the application

### Issue: "Database connection failed"

**Solution:**
1. Verify DATABASE_URL format
2. Check MySQL username/password
3. Ensure database exists
4. Test connection in cPanel MySQL section

### Issue: "Port already in use"

**Solution:**
1. Restart Node.js app
2. Check if another app is using same port
3. Contact Namecheap support

### Issue: "SSL certificate not working"

**Solution:**
1. Wait 30 minutes for certificate to be issued
2. Clear browser cache
3. Try accessing with `https://`
4. Check AutoSSL status in cPanel

---

## Step 9: Maintenance

### Update Application

1. Build new version locally:
   ```bash
   pnpm run build
   ```

2. Create new ZIP with `dist/` folder

3. Upload to Namecheap via File Manager

4. Extract and replace old files

5. Restart Node.js app in cPanel

### Monitor Performance

1. Check cPanel Resource Usage
2. Monitor database performance
3. Review application logs regularly
4. Set up email alerts for errors

---

## Support

- **Namecheap Support**: https://support.namecheap.com
- **Node.js Docs**: https://nodejs.org/docs
- **cPanel Docs**: https://documentation.cpanel.net

---

## Quick Reference

| Item | Value |
|------|-------|
| Domain | `mavekbcs.com` |
| Startup File | `dist/index.js` |
| Node Version | 20 or 22 |
| Database | MySQL on Namecheap |
| Email | Zoho Mail |
| SSL | AutoSSL (free) |

---

**Last Updated:** July 9, 2026
