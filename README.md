# Daily Expenses Sharing Application Backend
![Screenshot (121)](https://github.com/user-attachments/assets/4e3b9877-a3b3-470d-9b02-a7e28c64c3ad)


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
  #### A : Create a MySQL database named expenses_app:
            CREATE DATABASE expenses_app;
  #### B : Create the required tables:
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

  #### C : Configure your .env file in the root folder:
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=your_mysql_password
    DB_NAME=expenses_app

  ### Step 4: Start the Server
    node server.js



  ### Step 5: Test the Application
  Use Postman or your browser to test the endpoints.

  ## API Endpoints
  ### User Endpoints
   1. Create User
      POST /users
      Request Body: json 

    {
      "name": "Rahul Sharma",
      "email": "rahul@example.com",
      "mobile_number": "9876543210"
    }
  2. Retrieve User Details
     GET /users/{id}

## Expense Endpoints
  1. Add Expense
    POST /expenses
    Request Body:  json 
    
    {
      "total_amount": 3000,
      "split_method": "equal",
      "created_by": 1
    }
  2.Retrieve User Expenses
    GET /expenses/user/{userId}
  3.Retrieve All Expenses
    GET /expenses
  4.Download Balance Sheet (Excel)
    GET /expenses/download
  5.Download Balance Sheet (PDF)
    GET /expenses/download-pdf

## Known Issues
  - Ensure MySQL is running and configured properly.
  - Make sure the .env file is properly set up with valid MySQL credentials.

## Contributing
Feel free to submit issues and pull requests. We welcome contributions to improve the functionality of this project!

## Contact
For any queries or issues, contact:
Email: pt.rahulsharma007@gmail.com


  



