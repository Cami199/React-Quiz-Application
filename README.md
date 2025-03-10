# Getting Started with Create React App

## Steps to Set Up and Run the Application

1. Navigate to the project folder, where you will find a file named **quiz_db.sql**.
2. Import **quiz_db.sql** into your MySQL database to set up the necessary tables and data.
3. Inside the **quiz** folder, there is a **backend** folder that contains a file called **server.js**.
4. Start your MySQL database. Then, navigate to the **backend** folder and start the backend server using the command:
   ```sh
   node server.js
   ```
5. Once the backend is running, start the React frontend by running the following command in the project root:
   ```sh
   yarn start
   ```
6. After completing these steps, the landing page will load, displaying a login form.
7. To log in as an admin, use the following credentials:
   - **Email**: `admin@example.com`
   - **Password**: `admin123`
8. After logging in, the dashboard will load, featuring a top navigation bar and two buttons:
   - **Add User**
   - **Create Quiz**
9. In the top-left corner of the dashboard, there is a **hamburger menu**. Clicking on it will open the side navigation panel, which includes various features such as:
   - **Settings**
   - **View Scores**
   - **Edit or Delete Questions**

## Playing the Quiz

1. Click the **Back** button on your browser to return to the login form.
2. On the login page, click the **Play Me** button.
3. A dialog box will appear, displaying a list of users.
4. Select your name from the list and click the **Play** button to start the quiz.

This documentation provides a step-by-step guide to setting up and using the web application so that my friend can follow along easily.

