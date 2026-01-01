# Farm Store Management Dashboard - Project Submission

Hello! This is our submission for the USCH1B Database Project.

This project is a single-page web application designed to help a farm store manager handle daily operations. It's built with a **Node.js/Express** backend, a **MySQL** database, and a clean **vanilla JavaScript** frontend with **multi-language support** (English, Chinese, French).

## Core Features Implemented

*   **Real-time Product & Stock Management:** View, add, and adjust product inventory directly from the main dashboard. Low-stock items are highlighted for attention!
*   **Customer Management:** Easily add, edit, and view loyal customers.
*   **Efficient Sale Recording:** A streamlined process to record sales for both registered customers and walk-ins. The system handles all the complex database transactions automatically.
*   **Sales History:** View recent sales records in real-time.
*   **Sales Reporting:** (Bonus Feature) Generate sales summaries for any given date range with internationalized date picker.
*   **Multi-language Support:** Full internationalization with English, Chinese, and French interfaces.

## Quick Start Guide (One-Click Setup)

We've made it as simple as possible to get this running. You'll just need **Node.js** and **MySQL** already installed on your machine.

### For Windows Users

Simply double-click **`setup.bat`** or run in command prompt:

```bash
setup.bat
```

### For Mac/Linux Users

Run in terminal:

```bash
chmod +x setup.sh
./setup.sh
```

### What the Setup Script Does

1. **Environment Check:** Verifies that Node.js, npm, and MySQL are installed
2. **First Run Configuration:** Prompts for MySQL credentials and creates `.env` file
3. **Database Initialization:** Automatically runs `database_setup.sql` to create tables and sample data
4. **Dependency Installation:** Runs `npm install` if needed
5. **Server Launch:** Starts the server and automatically opens your browser to `http://localhost:3000`

**For subsequent runs:** The script detects existing configuration and skips directly to starting the server.

## Manual Setup (Alternative)

If you prefer manual setup:

### Step 1: Set up the Database

```bash
# Replace 'your_username' with your actual MySQL username (like 'root')
mysql --default-character-set=utf8mb4 -u your_username -p < database_setup.sql
```

### Step 2: Configure the Connection

1. Copy the `.env.example` file and rename the new copy to `.env`.
2. Open the `.env` file and fill in your MySQL username and password.

### Step 3: Run the App

```bash
npm install
npm start
```

Then open `http://localhost:3000` in your browser.

## A Note on the Technical Design

We focused on creating a robust and clean architecture for this project.

*   **Three-Tier Architecture:** A clear separation between the frontend (presentation), backend (logic), and database (data).
*   **RESTful API:** The backend provides a clear API for the frontend to consume.
*   **Database Transactions:** The most critical operations, like recording a sale, are wrapped in SQL transactions. This ensures data integrity—for example, stock levels are only updated if the sale record is successfully created.
*   **Single-Page Application (SPA):** The frontend is designed for a smooth user experience with no page reloads. All updates happen dynamically via JavaScript and Fetch API calls.
*   **Internationalization (i18n):** Complete multi-language support with dynamic language switching for all UI elements including date pickers.

## Project Structure

```
├── public/
│   ├── index.html          # Main HTML page
│   ├── script.js           # Frontend JavaScript with i18n
│   └── style.css           # Styling
├── src/
│   ├── server.js           # Express.js backend
│   └── db.js               # Database connection pool
├── database_setup.sql      # Database schema and sample data
├── setup.bat               # Windows one-click setup
├── setup.sh                # Mac/Linux one-click setup
├── .env.example            # Environment variables template
└── package.json            # Node.js dependencies
```

Thanks for taking the time to review our project! We hope you enjoy testing it out.
