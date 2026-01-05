#!/bin/bash

echo "🚇 Setting up Transport Web System..."
echo "===================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    print_error "Please run this script from the transport-web directory"
    exit 1
fi

print_status "Setting up backend dependencies..."

# Setup backend
cd backend

# Download dependencies
print_status "Downloading C++ HTTP library..."
if command -v curl &> /dev/null; then
    curl -L https://raw.githubusercontent.com/yhirose/cpp-httplib/master/httplib.h -o httplib.h
    print_success "Downloaded httplib.h"
else
    print_warning "curl not found. Please download httplib.h manually from:"
    echo "https://raw.githubusercontent.com/yhirose/cpp-httplib/master/httplib.h"
fi

print_status "Downloading JSON library..."
if command -v curl &> /dev/null; then
    curl -L https://raw.githubusercontent.com/nlohmann/json/develop/single_include/nlohmann/json.hpp -o json.hpp
    print_success "Downloaded json.hpp"
else
    print_warning "curl not found. Please download json.hpp manually from:"
    echo "https://raw.githubusercontent.com/nlohmann/json/develop/single_include/nlohmann/json.hpp"
fi

# Try to compile
print_status "Attempting to compile backend..."
if command -v g++ &> /dev/null; then
    if make; then
        print_success "Backend compiled successfully!"
    else
        print_warning "Compilation failed. You may need to adjust include paths."
    fi
else
    print_warning "g++ not found. Please install a C++ compiler."
fi

cd ..

# Setup frontend
print_status "Setting up frontend dependencies..."
cd frontend

if command -v npm &> /dev/null; then
    print_status "Installing Node.js dependencies..."
    npm install
    if [ $? -eq 0 ]; then
        print_success "Frontend dependencies installed!"
    else
        print_error "Failed to install frontend dependencies"
    fi
else
    print_warning "npm not found. Please install Node.js and npm."
    print_status "You can download Node.js from: https://nodejs.org/"
fi

cd ..

# Create run scripts
print_status "Creating run scripts..."

# Backend run script
cat > run-backend.sh << 'EOF'
#!/bin/bash
echo "🚇 Starting Transport API Server..."
cd backend
if [ -f "transport-api" ]; then
    ./transport-api
else
    echo "Backend not compiled. Run 'make' in the backend directory first."
    # Fallback to enhanced demo
    if [ -f "enhanced_server.cpp" ]; then
        echo "Running enhanced demo instead..."
        g++ -std=c++17 enhanced_server.cpp -o enhanced_demo && ./enhanced_demo
    fi
fi
EOF

# Frontend run script
cat > run-frontend.sh << 'EOF'
#!/bin/bash
echo "🚇 Starting Transport Web Frontend..."
cd frontend
if [ -d "node_modules" ]; then
    npm start
else
    echo "Frontend dependencies not installed. Run 'npm install' in the frontend directory first."
fi
EOF

# Make scripts executable
chmod +x run-backend.sh
chmod +x run-frontend.sh

print_success "Run scripts created!"

# Create development script
cat > dev.sh << 'EOF'
#!/bin/bash
echo "🚇 Starting Transport Web System in Development Mode..."
echo "======================================================"

# Function to cleanup background processes
cleanup() {
    echo "Shutting down services..."
    kill $(jobs -p) 2>/dev/null
    exit
}

# Set trap to cleanup on script exit
trap cleanup EXIT

# Start backend in background
echo "Starting backend server..."
./run-backend.sh &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 2

# Start frontend
echo "Starting frontend development server..."
./run-frontend.sh &
FRONTEND_PID=$!

echo ""
echo "🚇 Transport Web System is starting up!"
echo "Backend API: http://localhost:8080"
echo "Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user to stop
wait
EOF

chmod +x dev.sh

print_success "Development script created!"

# Final instructions
echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "To start the system:"
echo "  ./dev.sh                 # Start both backend and frontend"
echo "  ./run-backend.sh         # Start only backend API"
echo "  ./run-frontend.sh        # Start only frontend"
echo ""
echo "Manual setup:"
echo "  Backend:  cd backend && make && ./transport-api"
echo "  Frontend: cd frontend && npm start"
echo ""
echo "Access the application at: http://localhost:3000"
echo "API documentation at: http://localhost:8080/api/status"
echo ""

if [ ! -f "backend/httplib.h" ] || [ ! -f "backend/json.hpp" ]; then
    print_warning "Some dependencies may be missing. Check the backend directory."
fi

if [ ! -d "frontend/node_modules" ]; then
    print_warning "Frontend dependencies not installed. Run 'npm install' in frontend directory."
fi

print_success "Ready to launch your transport network! 🚇"