import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { parentAPI } from '../services/api';

const ParentDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [childStatus, setChildStatus] = useState(null);
  const [remarks, setRemarks] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statusRes, remarksRes, alertsRes, performanceRes] = await Promise.all([
        parentAPI.getChildStatus(),
        parentAPI.getRemarks(),
        parentAPI.getAlerts(),
        parentAPI.getPerformance()
      ]);
      
      setChildStatus(statusRes.data);
      setRemarks(remarksRes.data);
      setAlerts(alertsRes.data);
      setPerformance(performanceRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <Layout title="Parent Dashboard">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Parent Dashboard">
      <div className="space-y-6">
        {/* Child Info Card */}
        {childStatus && (
          <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-lg shadow-lg p-6 text-white">
            <h3 className="text-2xl font-bold mb-2">{childStatus.child.fullName}</h3>
            <p className="text-primary-100">@{childStatus.child.username}</p>
          </div>
        )}

        {/* Alert Banner */}
        {alerts.length > 0 && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <h3 className="text-red-800 font-semibold mb-2">
              ⚠️ {alerts.length} Academic Alert{alerts.length > 1 ? 's' : ''}
            </h3>
            <p className="text-red-700 text-sm">
              Your child has academic performance concerns that need attention.
            </p>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {['overview', 'performance', 'remarks', 'alerts'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-sm font-medium capitalize ${
                    activeTab === tab
                      ? 'border-b-2 border-primary-600 text-primary-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && childStatus && (
              <div className="space-y-6">
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-blue-600 font-medium">Total Study Time</p>
                        <p className="text-3xl font-bold text-blue-900 mt-1">
                          {childStatus.statistics.totalStudyTime} min
                        </p>
                        <p className="text-xs text-blue-600 mt-1">This week</p>
                      </div>
                      <div className="text-4xl">📚</div>
                    </div>
                  </div>

                  <div className="card bg-gradient-to-br from-green-50 to-green-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-600 font-medium">Average Score</p>
                        <p className="text-3xl font-bold text-green-900 mt-1">
                          {childStatus.statistics.averageScore}%
                        </p>
                        <p className="text-xs text-green-600 mt-1">Recent exams</p>
                      </div>
                      <div className="text-4xl">📊</div>
                    </div>
                  </div>

                  <div className="card bg-gradient-to-br from-purple-50 to-purple-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-purple-600 font-medium">Activities</p>
                        <p className="text-3xl font-bold text-purple-900 mt-1">
                          {childStatus.statistics.activitiesThisWeek}
                        </p>
                        <p className="text-xs text-purple-600 mt-1">This week</p>
                      </div>
                      <div className="text-4xl">✏️</div>
                    </div>
                  </div>
                </div>

                {/* Recent Academic Records */}
                <div className="card">
                  <h3 className="text-xl font-semibold mb-4">Recent Academic Records</h3>
                  {childStatus.recentRecords.length === 0 ? (
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
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teacher</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {childStatus.recentRecords.map((record) => (
                            <tr key={record._id}>
                              <td className="px-4 py-3 text-sm text-gray-900">
                                {new Date(record.date).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">{record.subject}</td>
                              <td className="px-4 py-3 text-sm text-gray-600 capitalize">{record.examType}</td>
                              <td className="px-4 py-3 text-sm">
                                <span className={`font-semibold ${
                                  record.score >= 70 ? 'text-green-600' : 
                                  record.score >= 50 ? 'text-yellow-600' : 
                                  'text-red-600'
                                }`}>
                                  {record.score}/{record.maxScore}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                {record.teacherId?.fullName || 'N/A'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Recent Activities */}
                <div className="card">
                  <h3 className="text-xl font-semibold mb-4">Recent Activities (This Week)</h3>
                  {childStatus.recentActivities.length === 0 ? (
                    <p className="text-gray-500">No activities logged this week.</p>
                  ) : (
                    <div className="space-y-3">
                      {childStatus.recentActivities.slice(0, 5).map((activity) => (
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
              </div>
            )}

            {/* Performance Tab */}
            {activeTab === 'performance' && performance && (
              <div className="space-y-6">
                <div className="card">
                  <h3 className="text-xl font-semibold mb-4">Performance by Subject</h3>
                  {Object.keys(performance.performanceBySubject).length === 0 ? (
                    <p className="text-gray-500">No performance data available yet.</p>
                  ) : (
                    <div className="space-y-6">
                      {Object.entries(performance.performanceBySubject).map(([subject, scores]) => (
                        <div key={subject} className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-3">{subject}</h4>
                          <div className="space-y-2">
                            {scores.map((score, index) => (
                              <div key={index} className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm text-gray-700">
                                    {new Date(score.date).toLocaleDateString()} - {score.examType}
                                  </p>
                                  <p className="text-xs text-gray-500">{score.teacher}</p>
                                </div>
                                <span className={`font-semibold text-lg ${
                                  score.score >= 70 ? 'text-green-600' : 
                                  score.score >= 50 ? 'text-yellow-600' : 
                                  'text-red-600'
                                }`}>
                                  {score.score}
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-sm font-medium text-gray-700">
                              Average: <span className="text-primary-600">
                                {(scores.reduce((acc, s) => acc + s.score, 0) / scores.length).toFixed(1)}
                              </span>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Remarks Tab */}
            {activeTab === 'remarks' && (
              <div className="card">
                <h3 className="text-xl font-semibold mb-4">Teacher Remarks</h3>
                {remarks.length === 0 ? (
                  <p className="text-gray-500">No teacher remarks yet.</p>
                ) : (
                  <div className="space-y-3">
                    {remarks.map((remark) => (
                      <div 
                        key={remark._id} 
                        className={`border-l-4 p-4 rounded ${
                          remark.type === 'positive' ? 'border-green-500 bg-green-50' :
                          remark.type === 'concern' ? 'border-red-500 bg-red-50' :
                          'border-blue-500 bg-blue-50'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-semibold text-gray-900">{remark.subject}</h4>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                remark.type === 'positive' ? 'bg-green-200 text-green-800' :
                                remark.type === 'concern' ? 'bg-red-200 text-red-800' :
                                'bg-blue-200 text-blue-800'
                              }`}>
                                {remark.type}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 mt-2">{remark.remark}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              By {remark.teacherId?.fullName} on {new Date(remark.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Alerts Tab */}
            {activeTab === 'alerts' && (
              <div className="card">
                <h3 className="text-xl font-semibold mb-4">Academic Performance Alerts</h3>
                {alerts.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">✅</div>
                    <p className="text-gray-500">No alerts - Your child is doing great!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {alerts.map((alert) => (
                      <div key={alert._id} className="border-l-4 border-red-500 bg-red-50 p-4 rounded">
                        <div className="flex items-start">
                          <div className="text-2xl mr-3">⚠️</div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{alert.subject}</h4>
                            <p className="text-sm text-gray-700 mt-1">{alert.alertMessage}</p>
                            <div className="mt-2 text-xs text-gray-600">
                              <p>Previous Score: {alert.previousScore} → Current Score: {alert.currentScore}</p>
                              <p>Drop Percentage: {alert.dropPercentage}%</p>
                              <p>Date: {new Date(alert.date).toLocaleDateString()}</p>
                              <p>Teacher: {alert.teacherId?.fullName}</p>
                            </div>
                            {alert.isResolved && (
                              <span className="inline-block mt-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                Resolved
                              </span>
                            )}
                          </div>
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

export default ParentDashboard;

