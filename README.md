# Employee Leave Management System 🌴

A basic, full-stack application designed to automate the process of requesting and approving employee leave, aiming for transparency and efficiency in managing absences within a small company.

## 🚀 Project Overview

This system streamlines the tedious manual process of leave management. Employees can easily submit leave requests, while managers have a clear workflow to review, approve, or reject these requests. The system also tracks leave balances and visualizes approved leaves on a calendar, providing a comprehensive solution for managing employee time-off.

---

## ✨ Features

The system is built to address the following core requirements:

1.  **User Authentication:**
    * Secure login functionality for both employees and managers.
    * Distinct user roles (`employee`, `manager`) with different permissions.

2.  **Leave Request Submission:**
    * A user-friendly form for employees to submit leave requests.
    * Details include leave type (e.g., Vacation, Sick Leave, Unpaid), start date, end date, and reason.
    * Input validation to ensure data completeness and accuracy.

3.  **Leave Approval Workflow:**
    * Submitted leave requests are routed to the appropriate manager for review.
    * Managers can approve or reject requests and provide comments.

4.  **Leave Balances:**
    * Functionality to track and manage employee leave balances (e.g., accrued vacation days, sick leave).
    * Automatic updates to leave balances upon approval or rejection of requests.

5.  **Leave Calendar:**
    * A clear calendar view displaying employee leave schedules and availability.
    * Highlights approved leave requests for easy visualization of employee absences.

---

## 🛠️ Technologies Used

* **Frontend:** **React.js** (for building interactive user interfaces)
* **Backend:** **Node.js** (for building RESTful APIs)
* **Database:** **MySQL** (for data storage and management)

---

## 🔗 GitHub Repository

You can access the full codebase here:
<https://github.com/thevickykumar/Leave_app.git>

---

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

* **Node.js** (LTS version recommended)
* **npm** (comes with Node.js)
* **MySQL Server** (and a client like MySQL Workbench for initial setup)

### Setup Instructions

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/thevickykumar/Leave_app.git](https://github.com/thevickykumar/Leave_app.git)
    cd Leave_app
    ```

2.  **Database Setup:**
    * Open your MySQL client (e.g., MySQL Workbench).
    * Create a new database.
    * Run the provided SQL script to set up the necessary tables and initial data (if any). The script will likely be in a file named `schema.sql` or similar within your backend directory.
        ```sql
        CREATE DATABASE leavelite CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
        USE leavelite;
        -- (then paste your table creation scripts here)
        ```
    * **Backend `.env` configuration:**
        * Navigate to the `leavelite-backend` folder.
        * Create a `.env` file based on the `.env.example` file (if provided) and fill in your MySQL credentials and other environment variables.
            ```
            PORT=4000
            DB_HOST=127.0.0.1
            DB_USER=your_mysql_username
            DB_PASSWORD=your_mysql_password
            DB_NAME=leavelite
            JWT_SECRET=supersecret_change_me_to_a_strong_key
            CORS_ORIGIN=http://localhost:5173
            ```

3.  **Install Dependencies (Backend):**
    * Navigate into the `leavelite-backend` directory:
        ```bash
        cd leavelite-backend
        ```
    * Install Node.js dependencies:
        ```bash
        npm install
        ```

4.  **Install Dependencies (Frontend):**
    * Navigate into the `leavelite-frontend` directory:
        ```bash
        cd ../leavelite-frontend
        ```
    * Create a `.env` file in `leavelite-frontend` based on `.env.example` (if provided).
    * Install React dependencies:
        ```bash
        npm install
        ```
    * **Frontend `tailwind.config.cjs` fix:**
        * If you encounter a `require() of ES Module` error for `tailwind.config.js`, **rename `tailwind.config.js` to `tailwind.config.cjs`**.
        * Ensure its content uses `module.exports = { ... }` instead of `export default { ... }`.

5.  **Run the Project:**
    * **Start the Backend:** Open a new terminal window, navigate to `leavelite-backend`, and run:
        ```bash
        npm run dev
        ```
    * **Start the Frontend:** Open another new terminal window, navigate to `leavelite-frontend`, and run:
        ```bash
        npm run dev
        ```

Your application should now be running!
