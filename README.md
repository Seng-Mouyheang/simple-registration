## 📄 Simple User Registration App
A simple web application that allows users to register by submitting a form with their details and a profile picture. The application demonstrates a data flow pattern with:
- Form rendering with Tailwind CSS styling
- Server-side file upload handling using the multiparty library
- Data validation and processing logic
- Dynamic profile view rendering with user-submitted data

This project was created as part of a university assignment and focuses on building an Express.js application that handles multipart/form-data submissions and manages static file uploads.

### 🛠️ Development Tools:
HTML / CSS / Tailwind CSS / Node.js / Express.js / Handlebars (HBS) / Multiparty / VS Code

### 📚 Course Information
Course: INF653 – Backend Web Development
Assignment: Homework 7 – Form Submission (Simple User Registration App)

### 🎯 Objective
The objective of this assignment is to build a registration application that handles form submissions and file uploads by implementing:
- A registration form with specific field types
- Backend route logic to parse multipart data
- File system operations to save uploaded images
- Data validation for required fields and file types
- Dynamic profile rendering to display the user's submitted information

### 🧭 Routes Configuration
The application includes the following routes:
- / - Home page
- /register - Register page
  - GET /register
  - POST /register
- /profile - Profile page (redirect from register after submited a form)

A catch-all route is also implemented to handle undefined paths:
- Displays a error message
