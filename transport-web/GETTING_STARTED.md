# 🚇 Transport Web System - Getting Started

Welcome to the **Intelligent Transport Network Management System** web version! This project transforms your C++ DSA implementation into a modern, interactive web application.

## 🎯 What We've Built

### Backend (C++ API)
- **REST API wrapper** around your existing DSA algorithms
- **Real-time endpoints** for all transport operations
- **JSON responses** for seamless frontend integration
- **CORS enabled** for web browser compatibility

### Frontend (React + D3.js)
- **Interactive network visualization** with D3.js
- **Real-time passenger queue management**
- **Vehicle fleet dashboard**
- **Analytics and reporting** with animated charts
- **Path finding interface** with algorithm selection
- **Responsive design** with smooth animations

## 🚀 Quick Start

### Option 1: Automated Setup
```bash
# Make setup script executable and run
chmod +x setup.sh
./setup.sh

# Start the entire system
./dev.sh
```

### Option 2: Manual Setup

#### Backend Setup
```bash
cd backend

# Download dependencies
curl -L https://raw.githubusercontent.com/yhirose/cpp-httplib/master/httplib.h -o httplib.h
curl -L https://raw.githubusercontent.com/nlohmann/json/develop/single_include/nlohmann/json.hpp -o json.hpp

# Compile
make

# Run
./transport-api
```

#### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

## 🌐 Access Points

- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **API Status**: http://localhost:8080/api/status

## 📱 Features Overview

### 1. Dashboard
- **System overview** with real-time metrics
- **Quick station management** - add stations instantly
- **Route creation** - connect stations with weights
- **Recent activity** feed

### 2. Network Visualization
- **Interactive graph** with D3.js force simulation
- **Drag and drop** stations
- **Algorithm visualization** (BFS/DFS with animation)
- **Node highlighting** and connection display

### 3. Path Finder
- **Dijkstra's algorithm** implementation
- **BFS alternative** for unweighted paths
- **Step-by-step route display**
- **Distance and time estimation**

### 4. Passenger Queue
- **FIFO queue management**
- **Real-time processing** with animations
- **Wait time tracking**
- **Queue statistics**

### 5. Vehicle Manager
- **Fleet overview** with vehicle cards
- **Add/remove vehicles** by type
- **Search functionality**
- **Status tracking** (active/maintenance)

### 6. Analytics Dashboard
- **Station traffic** bar charts
- **Route usage** rankings
- **Real-time trends** with animated graphs
- **Weekly usage patterns** heatmap
- **Performance metrics**

## 🔧 API Endpoints

### Stations
- `POST /api/stations` - Add new station
- `GET /api/stations` - Get all stations
- `DELETE /api/stations/:id` - Remove station

### Routes
- `POST /api/routes` - Add route between stations
- `DELETE /api/routes` - Remove route

### Path Finding
- `GET /api/shortest-path?start=1&end=5` - Find shortest path
- `GET /api/bfs/:id` - BFS traversal from station
- `GET /api/dfs/:id` - DFS traversal from station

### Passengers
- `POST /api/passengers` - Add passenger to queue
- `DELETE /api/passengers` - Process next passenger
- `GET /api/passengers` - Get current queue

### Vehicles
- `POST /api/vehicles` - Add vehicle
- `GET /api/vehicles/:id` - Search vehicle
- `DELETE /api/vehicles/:id` - Remove vehicle

### Analytics
- `GET /api/analytics/stations` - Station statistics
- `GET /api/analytics/routes` - Route analytics
- `POST /api/analytics/visit` - Record station visit

## 🎨 Technology Stack

### Backend
- **C++17** with your existing DSA implementations
- **cpp-httplib** for HTTP server functionality
- **nlohmann/json** for JSON serialization
- **CORS support** for web integration

### Frontend
- **React 18** for UI framework
- **D3.js** for network visualization
- **Framer Motion** for smooth animations
- **Styled Components** for styling
- **Axios** for API communication
- **React Hot Toast** for notifications

## 🔄 Development Workflow

### Running in Development Mode
```bash
# Start both backend and frontend
./dev.sh

# Or start individually
./run-backend.sh    # Backend only
./run-frontend.sh   # Frontend only
```

### Making Changes

#### Backend Changes
1. Modify C++ files in `backend/`
2. Recompile: `cd backend && make`
3. Restart: `./run-backend.sh`

#### Frontend Changes
1. Modify React components in `frontend/src/`
2. Changes auto-reload in development mode
3. No restart needed

## 🚧 Extending the System

### Adding New Algorithms
1. **Implement in C++**: Add to your DSA project
2. **Create API endpoint**: Add route in `server.cpp`
3. **Add frontend interface**: Create React component
4. **Connect with API**: Use axios for communication

### Adding New Visualizations
1. **Create D3.js component**: In `frontend/src/components/`
2. **Style with CSS**: Use styled-components
3. **Add animations**: Use Framer Motion
4. **Integrate data**: Connect to API endpoints

## 🐛 Troubleshooting

### Backend Issues
- **Compilation errors**: Check include paths in Makefile
- **Missing dependencies**: Run `make install-deps`
- **Port conflicts**: Change port in server.cpp

### Frontend Issues
- **Dependencies missing**: Run `npm install`
- **Port conflicts**: React will suggest alternative port
- **API connection**: Check backend is running on port 8080

### Common Solutions
```bash
# Clean and rebuild everything
make clean
npm run clean
./setup.sh

# Check if services are running
curl http://localhost:8080/api/status  # Backend
curl http://localhost:3000             # Frontend
```

## 🎉 What's Next?

### Immediate Enhancements
- **Real-time WebSocket** connections
- **Map integration** with Leaflet/Mapbox
- **User authentication** system
- **Data persistence** with database

### Advanced Features
- **Machine learning** for traffic prediction
- **Mobile app** with React Native
- **Microservices** architecture
- **Docker containerization**

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Happy coding! 🚇✨**

Your transport network is now ready for the web. The combination of your solid C++ algorithms with modern web technologies creates a powerful, interactive system that showcases the practical applications of data structures and algorithms in real-world scenarios.