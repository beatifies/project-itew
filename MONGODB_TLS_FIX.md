# MongoDB TLS Handshake Error Fix for Render

## ❌ The Error You're Seeing

```
No suitable servers found (`serverSelectionTryOnce` set): 
[TLS handshake failed: error:0A000438:SSL routines::tlsv1 alert internal error 
calling hello on 'ac-ypjmann-shard-00-01.kpcar11.mongodb.net:27017']
```

## ✅ What Was Fixed

### 1. Updated `config/database.php`
Added TLS options to the MongoDB connection configuration:

```php
'mongodb' => [
    'driver' => 'mongodb',
    'dsn' => env('MONGODB_URI', 'mongodb://localhost:27017'),
    'database' => env('DB_DATABASE', 'student_profiling'),
    'options' => [
        'tls' => true,
        'tlsAllowInvalidCertificates' => false,
        'tlsAllowInvalidHostnames' => false,
        'tlsCAFile' => env('MONGODB_TLS_CA_FILE'),
    ],
],
```

### 2. What You Need to Do on Render

#### Step 1: Get Your MongoDB Atlas Connection String

1. Go to MongoDB Atlas: https://cloud.mongodb.com
2. Click **Connect** on your cluster
3. Choose **Connect your application**
4. Copy the connection string (it looks like this):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

5. **IMPORTANT:** Add your database name and TLS parameter:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/student_profiling?retryWrites=true&w=majority&tls=true
   ```

#### Step 2: Update Render Environment Variables

1. Go to your Render Dashboard: https://dashboard.render.com
2. Click on your service (`ccs-profiling-backend`)
3. Go to **Environment** tab
4. Find or add the `MONGODB_URI` variable
5. Set it to your full connection string with TLS:
   ```
   mongodb+srv://your_username:your_password@ac-ypjmann-shard-00-00.kpcar11.mongodb.net,ac-ypjmann-shard-00-01.kpcar11.mongodb.net,ac-ypjmann-shard-00-02.kpcar11.mongodb.net/student_profiling?retryWrites=true&w=majority&tls=true
   ```

6. Click **Save Changes**

#### Step 3: Redeploy

1. Go to **Manual Deploy** section in Render
2. Click **Deploy latest commit** OR
3. Make a small change to your code and push to GitHub

## 🔍 How to Verify It's Working

### Check Render Logs

1. Go to your service in Render dashboard
2. Click **Logs** tab
3. Look for successful migration messages
4. You should NOT see TLS handshake errors anymore

### Test the API

Once deployed, test:
```bash
curl https://YOUR-SERVICE.onrender.com/api/analytics
```

## 📋 Complete MONGODB_URI Format

Your `MONGODB_URI` on Render should look EXACTLY like this (replace with your actual values):

```
mongodb+srv://myusername:MyP@ssw0rd123@ac-ypjmann-shard-00-00.kpcar11.mongodb.net,ac-ypjmann-shard-00-01.kpcar11.mongodb.net,ac-ypjmann-shard-00-02.kpcar11.mongodb.net/student_profiling?retryWrites=true&w=majority&tls=true
```

### Breaking it down:
- `mongodb+srv://` - Protocol (required for Atlas)
- `username:password@` - Your MongoDB Atlas credentials
- `ac-ypjmann-shard-00-00.kpcar11.mongodb.net,...` - Your cluster hosts (from Atlas)
- `/student_profiling` - Database name
- `?retryWrites=true&w=majority&tls=true` - **Critical parameters**
  - `retryWrites=true` - Enables automatic retry of writes
  - `w=majority` - Write concern
  - `tls=true` - **THIS IS THE FIX FOR YOUR ERROR**

## 🚨 Common Mistakes

### ❌ WRONG (Missing TLS parameter)
```
mongodb+srv://user:pass@cluster.mongodb.net/student_profiling
```

### ✅ CORRECT (With TLS parameter)
```
mongodb+srv://user:pass@cluster.mongodb.net/student_profiling?retryWrites=true&w=majority&tls=true
```

### ❌ WRONG (Using mongodb:// instead of mongodb+srv://)
```
mongodb://user:pass@cluster.mongodb.net/student_profiling?tls=true
```

### ✅ CORRECT (Using mongodb+srv:// for Atlas)
```
mongodb+srv://user:pass@cluster.mongodb.net/student_profiling?retryWrites=true&w=majority&tls=true
```

## 🔧 Additional Troubleshooting

### If you still get TLS errors:

1. **Check MongoDB Atlas Network Access**
   - Go to MongoDB Atlas → Network Access
   - Make sure `0.0.0.0/0` is allowed (for free tier)
   - Or add Render's IP addresses

2. **Verify Cluster TLS Version**
   - All MongoDB Atlas clusters support TLS 1.2+ by default
   - This should not be an issue with Atlas

3. **Test Connection String Locally**
   ```bash
   # On your local machine
   mongosh "mongodb+srv://user:pass@cluster.mongodb.net/student_profiling?tls=true"
   ```

4. **Check Special Characters in Password**
   - If your password has special characters like `@`, `#`, `$`, etc.
   - URL-encode them:
     - `@` becomes `%40`
     - `#` becomes `%23`
     - `$` becomes `%24`
     - Example: `P@ssw0rd` → `P%40ssw0rd`

5. **Verify Database User Permissions**
   - Go to MongoDB Atlas → Database Access
   - Edit your user
   - Make sure they have **Read and write to any database** permission

## 📞 Still Having Issues?

If the error persists after following these steps:

1. Check the full Render logs for more details
2. Verify your MongoDB Atlas cluster is active
3. Try creating a new database user with a simpler password
4. Make sure you're using the correct cluster URL from Atlas

## ✅ Summary

The fix involves:
- ✅ Updated `config/database.php` with TLS options
- ✅ Ensuring `MONGODB_URI` includes `?tls=true` parameter
- ✅ Using `mongodb+srv://` protocol for MongoDB Atlas
- ✅ Properly configuring Render environment variables

After making these changes and redeploying, your application should connect to MongoDB Atlas successfully on Render!
