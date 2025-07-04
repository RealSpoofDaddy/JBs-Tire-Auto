#!/bin/bash

echo "🚗 Starting JB's Tire & Auto Application..."
echo ""

echo "📂 Step 1: Starting Backend Server..."
# Start backend in the background
npm run dev &
BACKEND_PID=$!

echo "⏰ Waiting 3 seconds for backend to initialize..."
sleep 3

echo "🌐 Step 2: Starting Frontend Server..."
# Navigate to frontend and start
cd frontend
npm start &
FRONTEND_PID=$!

echo ""
echo "✅ Application Started Successfully!"
echo ""
echo "🔗 Access Points:"
echo "   • Customer Website: http://localhost:3000"
echo "   • Admin Login: http://localhost:3000/login"
echo "   • Backend API: http://localhost:5000"
echo ""
echo "🔐 Admin Credentials:"
echo "   • Username: admin"
echo "   • Password: jbstire2024"
echo ""
echo "💡 To stop both servers: Ctrl+C"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID