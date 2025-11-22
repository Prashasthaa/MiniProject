import mongoose from 'mongoose';

const academicRecordSchema = new mongoose.Schema({
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
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  maxScore: {
    type: Number,
    default: 100
  },
  examType: {
    type: String,
    enum: ['quiz', 'midterm', 'final', 'assignment', 'project'],
    required: true
  },
  remarks: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const AcademicRecord = mongoose.model('AcademicRecord', academicRecordSchema);

export default AcademicRecord;

