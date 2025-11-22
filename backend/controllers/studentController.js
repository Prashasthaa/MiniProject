import StudentActivity from '../models/StudentActivity.js';
import StudySession from '../models/StudySession.js';

// @desc    Create a new activity
// @route   POST /api/students/activity
// @access  Private (Student)
export const createActivity = async (req, res) => {
  try {
    const { activityType, subject, description, duration } = req.body;

    const activity = await StudentActivity.create({
      studentId: req.user._id,
      activityType,
      subject,
      description,
      duration
    });

    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get today's activities
// @route   GET /api/students/activity/today
// @access  Private (Student)
export const getTodayActivities = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const activities = await StudentActivity.find({
      studentId: req.user._id,
      date: { $gte: startOfDay, $lte: endOfDay }
    }).sort({ date: -1 });

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all activities
// @route   GET /api/students/activity
// @access  Private (Student)
export const getAllActivities = async (req, res) => {
  try {
    const activities = await StudentActivity.find({
      studentId: req.user._id
    }).sort({ date: -1 }).limit(50);

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Start study session
// @route   POST /api/students/session/start
// @access  Private (Student)
export const startSession = async (req, res) => {
  try {
    const { subject, notes } = req.body;

    // Check if there's an active session
    const activeSession = await StudySession.findOne({
      studentId: req.user._id,
      isActive: true
    });

    if (activeSession) {
      return res.status(400).json({ message: 'You already have an active study session' });
    }

    const session = await StudySession.create({
      studentId: req.user._id,
      startTime: new Date(),
      subject,
      notes,
      isActive: true
    });

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    End study session
// @route   POST /api/students/session/end
// @access  Private (Student)
export const endSession = async (req, res) => {
  try {
    const { sessionId, notes } = req.body;

    const session = await StudySession.findOne({
      _id: sessionId,
      studentId: req.user._id,
      isActive: true
    });

    if (!session) {
      return res.status(404).json({ message: 'Active session not found' });
    }

    const endTime = new Date();
    const duration = Math.round((endTime - session.startTime) / (1000 * 60)); // in minutes

    session.endTime = endTime;
    session.duration = duration;
    session.isActive = false;
    if (notes) session.notes = notes;

    await session.save();

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get active session
// @route   GET /api/students/session/active
// @access  Private (Student)
export const getActiveSession = async (req, res) => {
  try {
    const session = await StudySession.findOne({
      studentId: req.user._id,
      isActive: true
    });

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get study sessions
// @route   GET /api/students/sessions
// @access  Private (Student)
export const getSessions = async (req, res) => {
  try {
    const sessions = await StudySession.find({
      studentId: req.user._id
    }).sort({ startTime: -1 }).limit(20);

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get focus exercises (static suggestions)
// @route   GET /api/students/exercises
// @access  Private (Student)
export const getExercises = async (req, res) => {
  try {
    const exercises = [
      {
        id: 1,
        title: 'Pomodoro Technique',
        description: 'Study for 25 minutes, then take a 5-minute break',
        duration: '25 min',
        type: 'focus'
      },
      {
        id: 2,
        title: 'Deep Breathing',
        description: 'Take 10 deep breaths to calm your mind before studying',
        duration: '5 min',
        type: 'relaxation'
      },
      {
        id: 3,
        title: 'Active Recall',
        description: 'After reading, close your book and write down what you remember',
        duration: '15 min',
        type: 'learning'
      },
      {
        id: 4,
        title: 'Spaced Repetition',
        description: 'Review material at increasing intervals: 1 day, 3 days, 7 days',
        duration: '10 min',
        type: 'review'
      },
      {
        id: 5,
        title: 'Mind Mapping',
        description: 'Create a visual diagram connecting key concepts',
        duration: '20 min',
        type: 'learning'
      }
    ];

    res.json(exercises);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

