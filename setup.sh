#!/bin/bash

# Farm Store Management Dashboard - One-Click Setup Script
# Supports: Linux / macOS

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "=============================================="
echo "   Farm Store Management Dashboard Setup"
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
echo -e "\n${YELLOW}[Step 1/5] Checking environment...${NC}\n"

MISSING=0

check_command "node" || MISSING=1
check_command "npm" || MISSING=1
check_command "mysql" || MISSING=1

if [ $MISSING -eq 1 ]; then
    echo -e "\n${RED}Please install the missing dependencies first.${NC}"
    exit 1
fi

echo -e "\n${GREEN}Environment check passed!${NC}"

# Step 2: Get database configuration from user
echo -e "\n${YELLOW}[Step 2/5] Database Configuration${NC}\n"

read -p "MySQL Host [localhost]: " DB_HOST
DB_HOST=${DB_HOST:-localhost}

read -p "MySQL Username [root]: " DB_USER
DB_USER=${DB_USER:-root}

read -sp "MySQL Password: " DB_PASSWORD
echo ""

read -p "Database Name [farm_store]: " DB_NAME
DB_NAME=${DB_NAME:-farm_store}

# Step 3: Create .env file
echo -e "\n${YELLOW}[Step 3/5] Creating .env file...${NC}\n"

cat > .env << EOF
DB_HOST=$DB_HOST
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DB_NAME=$DB_NAME
EOF

echo -e "${GREEN}.env file created successfully!${NC}"

# Step 4: Initialize database
echo -e "\n${YELLOW}[Step 4/5] Initializing database...${NC}\n"

# Replace database name in SQL file if different
if [ "$DB_NAME" != "farm_store" ]; then
    sed -i.bak "s/farm_store/$DB_NAME/g" database_setup.sql
fi

mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" < database_setup.sql

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Database initialized successfully!${NC}"
else
    echo -e "${RED}Database initialization failed!${NC}"
    exit 1
fi

# Step 5: Install dependencies and start server
echo -e "\n${YELLOW}[Step 5/5] Installing dependencies & starting server...${NC}\n"

npm install

echo -e "\n${GREEN}=============================================="
echo "   Setup Complete!"
echo "==============================================${NC}"
echo ""
echo -e "Starting server... The browser will open automatically."
echo -e "Press ${RED}Ctrl+C${NC} to stop the server."
echo ""

# Detect OS and open browser
sleep 2 &
(sleep 3 &&
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open "$(pwd)/public/index.html"
    else
        xdg-open "$(pwd)/public/index.html" 2>/dev/null || echo "Please open public/index.html in your browser"
    fi
) &

npm start
