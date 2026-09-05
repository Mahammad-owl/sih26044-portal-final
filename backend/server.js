// Ensure backend node_modules is always in module resolution path
const path = require('path');
process.env.NODE_PATH = (process.env.NODE_PATH ? process.env.NODE_PATH + ':' : '') + path.join(__dirname, 'node_modules');
require('module').Module._initPaths();

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads directory for media evidence
const uploadsDir = path.join(__dirname, 'uploads');
const fs = require('fs');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Routes
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const assessmentRoutes = require('./routes/assessments');
const verificationRoutes = require('./routes/verifications');
const projectRoutes = require('./routes/projects');
const opportunityRoutes = require('./routes/opportunities');
const industryRoutes = require('./routes/industry');
const facultyRoutes = require('./routes/faculty');
const adminRoutes = require('./routes/admin');
const collaborationRoutes = require('./routes/collaborations');
const notificationRoutes = require('./routes/notifications');

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/verifications', verificationRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/industry', industryRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/collaborations', collaborationRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'SIH26044 Academia-Industry Collaboration Platform',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Fallback error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'An unexpected internal server error occurred'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 SIH26044 Backend running on http://localhost:${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
});
