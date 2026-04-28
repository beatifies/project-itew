# Render Deployment Guide

## 🚀 Quick Start: Deploy to New Render Account

### Prerequisites
1. GitHub repository connected
2. MongoDB Atlas account (free tier available)
3. New Render account ready

---

## Step 1: Set Up MongoDB Atlas

### Create MongoDB Database
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up/Login
3. Create a new cluster (free tier M0)
4. Create a database user with username and password
5. Whitelist IP: `0.0.0.0/0` (allow access from anywhere)
6. Get your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/student_profiling
   ```

---

## Step 2: Disconnect from Current Render (Optional)

### If you want to remove old deployment:
1. Go to old Render account: https://dashboard.render.com
2. Select your backend service
3. Go to **Settings** tab
4. Scroll to bottom and click **Delete Service**
5. Confirm deletion

---

## Step 3: Deploy to New Render Account

### Option A: Using render.yaml (Easiest)

1. **Go to new Render account**: https://dashboard.render.com
2. Click **New +** → **Blueprint**
3. Connect your GitHub repository: `beatifies/project-itew`
4. Render will automatically detect `render.yaml`
5. Configure environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `APP_KEY`: Generate with `php artisan key:generate` or use existing
   - `APP_URL`: Will be auto-generated (e.g., `https://ccs-profiling-backend.onrender.com`)
6. Click **Apply**

### Option B: Manual Setup

1. **Go to new Render account**: https://dashboard.render.com
2. Click **New +** → **Web Service**
3. Connect repository: `beatifies/project-itew`
4. Configure:
   - **Name**: `ccs-profiling-backend`
   - **Region**: Oregon (or closest to you)
   - **Branch**: `master`
   - **Root Directory**: Leave blank
   - **Runtime**: Docker
   - **Dockerfile Path**: `./Dockerfile`
   - **Command**: `/app/render-start.sh`
   - **Plan**: Free

5. **Add Environment Variables**:
   ```
   APP_NAME=CCS_Profiling_System
   APP_ENV=production
   APP_DEBUG=false
   APP_KEY=base64:4k1CtA4GOc2VxYutVYxnhgsYOJfpUGz2whKD+GNsbKQ=
   APP_URL=https://your-app-url.onrender.com
   
   DB_CONNECTION=mongodb
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/student_profiling
   
   RUN_MIGRATIONS=true
   RUN_SEED=false
   ```

6. Click **Create Web Service**

---

## Step 4: Verify Deployment

### Check if deployment succeeded:
1. Go to Render Dashboard → Your Service
2. Check **Logs** tab for any errors
3. Visit your app URL: `https://your-app.onrender.com`
4. Test API endpoint: `https://your-app.onrender.com/api/user`

### Expected Response:
```json
{
  "id": 1,
  "name": "Admin User",
  "email": "admin@ccs.edu",
  "role": "admin"
}
```

---

## Step 5: Update Frontend API URL

### Update Vercel Frontend:
1. Go to Vercel Dashboard → Your Project
2. Go to **Settings** → **Environment Variables**
3. Update `VITE_API_URL`:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   ```
4. Redeploy frontend (trigger new deployment)

### Or update locally:
Edit `frontend/.env`:
```env
VITE_API_URL=https://your-backend-url.onrender.com
```
Then commit and push to trigger Vercel deployment.

---

## 🔧 Environment Variables Reference

### Required Variables:
| Variable | Description | Example |
|----------|-------------|---------|
| `APP_NAME` | Application name | `CCS_Profiling_System` |
| `APP_ENV` | Environment | `production` |
| `APP_DEBUG` | Debug mode | `false` |
| `APP_KEY` | Laravel encryption key | `base64:...` |
| `APP_URL` | Your Render URL | `https://...onrender.com` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |

### Optional Variables:
| Variable | Description | Default |
|----------|-------------|---------|
| `RUN_MIGRATIONS` | Run migrations on start | `true` |
| `RUN_SEED` | Seed database on start | `false` |

---

## ⚠️ Common Issues

### Issue: MongoDB Connection Failed
**Solution**: 
- Verify MongoDB Atlas connection string
- Check network access allows `0.0.0.0/0`
- Verify username/password are correct

### Issue: APP_KEY Missing
**Solution**: 
- Generate new key: `php artisan key:generate --show`
- Add to Render environment variables

### Issue: Migration Errors
**Solution**:
- Check logs in Render dashboard
- Verify MongoDB connection
- Set `RUN_MIGRATIONS=true` temporarily

### Issue: CORS Errors
**Solution**:
- Update `config/cors.php` to include your frontend URL
- Add your Vercel URL to allowed origins

---

## 📊 Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created with password
- [ ] Network access set to `0.0.0.0/0`
- [ ] Render account ready
- [ ] Web service created in Render
- [ ] Environment variables configured
- [ ] Deployment successful
- [ ] API endpoint accessible
- [ ] Frontend `VITE_API_URL` updated
- [ ] Frontend redeployed to Vercel
- [ ] Test login functionality

---

## 🎯 Next Steps After Deployment

1. **Seed Database** (if needed):
   - In Render dashboard, set `RUN_SEED=true`
   - Redeploy service
   - Set back to `false` after seeding

2. **Set Up Custom Domain** (optional):
   - Go to Render → Settings → Custom Domain
   - Add your domain

3. **Enable Auto-Deploy**:
   - Already enabled by default
   - Every push to `master` triggers deployment

4. **Monitor Logs**:
   - Check Render dashboard → Logs
   - Monitor for errors

---

## 📞 Support

If you encounter issues:
1. Check Render service logs
2. Verify MongoDB Atlas connection
3. Test API endpoints directly
4. Check browser console for frontend errors
