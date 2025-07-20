🍽️ Food Ordering Website – Setup Guide

This guide will help you set up the Foodapp project locally, including cloning the repository, installing dependencies, setting up the MySQL database, and running the application.

📋 Prerequisites

Before you begin, ensure the following are installed on your system:

Git → Install Git

MySQL → Install MySQL

Node.js (or other runtime such as Python or PHP, based on your project)

⚠️ Ensure MySQL is accessible via the command line. You can verify this by running:

bash
mysql --version

🚀 Project Setup Instructions

1. Clone the Repository

bash
git clone https://github.com/your-username/your-repo.git
cd your-repo

Replace https://github.com/your-username/your-repo.git with your actual repository URL.

2. Install Project Dependencies

For Node.js projects:

bash
npm install

If you're using a different runtime (e.g., Python or PHP), follow the respective method for dependency installation.

3. Configure MySQL

✅ Ensure MySQL is Accessible

Windows: Add MySQL to your system PATH.

Example: C:\Program Files\MySQL\MySQL Server 8.0\bin

Linux/Mac: Add to your shell configuration file:

bash
export PATH=$PATH:/usr/local/mysql/bin

Restart your terminal after modifying the PATH.

4. Import the MySQL Database

📅 Download the Database Dump

Get database_dump.sql from: [insert secure download link]

🛠️ Create and Import Database

Log in to MySQL:

bash
mysql -u your-username -p

Create the database:

sql
CREATE DATABASE foodapp;
EXIT;

Import the dump file:

bash
mysql -u your-username -p foodapp < path/to/database_dump.sql

Replace your-username with your actual MySQL username (e.g., root).Replace path/to/database_dump.sql with the actual file path (e.g., ~/Downloads/database_dump.sql or C:\Users\YourName\Downloads\database_dump.sql).

Verify import:

bash
mysql -u your-username -p
USE foodapp;
SHOW TABLES;

You should see a list of tables from the foodapp database.

5. Run the Application

For Node.js projects:

bash
npm start

Once the server is running, open your browser and go to:

http://localhost:3000

or

http://localhost:8000

(depending on how your project is configured)
