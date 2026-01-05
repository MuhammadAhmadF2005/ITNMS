# 🚇 Intelligent Transport Web System

Modern web-based transport network management system built on top of the original C++ DSA implementation.

## Architecture
- **Backend**: C++ REST API (using cpp-httplib)
- **Frontend**: React with D3.js for network visualization
- **Real-time**: WebSocket connections for live updates

## Quick Start

### Backend (C++ API)
```bash
cd backend
g++ -std=c++17 -pthread server.cpp -o transport-api
./transport-api
```

### Frontend (React)
```bash
cd frontend
npm install
npm start
```

## Features
- Interactive network graph visualization
- Real-time passenger queue management
- Vehicle tracking dashboard
- Analytics and reporting
- Shortest path finding with animation