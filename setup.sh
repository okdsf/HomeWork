#!/bin/bash

# Farm Store Management Dashboard - Setup & Start Script
# Automatically detects first run vs subsequent runs

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "=============================================="
echo "   Farm Store Management Dashboard"
echo "=============================================="
echo -e "${NC}"

# Function to check command exists
check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}[OK]${NC} $1 is installed"
        return 0
    else
        echo -e "${RED}[MISSING]${NC} $1 is not installed"
        return 1
    fi
}

# Step 1: Environment Check
echo -e "${YELLOW}[Step 1] Checking environment...${NC}\n"

MISSING=0

check_command "node" || MISSING=1
check_command "npm" || MISSING=1
check_command "mysql" || MISSING=1

if [ $MISSING -eq 1 ]; then
    echo -e "\n${RED}Please install the missing dependencies first.${NC}"
    exit 1
fi

echo -e "\n${GREEN}Environment check passed!${NC}"

# Check if this is first run (no .env file)
if [ -f ".env" ]; then
    echo -e "\n${GREEN}[INFO]${NC} Configuration found. Skipping setup..."
else
    # First run - need to configure
    echo -e "\n${BLUE}=============================================="
    echo "   First Run - Database Configuration"
    echo -e "==============================================${NC}\n"
    echo -e "Note: Press ENTER to use default value shown in [brackets]"
    echo -e "      Items marked with ${RED}*${NC} are REQUIRED\n"

    read -p "  MySQL Host [localhost] (press ENTER for default): " DB_HOST
    DB_HOST=${DB_HOST:-localhost}

    read -p "  MySQL Username [root] (press ENTER for default): " DB_USER
    DB_USER=${DB_USER:-root}

    echo ""
    echo -e "  ${RED}*${NC} MySQL Password is REQUIRED - please enter your password:"
    read -sp "  MySQL Password: " DB_PASSWORD
    echo ""

    if [ -z "$DB_PASSWORD" ]; then
        echo -e "\n${RED}[ERROR] Password cannot be empty!${NC}"
        exit 1
    fi

    echo ""
    read -p "  Database Name [farm_store_db] (press ENTER for default): " DB_NAME
    DB_NAME=${DB_NAME:-farm_store_db}

    # Create .env file
    echo -e "\n${YELLOW}[Step 2] Creating .env file...${NC}"

    cat > .env << EOF
DB_HOST=$DB_HOST
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DB_NAME=$DB_NAME
EOF

    echo -e "${GREEN}.env file created successfully!${NC}"

    # Initialize database
    echo -e "\n${YELLOW}[Step 3] Initializing database...${NC}\n"

    if [ "$DB_NAME" != "farm_store_db" ]; then
        sed -i.bak "s/farm_store_db/$DB_NAME/g" database_setup.sql
    fi

    mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" < database_setup.sql

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Database initialized successfully!${NC}"
    else
        echo -e "${RED}Database initialization failed!${NC}"
        exit 1
    fi
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "\n${YELLOW}[Step 4] Installing dependencies...${NC}"
    npm install
fi

echo -e "\n${BLUE}=============================================="
echo "   Starting Server"
echo -e "==============================================${NC}\n"
echo -e "Server will start at: ${GREEN}http://localhost:3000${NC}"
echo -e "Press ${RED}Ctrl+C${NC} to stop the server.\n"

# Try to open browser
sleep 2 &
(sleep 2 &&
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open "http://localhost:3000" 2>/dev/null
    else
        xdg-open "http://localhost:3000" 2>/dev/null
    fi
) &

if [ $? -ne 0 ]; then
    echo -e "${YELLOW}[INFO]${NC} Could not open browser automatically."
    echo "       Please open http://localhost:3000 manually."
    echo ""
fi

npm start
