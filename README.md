SkillMitra 🤝

Learn • Teach • Connect • Exchange

SkillMitra is a full-stack Skill Exchange Platform where users can discover skills, connect with other users, send skill-exchange requests, and communicate through private chat after a request is accepted.

The platform allows users to teach what they know and learn what they want through skill exchange.

---

🌐 Live Demo

Live Website:
https://skill-exchange-platform-eight-roan.vercel.app

GitHub Repository:
https://github.com/Techguy-19/skill-exchange-platform

---

✨ Features

🔐 Authentication

- User registration
- User login
- JWT authentication
- Password hashing using bcrypt
- Protected routes

💡 Skill Management

- Add skills
- Edit skills
- Delete skills
- Explore available skills
- View user profiles
- Skill categories with dynamic icons

🤝 Exchange Requests

- Send skill exchange requests
- Create custom exchange requests
- View incoming and outgoing requests
- Accept or reject requests
- Pending, Accepted, and Rejected status
- Request date and time tracking
- Response date and time tracking

💬 Private Chat

- Chat available after request acceptance
- Automatic message refresh
- Send messages
- Edit messages
- Delete messages
- Message timestamps
- Today / Yesterday / Date grouping
- Hide and unhide chat

🎨 User Interface

- Responsive design
- Mobile-friendly navigation
- Clean card-based interface
- Custom popup notifications
- SkillMitra branding
- Custom favicon

🛡️ Validation & Security

- Frontend validation
- Backend validation
- JWT-based authorization
- Password hashing
- Protected API endpoints
- User-based request and chat authorization

---

🛠️ Tech Stack

Frontend

- React.js
- Vite
- JavaScript
- HTML5
- CSS3
- React Router

Backend

- Node.js
- Express.js
- REST API
- JWT
- bcrypt
- Multer

Database

- Supabase PostgreSQL

Tools & Deployment

- Git
- GitHub
- Vercel
- Visual Studio Code

--
📌 project Overview

Folder / File| Purpose
"backend/"| Node.js + Express backend and REST APIs
"routes/"| API route definitions
"middleware/"| Authentication and request middleware
"controllers/"| Backend application logic
"config/"| Database and backend configuration
"frontend/"| React + Vite frontend
"components/"| Reusable React components
"pages/"| Main application pages
"public/"| Public assets such as favicon
"App.jsx"| React routing and application structure
"index.css"| Global styling
"vercel.json"| Vercel deployment and routing configuration
"README.md"| Project documentation

🔄 How It Works

Register / Login
       ↓
Create Profile
       ↓
Add Skills
       ↓
Explore Skills
       ↓
Select Another User
       ↓
Send Exchange Request
       ↓
Request Accepted
       ↓
Private Chat Opens
       ↓
Learn & Exchange Skills

---

🧩 Core Modules

1. User Module

Users can:

- Register an account
- Login securely
- Manage their profile
- Add and manage their skills

2. Skill Module

Users can create, update, delete, and explore skills available on the platform.

3. Exchange Request Module

Users can send requests to exchange skills with other users.

Each request stores:

- Sender
- Receiver
- Skill
- Status
- Request timestamp
- Response timestamp

4. Chat Module

After an exchange request is accepted, the two users can communicate privately.

The chat supports:

- Sending messages
- Editing messages
- Deleting messages
- Message timestamps
- Automatic refresh
- Date grouping
- Hide/unhide chat

---

🔌 REST API

The React frontend communicates with the Node.js/Express backend through REST APIs.

Authentication

POST /api/auth/register
POST /api/auth/login

Skills

GET    /api/skills
POST   /api/skills
PUT    /api/skills/:id
DELETE /api/skills/:id

Exchange Requests

GET  /api/requests
POST /api/requests
PUT  /api/requests/:id/status

Messages

GET    /api/messages/:requestId
POST   /api/messages/:requestId
PUT    /api/messages/:id
DELETE /api/messages/:id

---

🗄️ Database

SkillMitra uses Supabase PostgreSQL for storing application data.

The database stores:

- User accounts
- User profiles
- Skills
- Exchange requests
- Request statuses
- Request timestamps
- Chat messages
- Message timestamps
- Message edit/delete information
- Chat visibility information

---

🚀 Getting Started

Prerequisites

Make sure you have installed:

- Node.js
- npm
- Git
- A Supabase project

1. Clone the Repository

git clone https://github.com/Techguy-19/skill-exchange-platform.git

cd skill-exchange-platform

2. Install Backend Dependencies

cd backend
npm install

3. Configure Environment Variables

Create a ".env" file inside the "backend" folder.

Example:

PORT=5000
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret

Add any other environment variables required by the project configuration.

4. Start the Backend

npm start

or:

npm run dev

5. Install Frontend Dependencies

Open another terminal:

cd frontend
npm install

6. Start the Frontend

npm run dev

The application will normally be available at:

http://localhost:5173

---

🔒 Environment Variables

Do not upload ".env" files or sensitive credentials to GitHub.

Keep database credentials, JWT secrets, and other sensitive configuration values inside environment variables.

---

📱 Main Pages

Page| Description
Home| Introduction to SkillMitra
Register| Create a new account
Login| User authentication
Explore Skills| Discover available skills
Profile| Manage personal profile
User Profile| View another user's profile
Requests| Manage exchange requests
Chat| Private communication

---

🔮 Future Enhancements

- Real-time messaging using WebSockets
- Video calling
- Learning session scheduling
- Google Meet integration
- Notifications
- Skill ratings and reviews
- Advanced skill search and filtering
- Exchange history dashboard
- Skill recommendation system

---

🎓 Academic Project

Practical No. 10 – MERN Project

This project demonstrates:

- Full-stack web development
- React frontend
- Node.js and Express backend
- Database integration
- CRUD operations
- REST API integration
- Authentication
- Form validation
- Git and GitHub
- Cloud deployment

---

👨‍💻 Developer

Rahul Bera

BSc Information Technology
Thakur Ramnarayan College of Arts and Commerce
University of Mumbai

---

⭐ Project

If you find this project useful, consider giving the repository a ⭐ on GitHub.

---

SkillMitra 🤝

Learn what you want.
Teach what you know.
Connect with your Skill mitra.
