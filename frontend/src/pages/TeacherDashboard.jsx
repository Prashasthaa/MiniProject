import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { teacherAPI } from '../services/api';

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState('students');
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentActivities, setStudentActivities] = useState([]);
  const [studentRecords, setStudentRecords] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Score form state
  const [scoreForm, setScoreForm] = useState({
    studentId: '',
    subject: '',
    score: '',
    maxScore: '100',
    examType: 'quiz',
    remarks: ''
  });

  // Remark form state
  const [remarkForm, setRemarkForm] = useState({
    studentId: '',
    subject: '',
    remark: '',
    type: 'neutral'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [studentsRes, alertsRes] = await Promise.all([
        teacherAPI.getStudents(),
        teacherAPI.getAlerts()
      ]);
      
      setStudents(studentsRes.data);
      setAlerts(alertsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const loadStudentDetails = async (studentId) => {
    try {
      const [activitiesRes, recordsRes] = await Promise.all([
        teacherAPI.getStudentActivities(studentId),
        teacherAPI.getStudentRecords(studentId)
      ]);
      
      setStudentActivities(activitiesRes.data);
      setStudentRecords(recordsRes.data);
      setSelectedStudent(students.find(s => s._id === studentId));
      
      // Pre-fill forms with student ID
      setScoreForm({ ...scoreForm, studentId });
      setRemarkForm({ ...remarkForm, studentId });
    } catch (error) {
      console.error('Error loading student details:', error);
    }
  };

  const handleScoreSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await teacherAPI.addScore({
        ...scoreForm,
        score: parseFloat(scoreForm.score),
        maxScore: parseFloat(scoreForm.maxScore)
      });
      
      // Reset form
      setScoreForm({
        studentId: selectedStudent?._id || '',
        subject: '',
        score: '',
        maxScore: '100',
        examType: 'quiz',
        remarks: ''
      });
      
      // Reload data
      if (selectedStudent) {
        loadStudentDetails(selectedStudent._id);
      }
      loadData(); // Reload to get new alerts
      
      alert('Score added successfully!');
    } catch (error) {
      alert('Error adding score: ' + error.response?.data?.message);
    }
    setLoading(false);
  };

  const handleRemarkSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await teacherAPI.addRemark(remarkForm);
      
      // Reset form
      setRemarkForm({
        studentId: selectedStudent?._id || '',
        subject: '',
        remark: '',
        type: 'neutral'
      });
      
      alert('Remark added successfully!');
    } catch (error) {
      alert('Error adding remark: ' + error.response?.data?.message);
    }
    setLoading(false);
  };

  const handleResolveAlert = async (alertId) => {
    try {
      await teacherAPI.resolveAlert(alertId);
      setAlerts(alerts.filter(a => a._id !== alertId));
      alert('Alert resolved!');
    } catch (error) {
      alert('Error resolving alert: ' + error.response?.data?.message);
    }
  };

  return (
    <Layout title="Teacher Dashboard">
      <div className="space-y-6">
        {/* Alerts Section */}
        {alerts.length > 0 && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <h3 className="text-red-800 font-semibold mb-2">Academic Performance Alerts</h3>
            <div className="space-y-2">
              {alerts.slice(0, 3).map((alert) => (
                <div key={alert._id} className="flex justify-between items-start bg-white p-3 rounded">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {alert.studentId?.fullName} - {alert.subject}
                    </p>
                    <p className="text-sm text-gray-600">{alert.alertMessage}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(alert.date).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleResolveAlert(alert._id)}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Resolve
                  </button>
                </div>
              ))}
            </div>
            {alerts.length > 3 && (
              <button
                onClick={() => setActiveTab('alerts')}
                className="text-sm text-red-700 hover:text-red-900 mt-2"
              >
                View all {alerts.length} alerts
              </button>
            )}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {['students', 'addScore', 'addRemark', 'alerts'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-sm font-medium capitalize ${
                    activeTab === tab
                      ? 'border-b-2 border-primary-600 text-primary-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab === 'addScore' ? 'Add Score' : tab === 'addRemark' ? 'Add Remark' : tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Students Tab */}
            {activeTab === 'students' && (
              <div className="space-y-6">
                <div className="card">
                  <h3 className="text-xl font-semibold mb-4">My Students</h3>
                  {students.length === 0 ? (
                    <p className="text-gray-500">No students assigned yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {students.map((student) => (
                        <div
                          key={student._id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => loadStudentDetails(student._id)}
                        >
                          <h4 className="font-semibold text-gray-900">{student.fullName}</h4>
                          <p className="text-sm text-gray-600">@{student.username}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {selectedStudent && (
                  <>
                    <div className="card">
                      <h3 className="text-xl font-semibold mb-4">
                        {selectedStudent.fullName}'s Academic Records
                      </h3>
                      {studentRecords.length === 0 ? (
                        <p className="text-gray-500">No academic records yet.</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {studentRecords.map((record) => (
                                <tr key={record._id}>
                                  <td className="px-4 py-3 text-sm text-gray-900">
                                    {new Date(record.date).toLocaleDateString()}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900">{record.subject}</td>
                                  <td className="px-4 py-3 text-sm text-gray-600 capitalize">{record.examType}</td>
                                  <td className="px-4 py-3 text-sm">
                                    <span className={`font-semibold ${record.score >= 70 ? 'text-green-600' : record.score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                                      {record.score}/{record.maxScore}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-600">{record.remarks || '-'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    <div className="card">
                      <h3 className="text-xl font-semibold mb-4">
                        {selectedStudent.fullName}'s Recent Activities
                      </h3>
                      {studentActivities.length === 0 ? (
                        <p className="text-gray-500">No activities logged yet.</p>
                      ) : (
                        <div className="space-y-3">
                          {studentActivities.slice(0, 5).map((activity) => (
                            <div key={activity._id} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-semibold text-gray-900">{activity.subject}</h4>
                                  <p className="text-sm text-gray-600 capitalize">{activity.activityType}</p>
                                  <p className="text-sm text-gray-700 mt-1">{activity.description}</p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {new Date(activity.date).toLocaleString()}
                                  </p>
                                </div>
                                <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                                  {activity.duration} min
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Add Score Tab */}
            {activeTab === 'addScore' && (
              <div className="card max-w-2xl mx-auto">
                <h3 className="text-xl font-semibold mb-4">Add Academic Score</h3>
                <form onSubmit={handleScoreSubmit} className="space-y-4">
                  <div>
                    <label className="label">Student</label>
                    <select
                      className="input"
                      value={scoreForm.studentId}
                      onChange={(e) => setScoreForm({...scoreForm, studentId: e.target.value})}
                      required
                    >
                      <option value="">Select a student</option>
                      {students.map((student) => (
                        <option key={student._id} value={student._id}>
                          {student.fullName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Subject</label>
                      <input
                        type="text"
                        className="input"
                        value={scoreForm.subject}
                        onChange={(e) => setScoreForm({...scoreForm, subject: e.target.value})}
                        required
                        placeholder="e.g., Mathematics"
                      />
                    </div>

                    <div>
                      <label className="label">Exam Type</label>
                      <select
                        className="input"
                        value={scoreForm.examType}
                        onChange={(e) => setScoreForm({...scoreForm, examType: e.target.value})}
                      >
                        <option value="quiz">Quiz</option>
                        <option value="midterm">Midterm</option>
                        <option value="final">Final</option>
                        <option value="assignment">Assignment</option>
                        <option value="project">Project</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Score</label>
                      <input
                        type="number"
                        className="input"
                        value={scoreForm.score}
                        onChange={(e) => setScoreForm({...scoreForm, score: e.target.value})}
                        required
                        min="0"
                        max={scoreForm.maxScore}
                        placeholder="85"
                      />
                    </div>

                    <div>
                      <label className="label">Max Score</label>
                      <input
                        type="number"
                        className="input"
                        value={scoreForm.maxScore}
                        onChange={(e) => setScoreForm({...scoreForm, maxScore: e.target.value})}
                        required
                        min="1"
                        placeholder="100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label">Remarks (Optional)</label>
                    <textarea
                      className="input"
                      rows="3"
                      value={scoreForm.remarks}
                      onChange={(e) => setScoreForm({...scoreForm, remarks: e.target.value})}
                      placeholder="Additional comments about performance..."
                    />
                  </div>

                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Score'}
                  </button>
                </form>
              </div>
            )}

            {/* Add Remark Tab */}
            {activeTab === 'addRemark' && (
              <div className="card max-w-2xl mx-auto">
                <h3 className="text-xl font-semibold mb-4">Add Teacher Remark</h3>
                <form onSubmit={handleRemarkSubmit} className="space-y-4">
                  <div>
                    <label className="label">Student</label>
                    <select
                      className="input"
                      value={remarkForm.studentId}
                      onChange={(e) => setRemarkForm({...remarkForm, studentId: e.target.value})}
                      required
                    >
                      <option value="">Select a student</option>
                      {students.map((student) => (
                        <option key={student._id} value={student._id}>
                          {student.fullName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Subject</label>
                      <input
                        type="text"
                        className="input"
                        value={remarkForm.subject}
                        onChange={(e) => setRemarkForm({...remarkForm, subject: e.target.value})}
                        required
                        placeholder="e.g., Physics"
                      />
                    </div>

                    <div>
                      <label className="label">Type</label>
                      <select
                        className="input"
                        value={remarkForm.type}
                        onChange={(e) => setRemarkForm({...remarkForm, type: e.target.value})}
                      >
                        <option value="positive">Positive</option>
                        <option value="neutral">Neutral</option>
                        <option value="concern">Concern</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="label">Remark</label>
                    <textarea
                      className="input"
                      rows="4"
                      value={remarkForm.remark}
                      onChange={(e) => setRemarkForm({...remarkForm, remark: e.target.value})}
                      required
                      placeholder="Enter your remark about the student..."
                    />
                  </div>

                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Remark'}
                  </button>
                </form>
              </div>
            )}

            {/* Alerts Tab */}
            {activeTab === 'alerts' && (
              <div className="card">
                <h3 className="text-xl font-semibold mb-4">Academic Performance Alerts</h3>
                {alerts.length === 0 ? (
                  <p className="text-gray-500">No active alerts.</p>
                ) : (
                  <div className="space-y-3">
                    {alerts.map((alert) => (
                      <div key={alert._id} className="border-l-4 border-red-500 bg-red-50 p-4 rounded">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {alert.studentId?.fullName} - {alert.subject}
                            </h4>
                            <p className="text-sm text-gray-700 mt-1">{alert.alertMessage}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              Drop: {alert.dropPercentage}% | Date: {new Date(alert.date).toLocaleDateString()}
                            </p>
                          </div>
                          <button
                            onClick={() => handleResolveAlert(alert._id)}
                            className="btn-secondary text-sm"
                          >
                            Resolve
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TeacherDashboard;

