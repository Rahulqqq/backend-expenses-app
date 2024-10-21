## Daily Expenses Sharing Application Backend

  ## Project Overview
  This project provides the backend for a daily expenses sharing application. Users can manage expenses and split them with friends using three different methods: equal, exact amounts, and percentage-based splits. The backend handles user management, expense tracking, and provides functionality to generate balance sheets in Excel or PDF formats.

  ## Features
  1. User Management: Create and retrieve users.
  2. Expense Management: Add expenses and split them using:
      - Equal Split
      - Exact Amounts
      - Percentage-based Split
3. Balance Sheet: Generate and download a balance sheet in Excel or PDF.
4. Validation: Ensure input correctness (e.g., percentages add up to 100%).

 ## Tech Stack
  1. Backend Framework: Node.js (Express)
  2. Database: MySQL
  3. Libraries Used:
   * mysql2 – MySQL database connection
   * dotenv – Environment variables management
   * exceljs – Generate Excel sheets
   * pdfkit – Generate PDFs
   * body-parser – Parse JSON requests

  ## Installation Instructions
   ### Step 1: Clone the Repository
        git clone <your-github-repo-url>
        cd backend-expenses-app

  ### Step 2: Install Dependencies
    npm install

  ### Step 3: Configure MySQL Database
 # A : Create a MySQL database named expenses_app:
            CREATE DATABASE expenses_app;
  # B : Create the required tables:
            CREATE TABLE users (
              id INT AUTO_INCREMENT PRIMARY KEY,
              name VARCHAR(100),
              email VARCHAR(100) UNIQUE,
              mobile_number VARCHAR(15)
            );

            CREATE TABLE expenses (
                id INT AUTO_INCREMENT PRIMARY KEY,
                total_amount DECIMAL(10, 2),
                split_method VARCHAR(10),
                created_by INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (created_by) REFERENCES users(id)
            );

            CREATE TABLE expense_participants (
                id INT AUTO_INCREMENT PRIMARY KEY,
                expense_id INT,
                user_id INT,
                amount_owed DECIMAL(10, 2),
                FOREIGN KEY (expense_id) REFERENCES expenses(id),
                FOREIGN KEY (user_id) REFERENCES users(id)
            );

  ### C : Configure your .env file in the root folder:
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=your_mysql_password
    DB_NAME=expenses_app
    


  



