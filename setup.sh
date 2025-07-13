#!/bin/bash

echo "🚀 Setting up JobHook - Full Stack Job Portal"
echo "=============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo "❌ Java is not installed. Please install Java 17+ first."
    exit 1
fi

# Check if Maven is installed
if ! command -v mvn &> /dev/null; then
    echo "❌ Maven is not installed. Please install Maven first."
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL 14+ first."
    exit 1
fi

echo "✅ All prerequisites are installed!"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Create database
echo "🗄️ Setting up database..."
echo "Please enter your PostgreSQL password when prompted:"
psql -U postgres -c "CREATE DATABASE findy_db;" 2>/dev/null || echo "Database might already exist"
psql -U postgres -d findy_db -f database/init.sql

echo "✅ Database setup complete!"

# Build backend
echo "🔨 Building backend..."
cd backend
mvn clean compile

echo "✅ Backend build complete!"

echo ""
echo "🎉 Setup complete! To start the application:"
echo ""
echo "1. Start the backend:"
echo "   cd backend"
echo "   mvn spring-boot:run"
echo ""
echo "2. Start the frontend (in a new terminal):"
echo "   npm run dev"
echo ""
echo "3. Open your browser and go to:"
echo "   http://localhost:3000"
echo ""
echo "📚 For more information, see the README.md file" 