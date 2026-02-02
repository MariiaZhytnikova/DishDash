# Backend Deployment Guide

## Current Issue
The deployed backend on Fly.io is **missing the email endpoint** (`/shopping/email`), causing 404 errors when users try to send shopping lists via email.

## Solution
Deploy the latest `main` branch which includes the merged email feature from PRs #27 and #28.

## Deployment Steps

### 1. Install Fly CLI (if not already installed)
```bash
brew install flyctl
# or
curl -L https://fly.io/install.sh | sh
```

### 2. Login to Fly.io
```bash
flyctl auth login
```

### 3. Navigate to backend directory
```bash
cd backend
```

### 4. Verify you're on main branch with latest changes
```bash
git checkout main
git pull origin main
grep "shopping/email" main.go  # Should show line 50 with the endpoint
```

### 5. Deploy to Fly.io
```bash
flyctl deploy
```

This will:
- Build the Go application
- Create a Docker image
- Deploy to https://backend-ancient-waterfall-8399.fly.dev
- Should take 2-5 minutes

### 6. Configure SMTP Secrets
After deployment, set the email configuration:

```bash
flyctl secrets set SMTP_ADDR=smtp.gmail.com:587
flyctl secrets set SMTP_HOST=smtp.gmail.com
flyctl secrets set SMTP_USER=dishdash.tool@gmail.com
flyctl secrets set SMTP_PASS=zemohnllktfvqgtu
flyctl secrets set SMTP_FROM=dishdash.tool@gmail.com
```

**Note:** Setting secrets will trigger an automatic restart of the app.

### 7. Verify Deployment
Test the email endpoint:
```bash
curl -X POST https://backend-ancient-waterfall-8399.fly.dev/shopping/email \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","items":[]}'
```

Expected response: `200 OK` or error message (not 404)

Test health endpoint:
```bash
curl https://backend-ancient-waterfall-8399.fly.dev/health
```

Expected: `{"status":"ok"}`

## Troubleshooting

### If deployment fails:
- Check `fly.toml` exists in backend directory
- Verify you're logged in: `flyctl auth whoami`
- Check app exists: `flyctl apps list`

### If email still returns 404:
- Verify main branch has the endpoint: `grep shopping/email main.go`
- Check deployment logs: `flyctl logs`
- Verify app is running: `flyctl status`

### If email returns 500:
- Check secrets are set: `flyctl secrets list`
- Check logs for SMTP errors: `flyctl logs`

## Security Note
⚠️ The Gmail app password `zemohnllktfvqgtu` is now exposed in documentation files. After successful deployment and testing, consider:
1. Rotating the Gmail app password
2. Updating the secret: `flyctl secrets set SMTP_PASS=<new_password>`
3. Removing the password from documentation files

## Files Modified
- `EMAIL_BUG_FIX.md` - Detailed bug analysis and fix explanation
- `QUICK_FIX_SMTP.md` - Quick reference for SMTP configuration
- This file - Deployment instructions

## Commits Included
- PR #27 (ec07810): fix: smtp conf and msg body for email send
- PR #28 (d6c55b9): fix: remove double log of server, change formatting of email msg

## Current Status
- ✅ Code merged to main branch
- ✅ Local .env configured
- ❌ **Backend needs deployment**
- ❌ **SMTP secrets need to be set on Fly.io**
