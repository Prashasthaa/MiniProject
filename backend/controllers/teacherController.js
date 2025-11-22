import User from '../models/User.js';
import StudentActivity from '../models/StudentActivity.js';
import AcademicRecord from '../models/AcademicRecord.js';
import AcademicAlert from '../models/AcademicAlert.js';
import TeacherRemark from '../models/TeacherRemark.js';
import StudySession from '../models/StudySession.js';

// @desc    Get all students assigned to teacher
// @route   GET /api/teachers/students
// @access  Private (Teacher)
export const getStudents = async (req, res) => {
  try {
    const students = await User.find({
      role: 'student',
      assignedTeacher: req.user._id
    }).select('-password');

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student activities
// @route   GET /api/teachers/students/:id/activities
// @access  Private (Teacher)
export const getStudentActivities = async (req, res) => {
  try {
    const { id } = req.params;

    // Verify student is assigned to this teacher
    const student = await User.findOne({
      _id: id,
      role: 'student',
      assignedTeacher: req.user._id
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found or not assigned to you' });
    }

    const activities = await StudentActivity.find({
      studentId: id
    }).sort({ date: -1 }).limit(50);

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student study sessions
// @route   GET /api/teachers/students/:id/sessions
// @access  Private (Teacher)
export const getStudentSessions = async (req, res) => {
  try {
    const { id } = req.params;

    // Verify student is assigned to this teacher
    const student = await User.findOne({
      _id: id,
      role: 'student',
      assignedTeacher: req.user._id
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found or not assigned to you' });
    }

    const sessions = await StudySession.find({
      studentId: id
    }).sort({ startTime: -1 }).limit(20);

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add academic score and check for alerts
// @route   POST /api/teachers/score
// @access  Private (Teacher)
export const addScore = async (req, res) => {
  try {
    const { studentId, subject, score, maxScore, examType, remarks } = req.body;

    // Verify student is assigned to this teacher
    const student = await User.findOne({
      _id: studentId,
      role: 'student',
      assignedTeacher: req.user._id
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found or not assigned to you' });
    }

    // Create academic record
    const record = await AcademicRecord.create({
      studentId,
      teacherId: req.user._id,
      subject,
      score,
      maxScore: maxScore || 100,
      examType,
      remarks
    });

    // Check for academic drop (compare with previous score)
    const previousRecords = await AcademicRecord.find({
      studentId,
      subject,
      _id: { $ne: record._id }
    }).sort({ date: -1 }).limit(1);

    if (previousRecords.length > 0) {
      const previousScore = previousRecords[0].score;
      const currentScore = score;

      // Alert if current score <= previous score * 0.8 (20% drop)
      if (currentScore <= previousScore * 0.8) {
        const dropPercentage = ((previousScore - currentScore) / previousScore) * 100;

        await AcademicAlert.create({
          studentId,
          teacherId: req.user._id,
          subject,
          previousScore,
          currentScore,
          dropPercentage: dropPercentage.toFixed(2),
          alertMessage: `Academic performance dropped by ${dropPercentage.toFixed(1)}% in ${subject}. Previous: ${previousScore}, Current: ${currentScore}`
        });
      }
    }

    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all academic alerts
// @route   GET /api/teachers/alerts
// @access  Private (Teacher)
export const getAlerts = async (req, res) => {
  try {
    const alerts = await AcademicAlert.find({
      teacherId: req.user._id,
      isResolved: false
    })
      .populate('studentId', 'username fullName')
      .sort({ date: -1 });

    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Resolve an alert
// @route   PUT /api/teachers/alerts/:id/resolve
// @access  Private (Teacher)
export const resolveAlert = async (req, res) => {
  try {
    const alert = await AcademicAlert.findOne({
      _id: req.params.id,
      teacherId: req.user._id
    });

    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    alert.isResolved = true;
    await alert.save();

    res.json(alert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add teacher remark
// @route   POST /api/teachers/remark
// @access  Private (Teacher)
export const addRemark = async (req, res) => {
  try {
    const { studentId, subject, remark, type } = req.body;

    // Verify student is assigned to this teacher
    const student = await User.findOne({
      _id: studentId,
      role: 'student',
      assignedTeacher: req.user._id
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found or not assigned to you' });
    }

    const teacherRemark = await TeacherRemark.create({
      studentId,
      teacherId: req.user._id,
      subject,
      remark,
      type
    });

    res.status(201).json(teacherRemark);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student academic records
// @route   GET /api/teachers/students/:id/records
// @access  Private (Teacher)
export const getStudentRecords = async (req, res) => {
  try {
    const { id } = req.params;

    // Verify student is assigned to this teacher
    const student = await User.findOne({
      _id: id,
      role: 'student',
      assignedTeacher: req.user._id
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found or not assigned to you' });
    }

    const records = await AcademicRecord.find({
      studentId: id
    }).sort({ date: -1 });

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

