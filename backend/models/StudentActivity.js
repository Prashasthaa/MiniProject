import mongoose from 'mongoose';

const studentActivitySchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  activityType: {
    type: String,
    enum: ['assignment', 'reading', 'practice', 'project', 'other'],
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const StudentActivity = mongoose.model('StudentActivity', studentActivitySchema);

export default StudentActivity;

