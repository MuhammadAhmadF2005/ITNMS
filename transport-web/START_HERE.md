# 🚀 Quick Start Guide

## Step 1: Start the Backend (C++ API)

Open **Command Prompt** or **PowerShell** and run:

```bash
cd transport-web/backend
enhanced_demo.exe
```

You should see:
```
🚇 Enhanced Transport Network Management System
================================================
...
🚇 Transport API Server would start on http://localhost:8080
```

## Step 2: Start the Frontend (React App)

Open **another** Command Prompt/PowerShell window and run:

```bash
cd transport-web/frontend
npm start
```

This will:
- Compile the React application
- Open your browser automatically
- Navigate to http://localhost:3000

## Step 3: Access Your Transport System

Your browser should automatically open to:
**http://localhost:3000**

If it doesn't open automatically, manually navigate to that URL.

## 🎯 What You'll See

1. **Navigation Bar** - Switch between different sections
2. **Dashboard** - System overview and quick actions
3. **Network** - Interactive graph visualization
4. **Path Finder** - Find shortest routes
5. **Passengers** - Queue management
6. **Vehicles** - Fleet management
7. **Analytics** - Charts and reports

## 🔧 Troubleshooting

### If Frontend Won't Start:
```bash
cd transport-web/frontend
npm install
npm start
```

### If Backend Won't Start:
```bash
cd transport-web/backend
g++ -std=c++17 enhanced_server.cpp -o enhanced_demo.exe
enhanced_demo.exe
```

### If Browser Shows Error:
- Make sure both backend and frontend are running
- Check that you're accessing http://localhost:3000
- Try refreshing the page

## 🎉 Success!

Once both are running, you'll have a fully functional transport management system with:
- Interactive network visualization
- Real-time passenger queue
- Vehicle management
- Path finding algorithms
- Analytics dashboard

**Enjoy exploring your web-based transport system! 🚇✨**