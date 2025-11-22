# LearnGuardian - Quick Setup Guide

Follow these steps to get LearnGuardian up and running on your local machine.

## Step 1: Prerequisites Check

Make sure you have installed:
- ✅ Node.js (v16+): `node --version`
- ✅ MongoDB: `mongod --version`
- ✅ npm or yarn: `npm --version`

## Step 2: Clone and Navigate

```bash
cd Mini-project
```

## Step 3: Backend Setup

### Install Backend Dependencies
```bash
cd backend
npm install
```

### Start MongoDB
**Windows:**
```bash
net start MongoDB
```

**macOS/Linux:**
```bash
sudo systemctl start mongod
# or
brew services start mongodb-community
```

### Start Backend Server
```bash
npm run dev
```

✅ Backend should be running on `http://localhost:5000`

## Step 4: Frontend Setup (New Terminal)

### Install Frontend Dependencies
```bash
cd frontend
npm install
```

### Start Frontend Development Server
```bash
npm run dev
```

✅ Frontend should be running on `http://localhost:3000`

## Step 5: Create Demo Users

You need to create users before you can log in. Use any HTTP client (Postman, curl, or Thunder Client in VS Code).

### Method 1: Using curl

#### 1. Create a Teacher
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"teacher1\",\"password\":\"password123\",\"role\":\"teacher\",\"fullName\":\"John Doe\"}"
```

**Copy the `_id` from the response - you'll need it for the student!**

#### 2. Create a Student
Replace `<TEACHER_ID>` with the ID from step 1:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"student1\",\"password\":\"password123\",\"role\":\"student\",\"fullName\":\"Jane Smith\",\"assignedTeacher\":\"<TEACHER_ID>\"}"
```

**Copy the `_id` from the response - you'll need it for the parent!**

#### 3. Create a Parent
Replace `<STUDENT_ID>` with the ID from step 2:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"parent1\",\"password\":\"password123\",\"role\":\"parent\",\"fullName\":\"Mary Smith\",\"childId\":\"<STUDENT_ID>\"}"
```

### Method 2: Using Postman

1. **Create Teacher**
   - Method: POST
   - URL: `http://localhost:5000/api/auth/register`
   - Body (JSON):
   ```json
   {
     "username": "teacher1",
     "password": "password123",
     "role": "teacher",
     "fullName": "John Doe"
   }
   ```

2. **Create Student**
   - Method: POST
   - URL: `http://localhost:5000/api/auth/register`
   - Body (JSON):
   ```json
   {
     "username": "student1",
     "password": "password123",
     "role": "student",
     "fullName": "Jane Smith",
     "assignedTeacher": "<PASTE_TEACHER_ID_HERE>"
   }
   ```

3. **Create Parent**
   - Method: POST
   - URL: `http://localhost:5000/api/auth/register`
   - Body (JSON):
   ```json
   {
     "username": "parent1",
     "password": "password123",
     "role": "parent",
     "fullName": "Mary Smith",
     "childId": "<PASTE_STUDENT_ID_HERE>"
   }
   ```

## Step 6: Login and Test

Open your browser and go to `http://localhost:3000`

### Login Credentials:
- **Student**: `student1` / `password123`
- **Teacher**: `teacher1` / `password123`
- **Parent**: `parent1` / `password123`

## Step 7: Test the Application

### As a Student:
1. Log an academic activity
2. Start a study session
3. View focus exercises

### As a Teacher:
1. View your students
2. Add an academic score
3. Check if alerts are generated (add a low score to trigger)

### As a Parent:
1. View child's overview
2. Check performance trends
3. View teacher remarks

## Common Issues & Solutions

### Issue: MongoDB Connection Failed
**Solution**: Make sure MongoDB is running:
```bash
# Check if MongoDB is running
mongosh

# If not, start it
# Windows: net start MongoDB
# Mac/Linux: brew services start mongodb-community
```

### Issue: Port Already in Use
**Solution**: Change the port in `.env` (backend) or `vite.config.js` (frontend)

### Issue: Cannot Login
**Solution**: Make sure you've created users and the backend is running

### Issue: Alerts Not Showing
**Solution**: 
1. As teacher, add a score for a student
2. Then add another score that's 20% lower
3. Example: First score: 90, Second score: 70 or below

## Quick Test Scenario

To see the academic alert system in action:

1. **Login as Teacher** (`teacher1` / `password123`)
2. **Add First Score**: 
   - Student: Jane Smith
   - Subject: Mathematics
   - Score: 90
   - Type: Quiz
3. **Add Second Score** (lower):
   - Student: Jane Smith
   - Subject: Mathematics
   - Score: 70
   - Type: Quiz
4. **Check Alerts Tab** - You should see an alert!
5. **Login as Parent** (`parent1` / `password123`)
6. **Check Alerts Tab** - Parents can also see the alert!

## Need Help?

Check the main README.md for more detailed information about:
- API endpoints
- Project structure
- Feature documentation
- Deployment guidelines

---

**You're all set! Enjoy using LearnGuardian! 🎓**

