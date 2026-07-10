# Online Exam Portal

A full-stack web application designed for educational institutions to conduct, manage, and evaluate online examinations seamlessly. The system supports three distinct user roles: **Admin**, **Teacher**, and **Student**, providing tailored interfaces and functionalities for each.

---

## 🛠 Tech Stack

- **Backend:** Node.js, Express.js, MongoDB (Atlas), Mongoose
- **Frontend:** React.js, Redux, Material-UI (MUI v4)
- **Authentication:** JSON Web Tokens (JWT), Passport.js
- **File Handling:** Multer (for question/option images)

---

## 🏗 Project Structure

The repository is divided into three main applications:

1. **`backend/`**
   - The core REST API server. Handles authentication, database modeling, business logic, file uploads (images), and test evaluation.
2. **`user-portal-frontend/`**
   - The React application used by **Teachers** and **Students**. Includes custom modern Material-UI styling.
3. **`frontend/`**
   - The React application used by the **Admin** for global management and teacher approvals.

---

## ✨ Features

### 👨‍💼 Admin Portal (`frontend`)
- **Teacher Approval Workflow:** All teacher registrations remain pending until explicitly reviewed and approved by an admin.
- **Global Management:** Ability to manage system-wide settings, users, and core data.

### 👩‍🏫 Teacher Portal (`user-portal-frontend`)
- **Class & Subject Management:** Create and manage classes. Assign specific subjects and enroll students into those classes.
- **Question Bank:** Build a repository of questions.
  - Supports text and **image uploads** for both the question body and multiple-choice options.
  - Create, read, update, and delete (CRUD) operations on questions.
- **Exam Creation & Scheduling:** 
  - Create tests by defining titles, target classes, subjects, duration, and scheduling (registration start/end, test start/end, and result declaration times).
  - Dynamically add questions from the question bank to the test paper.
- **Monitoring & Results:** View the status of all created tests and inspect the calculated results and scores of students who have completed them.

### 🎓 Student Portal (`user-portal-frontend`)
- **Exam Registration:** View a list of upcoming tests assigned to their class and register for them before the deadline.
- **Robust "Take Test" Interface:**
  - **Accurate Timer:** A highly accurate countdown timer synced with system time to avoid drift or browser-throttling issues.
  - **Auto-Save:** Answers are periodically auto-saved to the backend (every 60 seconds) to prevent data loss in case of accidental disconnections.
  - **Auto-Submit:** If the student fails to submit the exam manually, the system strictly enforces the time limit and automatically submits all saved answers the exact moment the timer hits zero.
  - **Rich Media:** View questions and options containing embedded images.
- **Result Evaluation:** After the result declaration time, students can view their detailed scorecard, including total marks, obtained marks, and question-by-question analysis.

---

## 🎨 UI/UX Highlights

The `user-portal-frontend` has undergone a massive modern UI overhaul:
- **Custom Material-UI Theme:** A sleek Indigo (`#4338ca`) and Vibrant Pink (`#ec4899`) color palette.
- **Typography:** Uses the modern **Inter** font family for all text elements.
- **Polished Layouts:** Clean, responsive grid layouts with soft background colors (`#f4f7f6`), elevated rounded cards (`border-radius: 12px`), and subtle hover transitions on interactive elements.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+ recommended)
- MongoDB Atlas cluster (or local instance)

### 1. Backend Setup
```bash
cd backend
npm install
```
- Update `backend/config/default.json` with your MongoDB connection string and JWT secret.
- Start the server:
```bash
npm start
```
*(Server runs on port 5000 by default)*

### 2. User Portal (Teacher/Student) Setup
```bash
cd user-portal-frontend
npm install
npm start
```
*(Runs on port 3000)*

### 3. Admin Portal Setup
```bash
cd frontend
npm install
npm start
```
*(Runs on an alternative port, e.g., 3001)*

---

## 🔒 Security
- Passwords are securely hashed before storing in the database.
- Route protection is strictly enforced via JWT strategies; unauthorized users are blocked at the API level and redirected at the frontend level.
- Test integrity checks on the backend ensure students cannot take exams outside the designated time window or after submission.
