# Render Deployment Guide

## 🚀 Quick Start

### Prerequisites
1. **MongoDB Atlas Account** - You need a cloud MongoDB database
2. **GitHub Repository** - Your code should be on GitHub
3. **Render Account** - Sign up at https://render.com

---

## 📋 Step-by-Step Deployment

### Step 1: Set Up MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create a database user with username and password
4. Whitelist all IP addresses (0.0.0.0/0) for free tier
5. Get your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/student_profiling
   ```

### Step 2: Push Code to GitHub

```bash
cd c:\New-Itew\project-itew
git init
git add .
git commit -m "Initial commit for Render deployment"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 3: Create Render Web Service

1. Go to https://dashboard.render.com
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure the service:

   **Service Settings:**
   - **Name:** `ccs-profiling-backend`
   - **Region:** Oregon (or closest to your users)
   - **Branch:** `main`
   - **Root Directory:** Leave blank (or `project-itew` if repo root is different)
   - **Runtime:** `Docker`
   - **Docker Command:** Leave blank
   - **Plan:** Free

### Step 4: Configure Environment Variables

In Render dashboard, add these environment variables:

| Variable | Value | Notes |
|----------|-------|-------|
| `APP_NAME` | `CCS_Profiling_System` | |
| `APP_ENV` | `production` | |
| `APP_KEY` | **Generate new** | See below |
| `APP_DEBUG` | `false` | **Never true in production** |
| `APP_URL` | Auto-set by Render | From Render service URL |
| `DB_CONNECTION` | `mongodb` | |
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/student_profiling` | **Your MongoDB Atlas URI** |
| `DB_DATABASE` | `student_profiling` | |
| `RUN_MIGRATIONS` | `true` | Run on deployment |
| `RUN_SEED` | `false` | Set to true only if needed |
| `CACHE_DRIVER` | `file` | |
| `SESSION_DRIVER` | `cookie` | |
| `LOG_CHANNEL` | `stderr` | For Render logs |

#### Generate APP_KEY

Run locally:
```bash
php artisan key:generate --show
```

Copy the output (looks like: `base64:xxxxxxxxxxxxx`) and paste it into Render's `APP_KEY` field.

### Step 5: Deploy

1. Click **Create Web Service**
2. Render will:
   - Pull your code from GitHub
   - Build the Docker image
   - Run migrations (if `RUN_MIGRATIONS=true`)
   - Start the application

3. Monitor the logs in Render dashboard

---

## 🔧 What Was Fixed

### Docker Build Issues Resolved:

1. **Added missing PHP extensions:**
   - `mbstring`, `zip`, `xml`, `curl`
   - Required system libraries installed

2. **Fixed composer install:**
   - Added `--no-scripts` flag to prevent running migrations during build
   - Added `COMPOSER_MEMORY_LIMIT=-1` to prevent memory issues
   - Added `--no-interaction --no-progress` for CI/CD

3. **Separated build and runtime:**
   - Removed database operations from Dockerfile
   - Moved config caching to runtime (`render-start.sh`)
   - Migrations only run at startup, not during build

4. **MongoDB compatibility:**
   - Changed session driver to `cookie`
   - Changed cache driver to `file`
   - Changed queue driver to `sync`
   - Added `MONGODB_URI` environment variable

5. **Added `.dockerignore`:**
   - Excludes unnecessary files from Docker image
   - Reduces build time and image size

---

## 🧪 Testing Your Deployment

### 1. Check Health Endpoint

Once deployed, test the health check:
```
https://YOUR-SERVICE-NAME.onrender.com/api/user
```

### 2. Test API Endpoints

```bash
# Test analytics (public endpoint)
curl https://YOUR-SERVICE.onrender.com/api/analytics

# Test login
curl -X POST https://YOUR-SERVICE.onrender.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ccs.edu","password":"password"}'
```

### 3. Check Logs

In Render dashboard:
- Go to your service
- Click **Logs** tab
- Look for any errors

---

## 🐛 Troubleshooting

### Issue: "composer install failed"

**Solution:** The Dockerfile now includes:
- `--no-scripts` flag
- Memory limit increase
- All required PHP extensions

### Issue: "MongoDB connection failed"

**Solutions:**
1. Verify `MONGODB_URI` is correct in Render env vars
2. Check MongoDB Atlas IP whitelist includes `0.0.0.0/0`
3. Verify database user has read/write permissions
4. Test connection string locally first

### Issue: "Migrations failed"

**Solutions:**
1. Set `RUN_MIGRATIONS=false` temporarily
2. Check MongoDB connection
3. Look at Render logs for specific error
4. Verify all models use MongoDB Eloquent

### Issue: "APP_KEY not set"

**Solution:**
```bash
# Generate key locally
php artisan key:generate --show

# Copy output to Render APP_KEY environment variable
```

### Issue: "500 Internal Server Error"

**Solutions:**
1. Check Render logs for error details
2. Verify all environment variables are set
3. Ensure `APP_DEBUG=false` in production
4. Check MongoDB connection

---

## 📊 Post-Deployment

### Create Admin User

If you need to seed the database:
1. Set `RUN_SEED=true` in Render env vars
2. Redeploy the service
3. Set `RUN_SEED=false` after seeding

### Default Credentials (if seeded)
- **Email:** `admin@ccs.edu`
- **Password:** `password`

### Frontend Deployment

If you have a separate frontend:
1. Deploy to Vercel/Netlify
2. Update `frontend/.env`:
   ```
   VITE_API_URL=https://YOUR-SERVICE.onrender.com
   ```
3. Update CORS in Laravel config to allow frontend URL

---

## 🔒 Security Checklist

- [ ] `APP_DEBUG=false` ✅
- [ ] `APP_KEY` is set ✅
- [ ] MongoDB password is strong ✅
- [ ] IP whitelist is configured (or 0.0.0.0/0 for free tier) ✅
- [ ] Using HTTPS (Render provides this automatically) ✅
- [ ] No sensitive data in `.env.example` ✅

---

## 💰 Cost Estimation

**Free Tier:**
- Render: Free web service (spins down after 15 min inactivity)
- MongoDB Atlas: Free M0 cluster (512 MB)

**Production (Paid):**
- Render: $7+/month (always-on)
- MongoDB Atlas: $9+/month (dedicated cluster)

---

## 📝 Notes

1. **Free Tier Limitations:**
   - Render free tier spins down after 15 minutes of inactivity
   - First request after spin-down takes ~30 seconds
   - MongoDB Atlas free tier has 512 MB storage limit

2. **Database Migrations:**
   - Migrations run automatically on deploy (`RUN_MIGRATIONS=true`)
   - MongoDB migrations create collections automatically
   - Safe to run multiple times

3. **Scaling:**
   - Upgrade Render plan for always-on service
   - Upgrade MongoDB Atlas for more storage/performance
   - Consider adding Redis for caching at scale

---

## 🆘 Need Help?

Check these files for configuration:
- `Dockerfile` - Build configuration
- `render.yaml` - Render service definition
- `render-start.sh` - Startup script
- `config/database.php` - Database configuration
- `.env.example` - Environment variables template

---

**Good luck with your deployment! 🚀**
