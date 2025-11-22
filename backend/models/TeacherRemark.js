import mongoose from 'mongoose';

const teacherRemarkSchema = new mongoose.Schema({
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
  remark: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['positive', 'neutral', 'concern'],
    default: 'neutral'
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const TeacherRemark = mongoose.model('TeacherRemark', teacherRemarkSchema);

export default TeacherRemark;

