import User from '../models/User.js';
import AcademicRecord from '../models/AcademicRecord.js';
import AcademicAlert from '../models/AcademicAlert.js';
import TeacherRemark from '../models/TeacherRemark.js';
import StudentActivity from '../models/StudentActivity.js';
import StudySession from '../models/StudySession.js';

// @desc    Get child's academic status
// @route   GET /api/parents/status
// @access  Private (Parent)
export const getChildStatus = async (req, res) => {
  try {
    const parent = await User.findById(req.user._id);

    if (!parent.childId) {
      return res.status(400).json({ message: 'No child assigned to this parent account' });
    }

    const child = await User.findById(parent.childId).select('-password');

    if (!child) {
      return res.status(404).json({ message: 'Child not found' });
    }

    // Get recent academic records
    const recentRecords = await AcademicRecord.find({
      studentId: child._id
    })
      .sort({ date: -1 })
      .limit(10)
      .populate('teacherId', 'fullName');

    // Get recent activities
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - 7);

    const recentActivities = await StudentActivity.find({
      studentId: child._id,
      date: { $gte: startOfWeek }
    }).sort({ date: -1 });

    // Get recent study sessions
    const recentSessions = await StudySession.find({
      studentId: child._id,
      startTime: { $gte: startOfWeek },
      isActive: false
    }).sort({ startTime: -1 });

    // Calculate statistics
    const totalStudyTime = recentSessions.reduce((acc, session) => acc + (session.duration || 0), 0);
    const avgScore = recentRecords.length > 0
      ? recentRecords.reduce((acc, record) => acc + record.score, 0) / recentRecords.length
      : 0;

    res.json({
      child: {
        _id: child._id,
        username: child.username,
        fullName: child.fullName
      },
      statistics: {
        totalStudyTime,
        activitiesThisWeek: recentActivities.length,
        averageScore: avgScore.toFixed(2),
        recentRecordsCount: recentRecords.length
      },
      recentRecords,
      recentActivities,
      recentSessions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get teacher remarks for child
// @route   GET /api/parents/remarks
// @access  Private (Parent)
export const getRemarks = async (req, res) => {
  try {
    const parent = await User.findById(req.user._id);

    if (!parent.childId) {
      return res.status(400).json({ message: 'No child assigned to this parent account' });
    }

    const remarks = await TeacherRemark.find({
      studentId: parent.childId
    })
      .populate('teacherId', 'fullName')
      .sort({ date: -1 })
      .limit(20);

    res.json(remarks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get academic alerts for child
// @route   GET /api/parents/alerts
// @access  Private (Parent)
export const getAlerts = async (req, res) => {
  try {
    const parent = await User.findById(req.user._id);

    if (!parent.childId) {
      return res.status(400).json({ message: 'No child assigned to this parent account' });
    }

    const alerts = await AcademicAlert.find({
      studentId: parent.childId
    })
      .populate('teacherId', 'fullName')
      .sort({ date: -1 });

    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get child's performance trend
// @route   GET /api/parents/performance
// @access  Private (Parent)
export const getPerformance = async (req, res) => {
  try {
    const parent = await User.findById(req.user._id);

    if (!parent.childId) {
      return res.status(400).json({ message: 'No child assigned to this parent account' });
    }

    const records = await AcademicRecord.find({
      studentId: parent.childId
    })
      .sort({ date: 1 })
      .populate('teacherId', 'fullName');

    // Group by subject
    const performanceBySubject = {};

    records.forEach(record => {
      if (!performanceBySubject[record.subject]) {
        performanceBySubject[record.subject] = [];
      }
      performanceBySubject[record.subject].push({
        score: record.score,
        date: record.date,
        examType: record.examType,
        teacher: record.teacherId?.fullName
      });
    });

    res.json({
      performanceBySubject,
      allRecords: records
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

