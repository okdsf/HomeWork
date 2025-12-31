# Farm Store Management Dashboard - Project Submission

Hello! This is my submission for the USCH1B Database Project.

This project is a single-page web application designed to help a farm store manager handle daily operations. It's built with a **Node.js/Express** backend, a **MySQL** database, and a clean **vanilla JavaScript** frontend.

## Core Features Implemented

*   **Real-time Product & Stock Management:** View, add, and adjust product inventory directly from the main dashboard. Low-stock items are highlighted for attention!
*   **Customer Management:** Easily add and view loyal customers.
*   **Efficient Sale Recording:** A streamlined process to record sales for both registered customers and walk-ins. The system handles all the complex database transactions automatically.
*   **Sales Reporting:** (Bonus Feature) Generate sales summaries for any given date range.

## Quick Start Guide

I've made it as simple as possible to get this running. You'll just need Node.js and MySQL already on your machine.

### Step 1: Set up the Database

I've included a single SQL script that does everything for you: creates the database, sets up all the tables, and even adds some sample data to play with.

Just run this command from the project's root directory:

```bash
# Replace 'your_username' with your actual MySQL username (like 'root')
mysql --default-character-set=utf8mb4 -u your_username -p < database_setup.sql
```
It will ask for your MySQL password, and you'll be all set!

### Step 2: Configure the Connection

You just need to tell the app how to log in to your database.

1.  Copy the `.env.example` file and rename the new copy to `.env`.
2.  Open the `.env` file and fill in your MySQL username and password.

### Step 3: Run the App!

That's it for setup. Now just two commands:

1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Start the server:**
    ```bash
    npm start
    ```

You'll see a message `🚀 Server is running on http://localhost:3000`.

Now, just open the `public/index.html` file in your browser to use the application. Everything should be working!

## A Note on the Technical Design

I focused on creating a robust and clean architecture for this project.

*   **Three-Tier Architecture:** A clear separation between the frontend (presentation), backend (logic), and database (data).
*   **RESTful API:** The backend provides a clear API for the frontend to consume.
*   **Database Transactions:** The most critical operations, like recording a sale, are wrapped in SQL transactions. This ensures data integrity—for example, stock levels are only updated if the sale record is successfully created.
*   **Single-Page Application (SPA):** The frontend is designed for a smooth user experience with no page reloads. All updates happen dynamically via JavaScript and Fetch API calls.

Thanks for taking the time to review my project! I hope you enjoy testing it out.
```
