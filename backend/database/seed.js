// Ensure backend node_modules is always in module resolution path
const path = require('path');
process.env.NODE_PATH = (process.env.NODE_PATH ? process.env.NODE_PATH + ':' : '') + path.join(__dirname, '../node_modules');
require('module').Module._initPaths();

const db = require('./db');
const bcrypt = require('bcryptjs');

console.log('🌱 Starting comprehensive database seed for SIH26044...');

const saltRounds = 10;
const defaultPasswordHash = bcrypt.hashSync('demo123', saltRounds);

// Wrap in transaction for speed and safety
const seedTransaction = db.transaction(() => {
  // Clear existing tables in order
  const tables = [
    'notifications', 'certifications', 'collaborations', 'learning_activities', 'learning_paths',
    'applications', 'opportunity_skills', 'opportunities', 'career_skill_requirements', 'career_roles',
    'verifications', 'projects', 'assessment_attempts', 'questions', 'assessments',
    'student_skills', 'skills', 'faculty_profiles', 'industry_profiles', 'student_profiles',
    'institutions', 'users'
  ];

  for (const table of tables) {
    db.prepare(`DELETE FROM ${table}`).run();
  }

  // 1. INSTITUTIONS
  db.prepare(`
    INSERT INTO institutions (id, name, code, state, city, type)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run('inst-01', 'Apex Institute of Technology', 'AIT-DELHI', 'Delhi NCR', 'New Delhi', 'Institute of National Importance');

  // 2. USERS
  const insertUser = db.prepare(`
    INSERT INTO users (id, email, password_hash, role, name, avatar)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  // Demo Accounts (Standard & SIH Domain Formats)
  insertUser.run('usr-stu-01', 'student@demo.com', defaultPasswordHash, 'STUDENT', 'Ananya Sharma', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');
  insertUser.run('usr-stu-01-sih', 'student.demo@demo.sih', defaultPasswordHash, 'STUDENT', 'Ananya Sharma', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');
  insertUser.run('usr-ind-01', 'industry@demo.com', defaultPasswordHash, 'INDUSTRY', 'Nexa Embedded & Semiconductor Labs', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&auto=format&fit=crop&q=80');
  insertUser.run('usr-ind-01-sih', 'industry.demo@demo.sih', defaultPasswordHash, 'INDUSTRY', 'Nexa Embedded & Semiconductor Labs', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&auto=format&fit=crop&q=80');
  insertUser.run('usr-fac-01', 'faculty@demo.com', defaultPasswordHash, 'FACULTY', 'Dr. Ramesh Kumar', 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80');
  insertUser.run('usr-fac-01-sih', 'academia.demo@demo.sih', defaultPasswordHash, 'FACULTY', 'Dr. Ramesh Kumar', 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80');
  insertUser.run('usr-adm-01', 'admin@demo.com', defaultPasswordHash, 'INSTITUTION_ADMIN', 'Dr. S. K. Mehra', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80');
  insertUser.run('usr-adm-01-sih', 'admin.demo@demo.sih', defaultPasswordHash, 'INSTITUTION_ADMIN', 'Dr. S. K. Mehra', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80');

  // Additional Students across Branches
  insertUser.run('usr-stu-02', 'rahul.cse@demo.com', defaultPasswordHash, 'STUDENT', 'Rahul Verma', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80');
  insertUser.run('usr-stu-03', 'priya.vlsi@demo.com', defaultPasswordHash, 'STUDENT', 'Priya Patel', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80');
  insertUser.run('usr-stu-04', 'vikram.eee@demo.com', defaultPasswordHash, 'STUDENT', 'Vikram Joshi', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80');
  insertUser.run('usr-stu-05', 'siddharth.mech@demo.com', defaultPasswordHash, 'STUDENT', 'Siddharth Rao', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80');
  insertUser.run('usr-stu-06', 'sneha.civil@demo.com', defaultPasswordHash, 'STUDENT', 'Sneha Gupta', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80');
  insertUser.run('usr-stu-07', 'aditya.cloud@demo.com', defaultPasswordHash, 'STUDENT', 'Aditya Nair', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80');
  insertUser.run('usr-stu-08', 'meera.sec@demo.com', defaultPasswordHash, 'STUDENT', 'Meera Iyer', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80');

  // Additional Industry Partners
  insertUser.run('usr-ind-02', 'quantvlsi@demo.com', defaultPasswordHash, 'INDUSTRY', 'QuantVLSI Silicon Technologies', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&auto=format&fit=crop&q=80');
  insertUser.run('usr-ind-03', 'apexai@demo.com', defaultPasswordHash, 'INDUSTRY', 'Apex AI & Robotics Labs', 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=150&auto=format&fit=crop&q=80');
  insertUser.run('usr-ind-04', 'gridtech@demo.com', defaultPasswordHash, 'INDUSTRY', 'GridTech Dynamics Power Solutions', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=150&auto=format&fit=crop&q=80');
  insertUser.run('usr-ind-05', 'infrabuild@demo.com', defaultPasswordHash, 'INDUSTRY', 'InfraBuild Structural Engineering Ltd', 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=150&auto=format&fit=crop&q=80');

  // 3. STUDENT PROFILES
  const insertStudent = db.prepare(`
    INSERT INTO student_profiles (
      id, user_id, name, email, phone, branch, year, institution_id, institution_name,
      career_goal, location, about, cgpa, roll_no, readiness_score, verified_skills_count,
      pending_skills_count, portfolio_slug
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertStudent.run(
    'stu-01', 'usr-stu-01', 'Ananya Sharma', 'student@demo.com', '+91 98765 43210',
    'ECE', '2nd Year', 'inst-01', 'Apex Institute of Technology',
    'Embedded Systems Engineer', 'New Delhi, India',
    'Passionate ECE sophomore focused on Embedded C, Microcontrollers, and RTOS firmware design. Keen on building resilient IoT edge systems and hardware-software co-design.',
    8.85, 'AIT-2024-ECE-042', 74, 4, 2, 'ananya-sharma'
  );

  insertStudent.run(
    'stu-02', 'usr-stu-02', 'Rahul Verma', 'rahul.cse@demo.com', '+91 98111 22334',
    'CSE', '3rd Year', 'inst-01', 'Apex Institute of Technology',
    'AI/ML Engineer', 'Bangalore, India',
    'Computer Science student with strong foundations in Python, PyTorch, and Deep Learning algorithms.',
    9.1, 'AIT-2023-CSE-019', 88, 6, 1, 'rahul-verma'
  );

  insertStudent.run(
    'stu-03', 'usr-stu-03', 'Priya Patel', 'priya.vlsi@demo.com', '+91 98222 33445',
    'ECE', '3rd Year', 'inst-01', 'Apex Institute of Technology',
    'VLSI Design Engineer', 'Ahmedabad, India',
    'Hardware description enthusiast working with Verilog, RTL Synthesis, and Digital IC Verification.',
    8.6, 'AIT-2023-ECE-088', 82, 5, 2, 'priya-patel'
  );

  insertStudent.run(
    'stu-04', 'usr-stu-04', 'Vikram Joshi', 'vikram.eee@demo.com', '+91 98333 44556',
    'EEE', '4th Year', 'inst-01', 'Apex Institute of Technology',
    'Power Systems & Smart Grid Engineer', 'Pune, India',
    'Electrical engineering senior specializing in smart grids, renewable microgrid dispatch, and MATLAB/Simulink.',
    8.3, 'AIT-2022-EEE-012', 79, 5, 1, 'vikram-joshi'
  );

  insertStudent.run(
    'stu-05', 'usr-stu-05', 'Siddharth Rao', 'siddharth.mech@demo.com', '+91 98444 55667',
    'Mechanical', '3rd Year', 'inst-01', 'Apex Institute of Technology',
    'Robotics & Automation Engineer', 'Chennai, India',
    'Robotics enthusiast building kinematic simulations with ROS, SolidWorks CAD modeling, and industrial automation.',
    8.4, 'AIT-2023-MECH-031', 80, 5, 1, 'siddharth-rao'
  );

  insertStudent.run(
    'stu-06', 'usr-stu-06', 'Sneha Gupta', 'sneha.civil@demo.com', '+91 98555 66778',
    'Civil', '4th Year', 'inst-01', 'Apex Institute of Technology',
    'Structural & BIM Engineer', 'Kolkata, India',
    'Civil engineer with expertise in STAAD.Pro, AutoCAD Civil 3D, and Revit BIM modeling for reinforced concrete structures.',
    8.7, 'AIT-2022-CIVIL-007', 85, 6, 0, 'sneha-gupta'
  );

  insertStudent.run(
    'stu-07', 'usr-stu-07', 'Aditya Nair', 'aditya.cloud@demo.com', '+91 98666 77889',
    'CSE', '2nd Year', 'inst-01', 'Apex Institute of Technology',
    'Cloud & DevOps Engineer', 'Hyderabad, India',
    'Cloud architecture practitioner working with Docker, Kubernetes, CI/CD pipelines, and AWS infrastructure as code.',
    8.2, 'AIT-2024-CSE-105', 71, 3, 3, 'aditya-nair'
  );

  insertStudent.run(
    'stu-08', 'usr-stu-08', 'Meera Iyer', 'meera.sec@demo.com', '+91 98777 88990',
    'CSE', '3rd Year', 'inst-01', 'Apex Institute of Technology',
    'Cybersecurity Analyst', 'Mumbai, India',
    'Penetration testing, network security monitoring, Wireshark, and defensive architecture enthusiast.',
    8.9, 'AIT-2023-CSE-064', 86, 5, 1, 'meera-iyer'
  );

  // 4. INDUSTRY PROFILES
  const insertIndustry = db.prepare(`
    INSERT INTO industry_profiles (
      id, user_id, company_name, industry_sector, website, location, description, logo, verified_partner
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertIndustry.run(
    'ind-01', 'usr-ind-01', 'Nexa Embedded Solutions', 'Semiconductor & Embedded IoT',
    'https://nexa-embedded.demo', 'Bangalore / Noida, India',
    'Leading tier-1 engineering partner in automotive microcontrollers, aerospace RTOS firmware, and industrial edge computing systems.',
    '⚡', 1
  );

  insertIndustry.run(
    'ind-02', 'usr-ind-02', 'QuantVLSI Silicon Technologies', 'VLSI & ASIC Semiconductor',
    'https://quantvlsi.demo', 'Noida & Hyderabad, India',
    'Fabless semiconductor design house specializing in high-performance digital signal processing chips and FPGA validation.',
    '🔬', 1
  );

  insertIndustry.run(
    'ind-03', 'usr-ind-03', 'Apex AI & Robotics Labs', 'Artificial Intelligence & Robotics',
    'https://apexai.demo', 'Bangalore & Pune, India',
    'Pioneering autonomous mobile robotics, computer vision perception stacks, and industrial automation.',
    '🤖', 1
  );

  insertIndustry.run(
    'ind-04', 'usr-ind-04', 'GridTech Dynamics Power Solutions', 'Smart Energy & Power Systems',
    'https://gridtech.demo', 'Hyderabad, India',
    'Next-gen clean energy grid monitoring, SCADA systems, and high-voltage transmission optimization.',
    '🔋', 1
  );

  insertIndustry.run(
    'ind-05', 'usr-ind-05', 'InfraBuild Structural Engineering Ltd', 'Civil & Infrastructure Engineering',
    'https://infrabuild.demo', 'Mumbai, India',
    'Consulting engineering firm delivering structural analysis, smart transportation bridges, and BIM integration.',
    '🏗️', 1
  );

  // 5. FACULTY PROFILES
  const insertFaculty = db.prepare(`
    INSERT INTO faculty_profiles (
      id, user_id, name, department, designation, institution_id, institution_name, email, phone
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertFaculty.run(
    'fac-01', 'usr-fac-01', 'Dr. Ramesh Kumar', 'Electronics & Communication Engineering',
    'Professor & Department Head', 'inst-01', 'Apex Institute of Technology',
    'faculty@demo.com', '+91 94441 12233'
  );

  // 6. SKILLS (Comprehensive Multi-Disciplinary)
  const insertSkill = db.prepare(`
    INSERT INTO skills (id, name, category, discipline, description, icon)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  // ECE Skills
  insertSkill.run('skl-emb-c', 'Embedded C', 'Core Technical', 'ECE', 'Low-level C programming for ARM Cortex, AVR, memory mapping, ISRs, and register manipulation.', 'Cpu');
  insertSkill.run('skl-micro', 'Microcontrollers (ARM/STM32/AVR)', 'Core Technical', 'ECE', 'Peripheral interfacing (UART, SPI, I2C, CAN, DMA, Timers) on STM32 and ATmega.', 'Radio');
  insertSkill.run('skl-dig-elec', 'Digital Electronics', 'Core Technical', 'ECE', 'Combinational/sequential logic, finite state machines, K-maps, timing analysis.', 'Binary');
  insertSkill.run('skl-rtos', 'RTOS (FreeRTOS)', 'Systems', 'ECE', 'Real-time task scheduling, semaphores, mutexes, message queues, priority inversion handling.', 'Layers');
  insertSkill.run('skl-emb-linux', 'Embedded Linux & Device Drivers', 'Systems', 'ECE', 'Kernel configuration, Yocto builds, character device drivers, U-Boot, Device Trees.', 'Terminal');
  insertSkill.run('skl-verilog', 'Verilog HDL', 'Hardware Design', 'ECE', 'Hardware description language, RTL modeling, behavioral synthesis, testbenches.', 'CircuitBoard');
  insertSkill.run('skl-vlsi', 'VLSI Design & Physical Verification', 'Hardware Design', 'ECE', 'CMOS layout, static timing analysis (STA), DRC/LVS verification, ASIC flow.', 'Microchip');
  insertSkill.run('skl-iot', 'IoT Protocols (MQTT/CoAP/BLE)', 'Networking & Embedded', 'ECE', 'Lightweight IoT communication, sensor nodes, edge gateways, wireless mesh.', 'Wifi');
  insertSkill.run('skl-pcb', 'PCB Design & Altium Designer', 'Hardware Design', 'ECE', 'Schematic capture, multi-layer routing, signal integrity, Gerber generation.', 'Share2');

  // CSE Skills
  insertSkill.run('skl-python', 'Python Programming', 'Core Technical', 'CSE', 'Python data structures, OOP, scientific packages (NumPy, Pandas), script automation.', 'Code');
  insertSkill.run('skl-ml', 'Machine Learning & Deep Learning', 'Domain', 'CSE', 'Supervised/unsupervised models, PyTorch, TensorFlow, neural network architectures.', 'Brain');
  insertSkill.run('skl-react', 'React.js & Frontend Engineering', 'Frameworks', 'CSE', 'Component lifecycles, hooks, state management, modern web applications.', 'Layout');
  insertSkill.run('skl-sql', 'SQL & Database Architecture', 'Core Technical', 'CSE', 'Relational design, indexing, query optimization, ACID transactions.', 'Database');
  insertSkill.run('skl-cloud', 'Cloud Computing & AWS', 'Systems', 'CSE', 'EC2, S3, Lambda, VPC, cloud security, microservices deployment.', 'Cloud');
  insertSkill.run('skl-cyber', 'Cybersecurity & Threat Analysis', 'Domain', 'CSE', 'Vulnerability assessment, network sniffing, cryptography, threat modeling.', 'Shield');

  // EEE Skills
  insertSkill.run('skl-power', 'Power Systems Analysis', 'Core Technical', 'EEE', 'Load flow studies, symmetrical fault calculations, transmission line modeling.', 'Zap');
  insertSkill.run('skl-control', 'Control Systems Engineering', 'Core Technical', 'EEE', 'Transfer functions, root locus, Bode plots, PID controller tuning, state-space.', 'Sliders');
  insertSkill.run('skl-machines', 'Electrical Machines & Drives', 'Core Technical', 'EEE', 'Induction motors, BLDC drives, inverter PWM control, regenerative braking.', 'Activity');
  insertSkill.run('skl-smartgrid', 'Smart Grid & SCADA Integration', 'Domain', 'EEE', 'Microgrids, renewable integration, AMI, IEC 61850 substation automation.', 'Network');

  // Mechanical Skills
  insertSkill.run('skl-cad', 'SolidWorks & CAD Modeling', 'Design & Tools', 'Mechanical', '3D parametric modeling, surface modeling, assembly design, GD&T.', 'Box');
  insertSkill.run('skl-robotics', 'Robotics & ROS Framework', 'Systems', 'Mechanical', 'Robot Operating System (ROS2), kinematics, path planning (MoveIt), Gazebo sim.', 'Bot');
  insertSkill.run('skl-fea', 'Finite Element Analysis (ANSYS)', 'Simulation', 'Mechanical', 'Structural stress analysis, modal vibration, thermal CFD simulation.', 'Maximize2');
  insertSkill.run('skl-mfg', 'CNC & Modern Manufacturing', 'Core Technical', 'Mechanical', 'G-code programming, additive manufacturing, DFM principles.', 'Wrench');

  // Civil Skills
  insertSkill.run('skl-struct', 'Structural Analysis (STAAD.Pro)', 'Core Technical', 'Civil', 'Moment distribution, seismic code compliance (IS 1893), RCC design.', 'Building');
  insertSkill.run('skl-autocad-civil', 'AutoCAD Civil 3D', 'Design & Tools', 'Civil', 'Site grading, road corridor design, topographical contour modeling.', 'Map');
  insertSkill.run('skl-bim', 'BIM & Autodesk Revit', 'Systems', 'Civil', 'Building Information Modeling, clash detection, 4D construction sequencing.', 'Grid');

  // 7. STUDENT SKILLS (Connecting Ananya Sharma & other students)
  const insertStudentSkill = db.prepare(`
    INSERT INTO student_skills (
      id, student_id, skill_id, claimed_level, assessment_level, evidence_level,
      verified_level, verification_status, confidence_level, last_assessed_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Ananya Sharma (ECE) - 4 Verified, 2 Gaps
  insertStudentSkill.run('ss-01', 'stu-01', 'skl-emb-c', 4, 4, 4, 4, 'VERIFIED', 'HIGH', '2026-08-15 10:30:00');
  insertStudentSkill.run('ss-02', 'stu-01', 'skl-micro', 4, 4, 3, 4, 'VERIFIED', 'HIGH', '2026-08-18 14:00:00');
  insertStudentSkill.run('ss-03', 'stu-01', 'skl-dig-elec', 4, 4, 4, 4, 'VERIFIED', 'HIGH', '2026-08-20 11:15:00');
  insertStudentSkill.run('ss-04', 'stu-01', 'skl-iot', 3, 3, 3, 3, 'VERIFIED', 'MEDIUM', '2026-08-22 16:45:00');
  insertStudentSkill.run('ss-05', 'stu-01', 'skl-rtos', 2, 1, 1, 0, 'NOT_VERIFIED', 'LOW', '2026-08-28 09:00:00');
  insertStudentSkill.run('ss-06', 'stu-01', 'skl-emb-linux', 1, 1, 0, 0, 'NOT_VERIFIED', 'LOW', null);
  insertStudentSkill.run('ss-07', 'stu-01', 'skl-pcb', 3, 2, 2, 0, 'IN_REVIEW', 'MEDIUM', '2026-08-29 18:00:00');

  // Rahul Verma (CSE)
  insertStudentSkill.run('ss-08', 'stu-02', 'skl-python', 5, 5, 5, 5, 'VERIFIED', 'HIGH', '2026-08-10 10:00:00');
  insertStudentSkill.run('ss-09', 'stu-02', 'skl-ml', 4, 4, 4, 4, 'VERIFIED', 'HIGH', '2026-08-12 11:30:00');
  insertStudentSkill.run('ss-10', 'stu-02', 'skl-sql', 4, 4, 3, 4, 'VERIFIED', 'HIGH', '2026-08-14 15:00:00');
  insertStudentSkill.run('ss-11', 'stu-02', 'skl-cloud', 3, 2, 2, 0, 'IN_REVIEW', 'MEDIUM', '2026-08-25 14:00:00');

  // Priya Patel (ECE - VLSI)
  insertStudentSkill.run('ss-12', 'stu-03', 'skl-verilog', 5, 5, 4, 5, 'VERIFIED', 'HIGH', '2026-08-11 12:00:00');
  insertStudentSkill.run('ss-13', 'stu-03', 'skl-vlsi', 4, 4, 4, 4, 'VERIFIED', 'HIGH', '2026-08-16 16:20:00');
  insertStudentSkill.run('ss-14', 'stu-03', 'skl-dig-elec', 4, 4, 4, 4, 'VERIFIED', 'HIGH', '2026-08-17 11:00:00');

  // Vikram Joshi (EEE)
  insertStudentSkill.run('ss-15', 'stu-04', 'skl-power', 4, 4, 4, 4, 'VERIFIED', 'HIGH', '2026-08-19 14:30:00');
  insertStudentSkill.run('ss-16', 'stu-04', 'skl-control', 4, 3, 4, 4, 'VERIFIED', 'HIGH', '2026-08-21 15:10:00');
  insertStudentSkill.run('ss-17', 'stu-04', 'skl-smartgrid', 3, 2, 2, 0, 'IN_REVIEW', 'MEDIUM', '2026-08-26 10:00:00');

  // Siddharth Rao (Mechanical)
  insertStudentSkill.run('ss-18', 'stu-05', 'skl-cad', 5, 4, 4, 4, 'VERIFIED', 'HIGH', '2026-08-15 09:30:00');
  insertStudentSkill.run('ss-19', 'stu-05', 'skl-robotics', 4, 4, 4, 4, 'VERIFIED', 'HIGH', '2026-08-23 16:00:00');
  insertStudentSkill.run('ss-20', 'stu-05', 'skl-fea', 3, 2, 2, 0, 'IN_REVIEW', 'MEDIUM', '2026-08-27 12:00:00');

  // Sneha Gupta (Civil)
  insertStudentSkill.run('ss-21', 'stu-06', 'skl-struct', 5, 5, 5, 5, 'VERIFIED', 'HIGH', '2026-08-14 10:00:00');
  insertStudentSkill.run('ss-22', 'stu-06', 'skl-autocad-civil', 4, 4, 4, 4, 'VERIFIED', 'HIGH', '2026-08-18 11:00:00');
  insertStudentSkill.run('ss-23', 'stu-06', 'skl-bim', 4, 4, 3, 4, 'VERIFIED', 'HIGH', '2026-08-24 14:00:00');

  // 8. CAREER ROLES & REQUIREMENTS
  const insertCareerRole = db.prepare(`
    INSERT INTO career_roles (id, title, discipline, description, min_experience_months, average_salary_range)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insertCareerRole.run('cr-01', 'Embedded Systems Engineer', 'ECE', 'Designs firmware, peripheral drivers, and hard real-time control algorithms on ARM Cortex & microcontrollers.', 0, '₹6 - 12 LPA');
  insertCareerRole.run('cr-02', 'VLSI Design & Verification Engineer', 'ECE', 'Develops RTL in Verilog/SystemVerilog, executes UVM verification, and optimizes silicon layout.', 0, '₹8 - 18 LPA');
  insertCareerRole.run('cr-03', 'AI/ML Systems Engineer', 'CSE', 'Architects machine learning pipelines, deep neural networks, model quantization, and inference serving.', 0, '₹8 - 16 LPA');
  insertCareerRole.run('cr-04', 'Cloud & DevOps Engineer', 'CSE', 'Designs distributed cloud infrastructure, CI/CD automation, container orchestration, and telemetry.', 0, '₹7 - 14 LPA');
  insertCareerRole.run('cr-05', 'Power Systems & Smart Grid Engineer', 'EEE', 'Plans high-voltage distribution networks, renewable generation microgrids, and protection coordination.', 0, '₹6 - 11 LPA');
  insertCareerRole.run('cr-06', 'Robotics & Mechatronics Engineer', 'Mechanical', 'Develops kinematic robot controls, ROS2 software, sensor fusion, and precision mechanical actuation.', 0, '₹6 - 13 LPA');
  insertCareerRole.run('cr-07', 'Structural & BIM Design Engineer', 'Civil', 'Performs seismic finite-element modeling, RCC detailing, and multi-disciplinary BIM clash resolution.', 0, '₹5 - 10 LPA');
  insertCareerRole.run('cr-08', 'Cybersecurity Defense Specialist', 'CSE', 'Implements zero-trust security architectures, intrusion detection, SOC monitoring, and vulnerability patching.', 0, '₹7 - 15 LPA');

  // Career Skill Requirements (Defines the Skill Gap Engine standards)
  const insertCSR = db.prepare(`
    INSERT INTO career_skill_requirements (id, career_role_id, skill_id, required_level, importance_weight, is_mandatory)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  // Embedded Systems Engineer Requirements
  insertCSR.run('csr-01', 'cr-01', 'skl-emb-c', 4, 5, 1);
  insertCSR.run('csr-02', 'cr-01', 'skl-micro', 4, 5, 1);
  insertCSR.run('csr-03', 'cr-01', 'skl-dig-elec', 3, 4, 1);
  insertCSR.run('csr-04', 'cr-01', 'skl-rtos', 3, 5, 1); // Ananya Gap: Req 3 vs Current 1 -> GAP = 2 (HIGH)
  insertCSR.run('csr-05', 'cr-01', 'skl-emb-linux', 3, 4, 1); // Ananya Gap: Req 3 vs Current 1 -> GAP = 2 (HIGH)
  insertCSR.run('csr-06', 'cr-01', 'skl-iot', 2, 3, 0);

  // VLSI Engineer Requirements
  insertCSR.run('csr-07', 'cr-02', 'skl-verilog', 4, 5, 1);
  insertCSR.run('csr-08', 'cr-02', 'skl-vlsi', 4, 5, 1);
  insertCSR.run('csr-09', 'cr-02', 'skl-dig-elec', 4, 5, 1);

  // AI/ML Requirements
  insertCSR.run('csr-10', 'cr-03', 'skl-python', 4, 5, 1);
  insertCSR.run('csr-11', 'cr-03', 'skl-ml', 4, 5, 1);
  insertCSR.run('csr-12', 'cr-03', 'skl-sql', 3, 3, 0);

  // Power Systems Requirements
  insertCSR.run('csr-13', 'cr-05', 'skl-power', 4, 5, 1);
  insertCSR.run('csr-14', 'cr-05', 'skl-control', 3, 4, 1);
  insertCSR.run('csr-15', 'cr-05', 'skl-smartgrid', 3, 4, 1);

  // Robotics Requirements
  insertCSR.run('csr-16', 'cr-06', 'skl-cad', 4, 4, 1);
  insertCSR.run('csr-17', 'cr-06', 'skl-robotics', 4, 5, 1);
  insertCSR.run('csr-18', 'cr-06', 'skl-control', 3, 4, 1);

  // Civil Structural Requirements
  insertCSR.run('csr-19', 'cr-07', 'skl-struct', 4, 5, 1);
  insertCSR.run('csr-20', 'cr-07', 'skl-autocad-civil', 3, 4, 1);
  insertCSR.run('csr-21', 'cr-07', 'skl-bim', 3, 4, 1);

  // 9. ASSESSMENTS & QUESTIONS
  const insertAssessment = db.prepare(`
    INSERT INTO assessments (
      id, skill_id, skill_name, title, description, time_limit_mins, passing_score,
      total_questions, difficulty_level, created_by
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertAssessment.run('asm-01', 'skl-emb-c', 'Embedded C', 'Embedded C Firmware & Pointer Architecture', 'Tests memory alignment, volatile keywords, bitwise masking, ISR registers, and DMA handling.', 15, 60, 5, 'Intermediate', 'Dr. Ramesh Kumar');
  insertAssessment.run('asm-02', 'skl-rtos', 'RTOS (FreeRTOS)', 'FreeRTOS Task Scheduling & Inter-Task Communication', 'Tests priority preemption, mutex priority inheritance, queues, and task notifications.', 15, 60, 5, 'Advanced', 'Nexa Embedded Labs');
  insertAssessment.run('asm-03', 'skl-micro', 'Microcontrollers (ARM/STM32)', 'STM32 Peripheral Interfacing & Timers', 'Tests GPIO configuration, NVIC interrupt grouping, ADC DMA transfers, and SPI/I2C.', 15, 60, 5, 'Intermediate', 'Dr. Ramesh Kumar');
  insertAssessment.run('asm-04', 'skl-python', 'Python Programming', 'Python Core & Algorithmic Performance', 'Tests list comprehensions, decorators, generators, and complexity analysis.', 15, 60, 5, 'Intermediate', 'Apex AI Labs');
  insertAssessment.run('asm-05', 'skl-verilog', 'Verilog HDL', 'RTL Design & Synchronous FSM Modeling', 'Tests blocking vs non-blocking assignments, clock domain crossing, and synthesizable constructs.', 15, 60, 5, 'Advanced', 'QuantVLSI');
  insertAssessment.run('asm-06', 'skl-power', 'Power Systems Analysis', 'Grid Transmission & Fault Analysis', 'Tests symmetrical components, bus admittance matrix, and transient stability.', 15, 60, 5, 'Intermediate', 'GridTech Dynamics');
  insertAssessment.run('asm-07', 'skl-cad', 'SolidWorks & CAD Modeling', 'Parametric CAD & Assembly Constraints', 'Tests feature tree hierarchy, geometric dimensioning and tolerancing (GD&T).', 15, 60, 5, 'Intermediate', 'MechWorks');
  insertAssessment.run('asm-08', 'skl-struct', 'Structural Analysis (STAAD.Pro)', 'RCC Frame Analysis & Code Checks', 'Tests moment distribution method, shear wall design, and load combinations.', 15, 60, 5, 'Advanced', 'InfraBuild Ltd');

  // Questions for Assessments
  const insertQuestion = db.prepare(`
    INSERT INTO questions (
      id, assessment_id, question_text, question_type, option_a, option_b, option_c, option_d,
      correct_option, explanation, code_snippet, points
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Embedded C Questions (asm-01)
  insertQuestion.run(
    'q-01', 'asm-01', 'Why must hardware memory-mapped registers be declared with the "volatile" qualifier in Embedded C?', 'MCQ',
    'To tell the compiler to store the variable in flash memory.',
    'To prevent the compiler optimizer from caching register reads in CPU registers.',
    'To allow the variable to be shared between threads without a mutex.',
    'To increase the clock execution speed of register writes.',
    'B', 'The volatile keyword notifies the compiler that the memory location can change outside the program flow (e.g. by hardware), so it must always read directly from physical memory address.',
    null, 20
  );

  insertQuestion.run(
    'q-02', 'asm-01', 'What is the output of setting bit 4 of register uint32_t REG while preserving other bits?', 'CODE',
    'REG = REG & (1 << 4);',
    'REG = REG | (1 << 4);',
    'REG = REG ^ (1 << 4);',
    'REG = ~(REG | (1 << 4));',
    'B', 'Bitwise OR with (1 << 4) sets bit index 4 to 1 while leaving all other bits unchanged.',
    '#define SET_BIT(REG, BIT) (REG |= (1U << BIT))', 20
  );

  insertQuestion.run(
    'q-03', 'asm-01', 'Which of the following is considered unsafe inside an Interrupt Service Routine (ISR)?', 'MCQ',
    'Setting a volatile status flag.',
    'Calling malloc() or a blocking delay function like sleep_ms().',
    'Reading a hardware timer capture register.',
    'Toggling a GPIO pin state.',
    'B', 'ISRs must execute deterministically in minimal cycles. Dynamic allocation (malloc) is non-reentrant and blocking calls can cause deadlocks and system watchdog resets.',
    null, 20
  );

  insertQuestion.run(
    'q-04', 'asm-01', 'In ARM Cortex-M architecture, what occurs when a higher priority interrupt arrives while a lower priority ISR is executing?', 'MCQ',
    'The CPU ignores the higher priority interrupt until the current ISR exits.',
    'Interrupt preemption occurs immediately and the higher priority ISR takes over.',
    'The microcontroller enters HardFault exception.',
    'The CPU halts until a manual software context switch is called.',
    'B', 'The Nested Vectored Interrupt Controller (NVIC) supports true nested hardware interrupt preemption based on priority grouping.',
    null, 20
  );

  insertQuestion.run(
    'q-05', 'asm-01', 'What is the primary advantage of Direct Memory Access (DMA) in microcontroller peripheral communication?', 'MCQ',
    'It converts analog sensor voltages into digital values automatically.',
    'It transfers data buffers between peripherals and RAM without CPU core intervention.',
    'It increases the flash memory size of the chip.',
    'It eliminates the need for pull-up resistors on I2C buses.',
    'B', 'DMA offloads repetitive data transfer tasks from the main CPU, allowing the core to either sleep or compute parallel DSP tasks.',
    null, 20
  );

  // RTOS FreeRTOS Questions (asm-02)
  insertQuestion.run(
    'q-06', 'asm-02', 'How does FreeRTOS prevent priority inversion when multiple tasks share a critical resource guarded by a mutex?', 'MCQ',
    'By terminating the lower priority task immediately.',
    'Through Priority Inheritance: temporarily elevating the lower task priority to match the highest waiting task.',
    'By disabling all hardware interrupts permanently.',
    'By converting the preemptive scheduler into cooperative round-robin.',
    'B', 'Priority inheritance prevents a medium-priority task from preempting a low-priority task that holds a mutex needed by a high-priority task.',
    null, 20
  );

  insertQuestion.run(
    'q-07', 'asm-02', 'Which API call is used to send data to a FreeRTOS queue safely from inside an Interrupt Service Routine?', 'CODE',
    'xQueueSend()',
    'xQueueSendFromISR()',
    'vTaskNotifyGive()',
    'xTaskResumeAll()',
    'B', 'FreeRTOS provides dedicated FromISR API variants that do not block and include higherPriorityTaskWoken yield flags.',
    'BaseType_t xHigherPriorityTaskWoken = pdFALSE;\nxQueueSendFromISR(xQueue, &data, &xHigherPriorityTaskWoken);\nportYIELD_FROM_ISR(xHigherPriorityTaskWoken);', 20
  );

  insertQuestion.run(
    'q-08', 'asm-02', 'What is the state of a FreeRTOS task that is waiting for a semaphore with a non-zero block time timeout?', 'MCQ',
    'Suspended State',
    'Blocked State',
    'Ready State',
    'Running State',
    'B', 'A task waiting for an event (semaphore, queue, or timer) with a timeout enters the Blocked state and consumes 0% CPU processing time.',
    null, 20
  );

  insertQuestion.run(
    'q-09', 'asm-02', 'In a rate monotonic scheduling (RMS) policy on an RTOS, which tasks are assigned the highest priorities?', 'MCQ',
    'Tasks with the longest execution time.',
    'Tasks with the shortest periodic cycle period (highest frequency).',
    'Tasks created last in main().',
    'Tasks consuming the least RAM stack space.',
    'B', 'RMS theorem mathematically proves that assigning priorities inversely proportional to task period provides optimal deterministic scheduling.',
    null, 20
  );

  insertQuestion.run(
    'q-10', 'asm-02', 'Why is vTaskDelay() preferred over software busy-wait loops (for (int i=0; i<10000; i++)) in RTOS applications?', 'MCQ',
    'vTaskDelay() compiles to fewer assembly instructions.',
    'vTaskDelay() yields the CPU to other Ready tasks while unblocking accurately at tick expiry.',
    'Busy wait loops cannot run inside FreeRTOS tasks.',
    'vTaskDelay() disables the RTOS tick timer to save power.',
    'B', 'vTaskDelay places the task in Blocked state, allowing other lower or equal priority tasks to execute efficiently on the CPU core.',
    null, 20
  );

  // Microcontrollers (asm-03)
  insertQuestion.run(
    'q-11', 'asm-03', 'Which standard communication bus utilizes two open-drain bidirectional lines with pull-up resistors (SDA and SCL)?', 'MCQ',
    'SPI (Serial Peripheral Interface)',
    'I2C (Inter-Integrated Circuit)',
    'UART (Universal Asynchronous Receiver-Transmitter)',
    'CAN (Controller Area Network)',
    'B', 'I2C uses two lines (Serial Data and Serial Clock) with wired-AND open-drain configuration and master-slave addressing.',
    null, 20
  );

  insertQuestion.run(
    'q-12', 'asm-03', 'What is the primary function of a hardware Watchdog Timer (WDT)?', 'MCQ',
    'To measure elapsed time of ultrasonic sensor echoes.',
    'To reset the microcontroller automatically if firmware enters an infinite loop or hangs.',
    'To calibrate the internal RC oscillator frequency.',
    'To throttle the CPU voltage during high battery temperature.',
    'B', 'The Watchdog timer requires regular software refreshing (kicking). If software hangs and fails to refresh, the WDT times out and forces a hardware reset.',
    null, 20
  );

  insertQuestion.run(
    'q-13', 'asm-03', 'In STM32 timer PWM generation, how is the output duty cycle percentage adjusted dynamically?', 'MCQ',
    'By modifying the Timer Prescaler register (PSC).',
    'By updating the Capture/Compare Register (CCR) value relative to Auto-Reload (ARR).',
    'By changing the NVIC interrupt priority level.',
    'By switching the system clock source from PLL to HSI.',
    'B', 'PWM duty cycle = (CCR / ARR) * 100%. Changing CCR directly changes the pulse high duration without altering frequency.',
    null, 20
  );

  insertQuestion.run(
    'q-14', 'asm-03', 'Why are differential signals used in the CAN (Controller Area Network) bus (CAN_H and CAN_L)?', 'MCQ',
    'To double the maximum transmission baud rate.',
    'To provide high immunity against common-mode electrical noise in automotive environments.',
    'To allow full-duplex simultaneous transmission without clock synchronization.',
    'To reduce power consumption to zero when idle.',
    'B', 'Differential voltage signaling cancels out common-mode electromagnetic noise induced across vehicle harnesses.',
    null, 20
  );

  insertQuestion.run(
    'q-15', 'asm-03', 'What happens during an ADC Successive Approximation Register (SAR) conversion cycle?', 'MCQ',
    'The analog voltage is integrated over 100 milliseconds using an op-amp.',
    'A binary search is performed comparing the sampled input voltage against internal DAC references bit by bit.',
    'A flash resistor ladder computes all bits simultaneously in one clock cycle.',
    'The microcontroller converts digital numbers into an analog audio waveform.',
    'B', 'SAR ADCs determine binary bits from MSB to LSB using a comparator and binary search approximation.',
    null, 20
  );

  // 10. ASSESSMENT ATTEMPTS (Seed Ananya's previous attempts)
  const insertAttempt = db.prepare(`
    INSERT INTO assessment_attempts (
      id, student_id, assessment_id, skill_id, score, max_score, percentage, passed,
      calculated_level, answers_json, completed_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertAttempt.run(
    'att-01', 'stu-01', 'asm-01', 'skl-emb-c', 80, 100, 80.0, 1, 4,
    JSON.stringify({ 'q-01': 'B', 'q-02': 'B', 'q-03': 'B', 'q-04': 'B', 'q-05': 'A' }),
    '2026-08-15 10:30:00'
  );

  insertAttempt.run(
    'att-02', 'stu-01', 'asm-03', 'skl-micro', 100, 100, 100.0, 1, 4,
    JSON.stringify({ 'q-11': 'B', 'q-12': 'B', 'q-13': 'B', 'q-14': 'B', 'q-15': 'B' }),
    '2026-08-18 14:00:00'
  );

  // 11. PROJECTS (Real Student Project Records with Evidence)
  const insertProject = db.prepare(`
    INSERT INTO projects (
      id, student_id, title, description, technologies, skills_used_ids, repo_url,
      demo_url, evidence_files, status, reviewer_feedback, reviewed_by, reviewed_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertProject.run(
    'prj-01', 'stu-01', 'Smart Agricultural IoT Edge Gateway with STM32 & LoRaWAN',
    'Designed an ultra-low power soil telemetry station using STM32L4 MCU, LoRa SX1276 transceiver, and custom SPI device drivers. Features deep sleep duty cycling yielding 8 months battery lifetime.',
    'STM32, C, LoRaWAN, SPI, Low Power Sleep, KiCad',
    JSON.stringify(['skl-emb-c', 'skl-micro', 'skl-iot']),
    'https://github.com/ananya-sharma/stm32-lora-agri-gateway',
    'https://demo.agri-gateway.internal',
    'schematic_v2.pdf, power_profile_oscilloscope.png, firmware_src.zip',
    'VERIFIED',
    'Outstanding hardware-software integration. Oscilloscope power trace confirms 14uA standby current. Code is modular with well-structured HAL abstractions.',
    'Dr. Ramesh Kumar', '2026-08-20 16:30:00'
  );

  insertProject.run(
    'prj-02', 'stu-01', '8-bit RISC Microcontroller Emulation on Xilinx Artix-7 FPGA',
    'Implemented a Harvard architecture 8-bit RISC processor core in Verilog HDL. Includes 16 general-purpose registers, ALU with flag generation, single-cycle instruction execution pipeline, and UART debug bridge.',
    'Verilog HDL, Vivado, FPGA Artix-7, Digital Logic',
    JSON.stringify(['skl-dig-elec', 'skl-verilog']),
    'https://github.com/ananya-sharma/risc8-fpga-core',
    'https://fpga-lab.ait.internal/risc8-demo',
    'rtl_schematic.png, testbench_waveform.vcd',
    'VERIFIED',
    'RTL synthesizes with zero timing violations at 50MHz. Testbench covers all 32 opcode instructions with 100% code coverage.',
    'Dr. Ramesh Kumar', '2026-08-22 14:15:00'
  );

  insertProject.run(
    'prj-03', 'stu-01', 'Automated EV Battery Management System with FreeRTOS (Prototype)',
    'Multi-threaded battery pack monitoring firmare with cell balancing and thermal cutoff. Running FreeRTOS tasks for voltage sampling, CAN broadcast, and fault protection.',
    'FreeRTOS, Embedded C, CAN Bus, ADC',
    JSON.stringify(['skl-rtos', 'skl-emb-c', 'skl-micro']),
    'https://github.com/ananya-sharma/freertos-ev-bms',
    null,
    'bms_architecture.pdf, task_timing_analysis.txt',
    'IN_REVIEW',
    'Good initial structure. Please record a practical demonstration of mutex priority inheritance under high bus load.',
    'Dr. Ramesh Kumar', '2026-08-29 11:00:00'
  );

  // 12. VERIFICATIONS (Evidence-Based Competence Engine Records)
  const insertVerification = db.prepare(`
    INSERT INTO verifications (
      id, student_id, skill_id, practical_task_title, practical_task_desc,
      practical_task_status, submission_notes, explanation_text, modification_task_response,
      demo_media_url, snapshot_data, assessment_score, project_evidence_score, practical_score,
      consistency_rating, final_verdict, recommended_level, reviewer_id, reviewer_name,
      reviewer_comments, verified_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Embedded C - Fully Verified with High Confidence
  insertVerification.run(
    'ver-01', 'stu-01', 'skl-emb-c',
    'Bare-Metal Circular Ring Buffer Implementation for UART DMA',
    'Implement a lock-free circular FIFO ring buffer with wrap-around pointer arithmetic and interrupt-safe volatile head/tail indexes.',
    'APPROVED',
    'Submitted implementation with test harness checking overrun and underrun scenarios.',
    'I avoided mutexes in single-producer single-consumer mode by keeping head and tail indexes as atomic volatile size_t counters with memory barriers.',
    'Modified buffer dynamically to support variable packet sizing and zero-copy packet peeking.',
    'https://verification-archive.ait.internal/evidence/ananya_uart_dma_demo.mp4',
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"><rect width="300" height="200" fill="%230f172a"/><text x="20" y="50" fill="%2338bdf8" font-size="14" font-family="monospace">STM32 DMA UART Logic Analyzer</text><path d="M20 100 L80 100 L80 140 L140 140 L140 100 L200 100 L200 140 L260 140" stroke="%2322c55e" stroke-width="2" fill="none"/></svg>',
    86.0, 90.0, 92.0, 'HIGH', 'VERIFIED', 4,
    'usr-fac-01', 'Dr. Ramesh Kumar',
    'Comprehensive multi-factor evidence. Candidate demonstrated real-time code modification and explained hardware interrupt behavior flawlessly.',
    '2026-08-20 17:00:00'
  );

  // RTOS - Currently In Review / Needs Practical Demo (Shows Verification Workflow in action!)
  insertVerification.run(
    'ver-02', 'stu-01', 'skl-rtos',
    'FreeRTOS Priority Inversion & Mutex Ceiling Demonstration',
    'Demonstrate two tasks sharing an SPI peripheral where a low-priority task holds the mutex while a high-priority task attempts acquisition.',
    'SUBMITTED',
    'Created a test application on STM32 Nucleo board using FreeRTOS mutexes.',
    'Used xSemaphoreCreateMutex() which inherently applies priority inheritance protocol.',
    'Pending live modification task during faculty verification interview.',
    null, null,
    60.0, 70.0, 65.0, 'MEDIUM', 'NEEDS_REVIEW', 2,
    'usr-fac-01', 'Dr. Ramesh Kumar',
    'Assessment passed baseline. Awaiting live camera demonstration or video recording to verify hands-on execution.',
    null
  );

  // 13. OPPORTUNITIES (Internships & Jobs with transparent requirements)
  const insertOpportunity = db.prepare(`
    INSERT INTO opportunities (
      id, company_id, company_name, title, opportunity_type, branch, description,
      location, mode, duration, stipend, deadline, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertOpportunity.run(
    'opp-01', 'ind-01', 'Nexa Embedded Solutions',
    'Embedded Systems & Firmware Engineering Intern', 'INTERNSHIP', 'ECE',
    'Join our automotive microcontroller engineering group. Work on low-level peripheral drivers (CAN, SPI, UART), FreeRTOS task scheduling, and hardware-in-the-loop (HIL) automated test benches.',
    'Bangalore, Karnataka', 'HYBRID', '6 Months', '₹35,000 / month', '2026-09-30', 'OPEN'
  );

  insertOpportunity.run(
    'opp-02', 'ind-02', 'QuantVLSI Silicon Technologies',
    'VLSI RTL Design & Verification Intern', 'INTERNSHIP', 'ECE',
    'Participate in digital ASIC IP core development, Verilog/SystemVerilog RTL simulation, UVM testbench authoring, and FPGA hardware emulation.',
    'Noida / Delhi NCR', 'ON_SITE', '6 Months', '₹40,000 / month', '2026-10-15', 'OPEN'
  );

  insertOpportunity.run(
    'opp-03', 'ind-03', 'Apex AI & Robotics Labs',
    'Computer Vision & Edge AI Research Intern', 'INTERNSHIP', 'CSE',
    'Develop real-time object detection models for autonomous mobile robots using PyTorch, TensorRT, and NVIDIA Jetson edge accelerators.',
    'Bangalore, Karnataka', 'HYBRID', '6 Months', '₹45,000 / month', '2026-10-01', 'OPEN'
  );

  insertOpportunity.run(
    'opp-04', 'ind-04', 'GridTech Dynamics Power Solutions',
    'Smart Grid & SCADA Systems Trainee Engineer', 'FULL_TIME', 'EEE',
    'Assist in designing microgrid dispatch controllers, distribution automation, and IEC 61850 substation communication protocols.',
    'Hyderabad, Telangana', 'ON_SITE', 'Full-time', '₹8.5 - 11.0 LPA', '2026-11-30', 'OPEN'
  );

  insertOpportunity.run(
    'opp-05', 'ind-03', 'Apex AI & Robotics Labs',
    'Robotics Hardware & ROS2 Control Systems Intern', 'INTERNSHIP', 'Mechanical',
    'Design mechanical linkages, perform FEA stress analysis on robotic arms, and interface ROS2 trajectory controllers.',
    'Pune, Maharashtra', 'ON_SITE', '6 Months', '₹32,000 / month', '2026-09-25', 'OPEN'
  );

  insertOpportunity.run(
    'opp-06', 'ind-05', 'InfraBuild Structural Engineering Ltd',
    'Graduate Structural Design Engineer (STAAD & BIM)', 'FULL_TIME', 'Civil',
    'Work on commercial high-rise reinforced concrete structural analysis, seismic load compliance, and Autodesk Revit 3D BIM modeling.',
    'Mumbai, Maharashtra', 'HYBRID', 'Full-time', '₹7.0 - 9.5 LPA', '2026-10-31', 'OPEN'
  );

  insertOpportunity.run(
    'opp-07', 'ind-01', 'Nexa Embedded Solutions',
    'IoT Cloud Edge Gateway Developer', 'INTERNSHIP', 'ALL',
    'Build reliable edge firmware that connects embedded sensor nodes to cloud telemetry platforms using MQTT, TLS 1.3, and Python.',
    'Remote', 'REMOTE', '3 Months', '₹28,000 / month', '2026-10-10', 'OPEN'
  );

  insertOpportunity.run(
    'opp-08', 'ind-02', 'QuantVLSI Silicon Technologies',
    'Digital Electronics & FPGA Prototyping Trainee', 'APPRENTICESHIP', 'ECE',
    'Hands-on apprenticeship building Vivado IP cores, debugging hardware with oscilloscope/logic analyzer, and timing closure.',
    'Hyderabad, Telangana', 'ON_SITE', '1 Year', '₹30,000 / month', '2026-10-20', 'OPEN'
  );

  // Opportunity Skill Requirements (Used by the Transparent Matching Engine)
  const insertOppSkill = db.prepare(`
    INSERT INTO opportunity_skills (id, opportunity_id, skill_id, min_level, weight)
    VALUES (?, ?, ?, ?, ?)
  `);

  // Nexa Embedded Systems Intern (opp-01)
  insertOppSkill.run('os-01', 'opp-01', 'skl-emb-c', 4, 1.5);
  insertOppSkill.run('os-02', 'opp-01', 'skl-micro', 4, 1.5);
  insertOppSkill.run('os-03', 'opp-01', 'skl-dig-elec', 3, 1.0);
  insertOppSkill.run('os-04', 'opp-01', 'skl-rtos', 3, 1.2);
  insertOppSkill.run('os-05', 'opp-01', 'skl-emb-linux', 3, 1.0);

  // QuantVLSI RTL Intern (opp-02)
  insertOppSkill.run('os-06', 'opp-02', 'skl-verilog', 4, 1.5);
  insertOppSkill.run('os-07', 'opp-02', 'skl-vlsi', 4, 1.5);
  insertOppSkill.run('os-08', 'opp-02', 'skl-dig-elec', 3, 1.0);

  // Apex AI Computer Vision (opp-03)
  insertOppSkill.run('os-09', 'opp-03', 'skl-python', 4, 1.5);
  insertOppSkill.run('os-10', 'opp-03', 'skl-ml', 4, 1.5);
  insertOppSkill.run('os-11', 'opp-03', 'skl-sql', 3, 0.8);

  // GridTech Smart Grid (opp-04)
  insertOppSkill.run('os-12', 'opp-04', 'skl-power', 4, 1.5);
  insertOppSkill.run('os-13', 'opp-04', 'skl-control', 3, 1.2);
  insertOppSkill.run('os-14', 'opp-04', 'skl-smartgrid', 3, 1.2);

  // MechWorks Robotics (opp-05)
  insertOppSkill.run('os-15', 'opp-05', 'skl-cad', 4, 1.3);
  insertOppSkill.run('os-16', 'opp-05', 'skl-robotics', 4, 1.5);
  insertOppSkill.run('os-17', 'opp-05', 'skl-control', 3, 1.0);

  // InfraBuild Structural (opp-06)
  insertOppSkill.run('os-18', 'opp-06', 'skl-struct', 4, 1.5);
  insertOppSkill.run('os-19', 'opp-06', 'skl-autocad-civil', 3, 1.2);
  insertOppSkill.run('os-20', 'opp-06', 'skl-bim', 3, 1.2);

  // 14. APPLICATIONS (Seed Ananya Sharma matching and application pipeline)
  const insertApplication = db.prepare(`
    INSERT INTO applications (
      id, student_id, opportunity_id, resume_summary, cover_letter,
      match_score, match_breakdown_json, status, notes, applied_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertApplication.run(
    'app-01', 'stu-01', 'opp-01',
    'ECE 2nd Year with verified expertise in Embedded C, STM32 Microcontrollers, and Digital Logic. Verified projects in LoRaWAN edge gateway.',
    'I have built verified bare-metal peripheral drivers on STM32 and tested hardware on logic analyzers. I am currently completing my FreeRTOS certification and eager to contribute to automotive firmware at Nexa.',
    87,
    JSON.stringify({
      skillMatchScore: 88,
      assessmentScore: 90,
      projectEvidenceScore: 92,
      experienceScore: 70,
      finalScore: 87,
      breakdown: [
        { skill: 'Embedded C', required: 4, actual: 4, verified: true, match: 'MATCH_EXACT' },
        { skill: 'Microcontrollers (STM32)', required: 4, actual: 4, verified: true, match: 'MATCH_EXACT' },
        { skill: 'Digital Electronics', required: 3, actual: 4, verified: true, match: 'MATCH_EXCEEDS' },
        { skill: 'RTOS (FreeRTOS)', required: 3, actual: 1, verified: false, match: 'GAP_WARNING' },
        { skill: 'Embedded Linux', required: 3, actual: 1, verified: false, match: 'GAP_MISSING' }
      ]
    }),
    'SHORTLISTED',
    'Candidate has top-tier verified practical evidence in Embedded C and STM32. High potential for firmware internship.',
    '2026-08-25 11:20:00'
  );

  insertApplication.run(
    'app-02', 'stu-03', 'opp-02',
    'ECE 3rd Year with verified RTL modeling, Verilog testbenches, and CMOS VLSI design.',
    'Strong focus on digital ASIC design flow and FPGA verification.',
    94,
    JSON.stringify({
      skillMatchScore: 95, assessmentScore: 92, projectEvidenceScore: 96, experienceScore: 85, finalScore: 94,
      breakdown: [
        { skill: 'Verilog HDL', required: 4, actual: 5, verified: true, match: 'MATCH_EXCEEDS' },
        { skill: 'VLSI Design', required: 4, actual: 4, verified: true, match: 'MATCH_EXACT' },
        { skill: 'Digital Electronics', required: 3, actual: 4, verified: true, match: 'MATCH_EXCEEDS' }
      ]
    }),
    'INTERVIEW',
    'Technical round scheduled with Chief RTL Architect.',
    '2026-08-22 10:00:00'
  );

  insertApplication.run(
    'app-03', 'stu-02', 'opp-03',
    'CSE 3rd Year with PyTorch, computer vision, and neural network model quantization experience.',
    'Excited about robotics vision perception pipelines.',
    91,
    JSON.stringify({
      skillMatchScore: 92, assessmentScore: 95, projectEvidenceScore: 88, experienceScore: 80, finalScore: 91,
      breakdown: [
        { skill: 'Python Programming', required: 4, actual: 5, verified: true, match: 'MATCH_EXCEEDS' },
        { skill: 'Machine Learning', required: 4, actual: 4, verified: true, match: 'MATCH_EXACT' },
        { skill: 'SQL', required: 3, actual: 4, verified: true, match: 'MATCH_EXCEEDS' }
      ]
    }),
    'SHORTLISTED',
    'Shortlisted for technical challenge.',
    '2026-08-26 15:45:00'
  );

  // 15. LEARNING ROADMAP (Personalized for Ananya Sharma)
  const insertLearningPath = db.prepare(`
    INSERT INTO learning_paths (
      id, student_id, career_role_id, title, target_readiness, current_readiness,
      total_modules, completed_modules
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertLearningPath.run(
    'lp-01', 'stu-01', 'cr-01',
    'Embedded Systems Engineer Fast-Track Roadmap',
    95, 74, 5, 2
  );

  const insertActivity = db.prepare(`
    INSERT INTO learning_activities (
      id, learning_path_id, week_number, title, description, skill_id, skill_name,
      activity_type, resource_url, estimated_hours, is_completed, completed_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertActivity.run(
    'act-01', 'lp-01', 1,
    'RTOS Fundamentals & Preemptive Kernel Scheduling',
    'Understand round-robin vs priority-based scheduling, tick timer interrupts, and context switching assembly internals.',
    'skl-rtos', 'RTOS (FreeRTOS)', 'THEORY', 'https://freertos.org/documentation/fundamentals', 6, 1, '2026-08-24 18:00:00'
  );

  insertActivity.run(
    'act-02', 'lp-01', 2,
    'FreeRTOS Tasks, Queues & Semaphore Synchronization',
    'Implement multi-task telemetry with thread-safe queues and binary semaphores for peripheral resource sharing.',
    'skl-rtos', 'RTOS (FreeRTOS)', 'PRACTICAL', 'https://freertos.org/FreeRTOS-queues.html', 8, 1, '2026-08-28 17:30:00'
  );

  insertActivity.run(
    'act-03', 'lp-01', 3,
    'Embedded Linux Architecture & Device Trees',
    'Explore Linux kernel architecture, U-Boot bootloader sequence, Device Tree source (DTS) pin multiplexing, and GPIO character drivers.',
    'skl-emb-linux', 'Embedded Linux & Device Drivers', 'THEORY', 'https://bootlin.com/doc/training/embedded-linux/', 10, 0, null
  );

  insertActivity.run(
    'act-04', 'lp-01', 4,
    'Build Mini Project: Multi-Threaded Sensor Hub with FreeRTOS',
    'Develop an STM32 FreeRTOS application with 3 concurrent tasks: sensor acquisition via DMA, display rendering, and UART logging.',
    'skl-rtos', 'RTOS (FreeRTOS)', 'PROJECT', 'https://github.com/embedded-patterns/freertos-sensor-hub', 12, 0, null
  );

  insertActivity.run(
    'act-05', 'lp-01', 5,
    'Faculty Practical Demonstration & Reassessment',
    'Perform live camera demonstration with faculty reviewer Dr. Ramesh Kumar to earn Verified Level 4 badge in RTOS & Embedded Linux.',
    'skl-rtos', 'RTOS (FreeRTOS)', 'ASSESSMENT', 'https://portal.ait.internal/assessments/rtos-final', 4, 0, null
  );

  // 16. INDUSTRY-ACADEMIA COLLABORATIONS
  const insertCollaboration = db.prepare(`
    INSERT INTO collaborations (
      id, industry_id, company_name, title, type, discipline, description,
      duration, expected_outcomes, status, faculty_id, faculty_name, institution_id, institution_name
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertCollaboration.run(
    'col-01', 'ind-01', 'Nexa Embedded Solutions',
    'Hands-on Automotive FreeRTOS & CAN Bus Workshop', 'WORKSHOP', 'ECE',
    '3-day intensive boot camp covering AUTOSAR basics, FreeRTOS kernel internals, and CAN-FD bus diagnostic decoding on hardware development kits.',
    '3 Days (24 Hours)', 'Training 60 ECE students with direct internship interview access for top 10 scorers.',
    'ACTIVE', 'fac-01', 'Dr. Ramesh Kumar', 'inst-01', 'Apex Institute of Technology'
  );

  insertCollaboration.run(
    'col-02', 'ind-02', 'QuantVLSI Silicon Technologies',
    'Open-Source EDA & Digital IC Design Faculty Development Program', 'FDP', 'ECE',
    'FDP program training 25 faculty members in SkyWater 130nm PDK, OpenROAD, and synthesizable RTL verification methodologies.',
    '1 Week', 'Curriculum modernization and establishment of Open-Source VLSI lab.',
    'ACCEPTED', 'fac-01', 'Dr. Ramesh Kumar', 'inst-01', 'Apex Institute of Technology'
  );

  insertCollaboration.run(
    'col-03', 'ind-03', 'Apex AI & Robotics Labs',
    'Industrial Mobile Manipulation Live Project Sponsorship', 'LIVE_PROJECT', 'Mechanical',
    'Sponsoring final-year student capstone projects building ROS2-powered autonomous ground vehicles with lidar mapping.',
    '4 Months', '2 Functional prototype robots and pre-placement offers for project team.',
    'REQUESTED', 'fac-01', 'Dr. Ramesh Kumar', 'inst-01', 'Apex Institute of Technology'
  );

  insertCollaboration.run(
    'col-04', 'ind-04', 'GridTech Dynamics Power Solutions',
    'Smart Microgrid Simulation & SCADA Guest Lecture Series', 'GUEST_LECTURE', 'EEE',
    'Industry experts delivering 4 lecture sessions on renewable grid integration and real-time digital simulator (RTDS) modeling.',
    '4 Sessions', 'Exposure to modern smart grid automation standards for EEE 3rd/4th year cohorts.',
    'PROPOSED', null, null, 'inst-01', 'Apex Institute of Technology'
  );

  insertCollaboration.run(
    'col-05', 'ind-05', 'InfraBuild Structural Engineering Ltd',
    'Structural Health Monitoring & BIM Co-Research Initiative', 'RESEARCH', 'Civil',
    'Joint research grant on optical fiber strain sensor placement for bridge structural health monitoring.',
    '12 Months', 'Joint IEEE conference publication and student research fellowships.',
    'ACCEPTED', 'fac-01', 'Dr. Ramesh Kumar', 'inst-01', 'Apex Institute of Technology'
  );

  // 17. CERTIFICATIONS (For Ananya Sharma)
  const insertCert = db.prepare(`
    INSERT INTO certifications (
      id, student_id, title, issuer, issue_date, credential_id, credential_url, verified
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertCert.run('crt-01', 'stu-01', 'ARM Cortex-M Embedded Architecture & HAL Masterclass', 'ARM University Program', '2026-06-15', 'ARM-EMB-94829', 'https://arm.com/verify/ARM-EMB-94829', 1);
  insertCert.run('crt-02', 'stu-01', 'STM32 Microcontroller Peripheral Interfacing', 'STMicroelectronics Academy', '2026-07-20', 'STM-2026-7731', 'https://st.com/academy/cert/STM-2026-7731', 1);
  insertCert.run('crt-03', 'stu-01', 'PCB Design & Schematic Capture with KiCad', 'Hardware Academy India', '2026-05-10', 'HA-PCB-1192', 'https://hardwareacademy.in/cert/1192', 1);

  // 18. NOTIFICATIONS
  const insertNotification = db.prepare(`
    INSERT INTO notifications (id, user_id, title, message, type, link, is_read)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertNotification.run('not-01', 'usr-stu-01', 'Application Shortlisted! 🎉', 'Nexa Embedded Solutions shortlisted your application for Embedded Systems Firmware Intern.', 'APPLICATION', '/applications', 0);
  insertNotification.run('not-02', 'usr-stu-01', 'Project Verified by Faculty', 'Dr. Ramesh Kumar reviewed and marked "Smart Agricultural IoT Edge Gateway" as VERIFIED.', 'VERIFICATION', '/projects', 0);
  insertNotification.run('not-03', 'usr-stu-01', 'New Learning Milestone Unlocked', 'You completed Week 2: FreeRTOS Tasks & Queues. Readiness updated to 74%!', 'SYSTEM', '/roadmap', 1);

  insertNotification.run('not-04', 'usr-ind-01', 'Top Matching Candidate Applied', 'Ananya Sharma (87% Match) applied for Embedded Systems & Firmware Engineering Intern.', 'APPLICATION', '/candidates', 0);
  insertNotification.run('not-05', 'usr-fac-01', 'Skill Verification Request Pending', 'Ananya Sharma submitted FreeRTOS demonstration for faculty evaluation.', 'VERIFICATION', '/faculty/verifications', 0);
  insertNotification.run('not-06', 'usr-adm-01', 'New Industry Partnership Activated', 'Nexa Embedded Solutions accepted MoU collaboration for Automotive FreeRTOS Workshop.', 'COLLABORATION', '/admin/collaborations', 0);

  console.log('✅ Database seeded successfully with multi-discipline data, connected demo student, and full verification pipeline.');
});

try {
  seedTransaction();
} catch (error) {
  console.error('❌ Error during seeding:', error);
  process.exit(1);
}
