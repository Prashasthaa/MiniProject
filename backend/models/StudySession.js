import mongoose from 'mongoose';

const studySessionSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date
  },
  duration: {
    type: Number // in minutes
  },
  subject: {
    type: String
  },
  notes: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const StudySession = mongoose.model('StudySession', studySessionSchema);

export default StudySession;

