# LearnGuardian

**LearnGuardian** is a comprehensive 3-role academic monitoring and productivity system built with the MERN stack (MongoDB, Express.js, React, Node.js). It enables students to track their academic activities, teachers to monitor performance and receive alerts, and parents to view academic summaries.

## Features

### 👨‍🎓 Student Features
- Log daily academic activities (assignments, reading, practice, projects)
- Start and end study sessions with time tracking
- View activity history and study session logs
- Access focus exercise suggestions for better productivity
- Real-time session tracking

### 👩‍🏫 Teacher Features
- View and manage assigned students
- Monitor student activities and study sessions
- Add academic scores and grades
- Automatic academic performance alerts (20% drop detection)
- Add remarks and comments for students
- View and resolve academic alerts
- Comprehensive student performance tracking

### 👨‍👩‍👧 Parent Features
- View child's academic summary and statistics
- Access teacher remarks and feedback
- Receive academic performance alerts
- Track performance trends by subject
- Weekly activity overview
- Study time analytics

## Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt.js** - Password hashing

### Frontend
- **React.js** - UI framework
- **Vite** - Build tool
- **React Router DOM** - Routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Context API** - State management

## Project Structure

```
Mini-project/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── studentController.js
│   │   ├── teacherController.js
│   │   └── parentController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── StudentActivity.js
│   │   ├── StudySession.js
│   │   ├── AcademicRecord.js
│   │   ├── AcademicAlert.js
│   │   └── TeacherRemark.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── studentRoutes.js
│   │   ├── teacherRoutes.js
│   │   └── parentRoutes.js
│   ├── .gitignore
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── TeacherDashboard.jsx
│   │   │   └── ParentDashboard.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/learnguardian
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

4. Start MongoDB (if running locally):
```bash
# On Windows
net start MongoDB

# On macOS/Linux
sudo systemctl start mongod
```

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Database Setup & Demo Users

To get started quickly, you'll need to create demo users. You can do this by making POST requests to the register endpoint or using MongoDB directly.

### Creating Demo Users via API

Use Postman, curl, or any HTTP client to create users:

#### Create a Teacher
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "teacher1",
    "password": "password123",
    "role": "teacher",
    "fullName": "John Doe"
  }'
```

#### Create a Student
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "student1",
    "password": "password123",
    "role": "student",
    "fullName": "Jane Smith",
    "assignedTeacher": "<TEACHER_ID_FROM_ABOVE>"
  }'
```

#### Create a Parent
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "parent1",
    "password": "password123",
    "role": "parent",
    "fullName": "Mary Smith",
    "childId": "<STUDENT_ID_FROM_ABOVE>"
  }'
```

### Demo Credentials

After setup, you can login with:
- **Student**: `student1` / `password123`
- **Teacher**: `teacher1` / `password123`
- **Parent**: `parent1` / `password123`

## Key Features Explained

### Academic Drop Alert System

The system automatically monitors student performance and creates alerts when:
- A student's current score is ≤ 80% of their previous score in the same subject
- This represents a 20% or greater performance drop

**Example**: If a student scores 90 on a previous test and then scores 70 on the next test (70 ≤ 90 * 0.8 = 72), an alert is automatically generated and sent to both the teacher and parent.

### Role-Based Access Control

The application uses JWT-based authentication with role-based middleware:
- **Students** can only access student routes
- **Teachers** can only access teacher routes
- **Parents** can only access parent routes

Routes are protected and redirect unauthorized users.

### Study Session Tracking

Students can:
- Start a study session with optional subject and notes
- Only one active session at a time
- End sessions to calculate duration
- View session history

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Student Routes (Protected - Student Role)
- `POST /api/students/activity` - Create activity
- `GET /api/students/activity/today` - Get today's activities
- `GET /api/students/activity` - Get all activities
- `POST /api/students/session/start` - Start study session
- `POST /api/students/session/end` - End study session
- `GET /api/students/session/active` - Get active session
- `GET /api/students/sessions` - Get all sessions
- `GET /api/students/exercises` - Get focus exercises

### Teacher Routes (Protected - Teacher Role)
- `GET /api/teachers/students` - Get assigned students
- `GET /api/teachers/students/:id/activities` - Get student activities
- `GET /api/teachers/students/:id/sessions` - Get student sessions
- `GET /api/teachers/students/:id/records` - Get student records
- `POST /api/teachers/score` - Add academic score
- `POST /api/teachers/remark` - Add remark
- `GET /api/teachers/alerts` - Get alerts
- `PUT /api/teachers/alerts/:id/resolve` - Resolve alert

### Parent Routes (Protected - Parent Role)
- `GET /api/parents/status` - Get child status
- `GET /api/parents/remarks` - Get teacher remarks
- `GET /api/parents/alerts` - Get alerts
- `GET /api/parents/performance` - Get performance data

## Production Deployment

### Backend Deployment (e.g., Heroku, Railway)

1. Set environment variables:
```env
PORT=5000
MONGODB_URI=<your_mongodb_atlas_uri>
JWT_SECRET=<strong_secret_key>
NODE_ENV=production
```

2. Build and deploy:
```bash
git push heroku main
```

### Frontend Deployment (e.g., Vercel, Netlify)

1. Build the frontend:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting service

3. Update the API base URL in `frontend/vite.config.js` to point to your production backend

## Future Enhancements

- [ ] Email notifications for alerts
- [ ] Data visualization charts and graphs
- [ ] Mobile app version
- [ ] Integration with external learning platforms
- [ ] AI-powered study recommendations
- [ ] Group study features
- [ ] Calendar integration
- [ ] File upload for assignments
- [ ] Real-time chat between teachers and students
- [ ] Advanced analytics dashboard

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For issues or questions, please open an issue on the GitHub repository.

---

**Built with ❤️ using the MERN Stack**

