import mongoose from 'mongoose';

const academicAlertSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  previousScore: {
    type: Number,
    required: true
  },
  currentScore: {
    type: Number,
    required: true
  },
  dropPercentage: {
    type: Number,
    required: true
  },
  alertMessage: {
    type: String,
    required: true
  },
  isResolved: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const AcademicAlert = mongoose.model('AcademicAlert', academicAlertSchema);

export default AcademicAlert;

