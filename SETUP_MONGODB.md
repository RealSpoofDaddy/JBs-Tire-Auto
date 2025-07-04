# 🗄️ MongoDB Setup Guide for JB's Tire & Auto

Your application needs a MongoDB database to store products. Here are two easy options:

## 🚀 Option 1: MongoDB Atlas (Cloud - Recommended)

**Best for**: Production use and easy setup

### Steps:
1. **Go to**: https://www.mongodb.com/atlas
2. **Sign up** for a free account
3. **Create a free cluster** (M0 Sandbox - no credit card required)
4. **Create a database user**:
   - Username: `jbsadmin`
   - Password: `jbstire2024` (or your choice)
5. **Whitelist your IP**: Add `0.0.0.0/0` for development
6. **Get connection string**: Click "Connect" → "Connect your application"
7. **Update your `.env` file**:
   ```env
   MONGODB_URI=mongodb+srv://jbsadmin:jbstire2024@cluster0.xxxxx.mongodb.net/jbs-tire-auto
   ```

✅ **Advantages**: Free, secure, managed, always available

## 🏠 Option 2: Local MongoDB

**Best for**: Development and testing

### For macOS:
```bash
# Install MongoDB using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### For Ubuntu/Linux:
```bash
# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

### For Windows:
1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Run the installer
3. Start MongoDB service

### Update .env file for local:
```env
MONGODB_URI=mongodb://localhost:27017/jbs-tire-auto
```

## 🧪 Test Your Connection

After setting up MongoDB, test the connection:

```bash
# Start your backend server
npm run dev

# In another terminal, test the API
curl http://localhost:5000/api/products
```

✅ **Should return**: `[]` (empty array) or existing products

## 🎯 Quick Start with Sample Data

Once MongoDB is working, add your first product through the admin panel:

1. Start the application: `./start-app.sh` (or manually start both servers)
2. Go to: http://localhost:3000
3. Click "Admin" → Login with `admin` / `jbstire2024`
4. Use "Quick Add Product" to add your first tire or rim!

## 🆘 Troubleshooting

### "Server error" when accessing products:
- MongoDB is not connected
- Check your MONGODB_URI in `.env`
- Ensure MongoDB service is running

### "Connection timeout":
- For Atlas: Check your connection string and whitelist settings
- For local: Ensure MongoDB service is started

### "Authentication failed":
- For Atlas: Verify username/password in connection string
- Check database user permissions

## 💡 Pro Tips

1. **Use MongoDB Atlas** for the easiest setup
2. **Keep your connection string secure** - don't commit it to git
3. **Create regular backups** of your product data
4. **Monitor usage** if using Atlas free tier

Once MongoDB is set up, your JB's Tire & Auto application will be fully functional! 🚗