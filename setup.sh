#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Black Friday Campaign - Setup & Start Script       ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js found: $(node --version)${NC}"

# Install frontend dependencies
echo -e "\n${BLUE}Installing frontend dependencies...${NC}"
npm install

# Install backend dependencies
echo -e "\n${BLUE}Installing backend dependencies...${NC}"
cd server
npm install
cd ..

echo -e "\n${GREEN}✓ Dependencies installed successfully!${NC}"

# Create .env files if they don't exist
if [ ! -f ".env" ]; then
    echo -e "\n${BLUE}Creating frontend .env file...${NC}"
    cat > .env << EOF
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
EOF
    echo -e "${GREEN}✓ .env created${NC}"
fi

if [ ! -f "server/.env" ]; then
    echo -e "\n${BLUE}Creating backend .env file...${NC}"
    cat > server/.env << EOF
PORT=5000
NODE_ENV=development
REACT_APP_URL=http://localhost:3000
JWT_SECRET=your-super-secret-key-change-in-production-2024
EOF
    echo -e "${GREEN}✓ server/.env created${NC}"
fi

echo -e "\n${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║              Setup Complete!                          ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"

echo -e "\n${BLUE}To start the application, open two terminals:${NC}"
echo -e "\n${YELLOW}Terminal 1 (Backend):${NC}"
echo -e "  ${BLUE}cd server${NC}"
echo -e "  ${BLUE}npm start${NC}"

echo -e "\n${YELLOW}Terminal 2 (Frontend):${NC}"
echo -e "  ${BLUE}npm start${NC}"

echo -e "\n${GREEN}Frontend:${NC} http://localhost:3000"
echo -e "${GREEN}Backend:${NC}  http://localhost:5000"
echo -e "\n${BLUE}Admin Dashboard:${NC} Click the 🔐 Admin button on the landing page"
