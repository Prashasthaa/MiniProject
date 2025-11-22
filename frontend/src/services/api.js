import axios from "axios";

// const api = axios.create({
//   baseURL: '/api',
// });

const api = axios.create({
  baseURL: "http://localhost:5000/api", // <--- FIX BASE URL
  headers: {
    "Content-Type": "application/json",
  },
});

// ------------ ADD THIS INTERCEPTOR -------------
api.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem("userInfo");

  if (userInfo) {
    const token = JSON.parse(userInfo).token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

// ------------------------------------------------

// Student API calls
export const studentAPI = {
  createActivity: (activityData) =>
    api.post("/students/activity", activityData),
  getTodayActivities: () => api.get("/students/activity/today"),
  getAllActivities: () => api.get("/students/activity"),
  startSession: (sessionData) =>
    api.post("/students/session/start", sessionData),
  endSession: (sessionData) => api.post("/students/session/end", sessionData),
  getActiveSession: () => api.get("/students/session/active"),
  getSessions: () => api.get("/students/sessions"),
  getExercises: () => api.get("/students/exercises"),
};

// Teacher API calls
export const teacherAPI = {
  getStudents: () => api.get("/teachers/students"),
  getStudentActivities: (studentId) =>
    api.get(`/teachers/students/${studentId}/activities`),
  getStudentSessions: (studentId) =>
    api.get(`/teachers/students/${studentId}/sessions`),
  getStudentRecords: (studentId) =>
    api.get(`/teachers/students/${studentId}/records`),
  addScore: (scoreData) => api.post("/teachers/score", scoreData),
  addRemark: (remarkData) => api.post("/teachers/remark", remarkData),
  getAlerts: () => api.get("/teachers/alerts"),
  resolveAlert: (alertId) => api.put(`/teachers/alerts/${alertId}/resolve`),
};

// Parent API calls
export const parentAPI = {
  getChildStatus: () => api.get("/parents/status"),
  getRemarks: () => api.get("/parents/remarks"),
  getAlerts: () => api.get("/parents/alerts"),
  getPerformance: () => api.get("/parents/performance"),
};

export default api;
