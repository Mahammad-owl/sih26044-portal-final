import {
  Student,
  JobOpening,
  Assessment,
  CollaborationOffer,
  InstitutionAnalytics
} from '../types';

export const DEMO_STUDENTS: Student[] = [
  {
    id: 'stud-1',
    name: 'Ananya Sharma',
    email: 'student@demo.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    branch: 'ECE',
    year: 3,
    college: 'National Institute of Technology, Trichy',
    cgpa: 8.92,
    careerGoal: 'Embedded Systems Engineer',
    bio: 'ECE undergraduate passionate about microcontrollers, bare-metal C programming, RTOS scheduling, and edge hardware telemetry. Looking for hands-on firmware & IoT roles.',
    phone: '+91 98765 43210',
    github: 'github.com/ananya-sharma-ece',
    linkedin: 'linkedin.com/in/ananya-embedded',
    readinessScore: 84,
    fraudRiskFlag: false,
    consistencyNotes: 'High consistency across theoretical assessments, hardware code submissions, and oral viva explanation.',
    verifiedSkills: [
      {
        id: 'vs-1',
        name: 'Embedded C',
        category: 'Firmware & Systems',
        branch: 'ECE',
        selfDeclaredLevel: 4,
        verifiedLevel: 4,
        status: 'VERIFIED',
        confidence: 'HIGH',
        assessmentScore: 92,
        projectEvidence: {
          projectName: 'CAN-Bus Vehicle Telemetry Node (STM32)',
          description: 'Implemented bare-metal register-level firmware in Embedded C to parse CAN 2.0B frames with DMA buffering.',
          verified: true,
          repoUrl: 'github.com/ananya-sharma-ece/stm32-can-node'
        },
        practicalTaskScore: 94,
        explanationScore: 89,
        consistencyScore: 95,
        lastVerifiedDate: '2026-02-14',
        badgeId: 'BADGE-EMB-C-PRO'
      },
      {
        id: 'vs-2',
        name: 'Microcontrollers (ARM Cortex-M & AVR)',
        category: 'Hardware Systems',
        branch: 'ECE',
        selfDeclaredLevel: 4,
        verifiedLevel: 4,
        status: 'VERIFIED',
        confidence: 'HIGH',
        assessmentScore: 88,
        projectEvidence: {
          projectName: 'Interrupt-Driven Industrial RPM Meter',
          description: 'Timer input capture configured for optical encoder pulses with timer overflow compensation.',
          verified: true
        },
        practicalTaskScore: 90,
        explanationScore: 92,
        consistencyScore: 91,
        lastVerifiedDate: '2026-01-20'
      },
      {
        id: 'vs-3',
        name: 'Arduino & Sensor Interfacing',
        category: 'IoT Prototyping',
        branch: 'ECE',
        selfDeclaredLevel: 5,
        verifiedLevel: 5,
        status: 'VERIFIED',
        confidence: 'HIGH',
        assessmentScore: 96,
        projectEvidence: {
          projectName: 'Precision Agricultural Soil Node',
          description: 'LoRaWAN + I2C/SPI sensors battery-optimized with deep sleep watchdog modes.',
          verified: true
        },
        practicalTaskScore: 95,
        explanationScore: 94,
        consistencyScore: 96,
        lastVerifiedDate: '2025-11-12'
      },
      {
        id: 'vs-4',
        name: 'Digital Electronics & Verilog',
        category: 'VLSI & Circuit Design',
        branch: 'ECE',
        selfDeclaredLevel: 4,
        verifiedLevel: 3,
        status: 'VERIFIED',
        confidence: 'MEDIUM',
        assessmentScore: 78,
        projectEvidence: {
          projectName: '8-Bit ALU with Pipelined Stages',
          description: 'Synthesized on Xilinx Vivado for Spartan-7 FPGA.',
          verified: true
        },
        practicalTaskScore: 82,
        explanationScore: 80,
        consistencyScore: 85,
        lastVerifiedDate: '2025-12-05'
      },
      {
        id: 'vs-5',
        name: 'RTOS (FreeRTOS)',
        category: 'Embedded Operating Systems',
        branch: 'ECE',
        selfDeclaredLevel: 3,
        verifiedLevel: 1,
        status: 'NEEDS REVIEW',
        confidence: 'LOW',
        assessmentScore: 52,
        projectEvidence: {
          projectName: 'Task Scheduler Demo',
          description: 'Basic multi-threading test; lacks queue synchronization and priority inheritance handling.',
          verified: false
        },
        practicalTaskScore: 48,
        explanationScore: 55,
        consistencyScore: 50,
        lastVerifiedDate: '2026-02-22'
      }
    ],
    skillGaps: [
      {
        id: 'sg-1',
        skillName: 'RTOS (FreeRTOS / Zephyr)',
        branch: 'ECE',
        category: 'Embedded Operating Systems',
        targetLevel: 4,
        currentLevel: 1,
        gapSeverity: 'HIGH',
        impactOnTargetRole: 'Essential for automotive and industrial IoT firmware engineering roles at Bosch, Ather, Qualcomm.',
        recommendedAction: 'Complete FreeRTOS task synchronization, semaphores, mutexes and context-switch deep-dive.',
        learningTimeEstWeeks: 3,
        resources: [
          {
            title: 'Mastering RTOS: Hands-On with STM32 & FreeRTOS',
            type: 'Course',
            provider: 'NPTEL / Swayam + Embedded Hub',
            duration: '18 hours',
            url: '#'
          },
          {
            title: 'Multithreaded Sensor Gateway Mini-Project',
            type: 'Project',
            provider: 'Industry-Curated Lab Kit',
            duration: '2 weeks',
            url: '#'
          }
        ]
      },
      {
        id: 'sg-2',
        skillName: 'Embedded Linux & Device Drivers',
        branch: 'ECE',
        category: 'Embedded Systems',
        targetLevel: 3,
        currentLevel: 0,
        gapSeverity: 'HIGH',
        impactOnTargetRole: 'Required for high-end smart gateway and telematics hardware roles.',
        recommendedAction: 'Learn kernel module compilation, GPIO subsystem, and Device Tree basics on Raspberry Pi / BeagleBone.',
        learningTimeEstWeeks: 4,
        resources: [
          {
            title: 'Embedded Linux Kernel Primer for ECE Engineers',
            type: 'Workshop',
            provider: 'Texas Instruments Academy',
            duration: '12 hours',
            url: '#'
          }
        ]
      },
      {
        id: 'sg-3',
        skillName: 'PCB Design & KiCad',
        branch: 'ECE',
        category: 'Hardware Design',
        targetLevel: 3,
        currentLevel: 2,
        gapSeverity: 'MEDIUM',
        impactOnTargetRole: 'Beneficial for full-cycle hardware prototyping.',
        recommendedAction: 'Design 2-layer schematic and Gerber export for an STM32 development board.',
        learningTimeEstWeeks: 2,
        resources: [
          {
            title: 'Hardware Schematic to Fabrication: KiCad 8',
            type: 'Documentation',
            provider: 'Open Hardware Institute',
            duration: '8 hours',
            url: '#'
          }
        ]
      }
    ],
    projects: [
      {
        id: 'proj-1',
        title: 'CAN-Bus Edge Telematics Unit for Electric 2-Wheelers',
        branch: 'ECE',
        category: 'Automotive Embedded Systems',
        description: 'Engineered an STM32F4-based edge module interfacing with vehicle CAN bus at 500kbps, transmitting speed, battery SOC, and thermal anomalies over LTE-M to cloud broker.',
        techStack: ['STM32 (ARM Cortex-M4)', 'Embedded C', 'CAN 2.0B', 'FreeRTOS Tasks', 'MQTT'],
        role: 'Firmware Lead & Hardware Integrator',
        evidenceType: 'GitHub Code',
        evidenceUrl: 'https://github.com/ananya-sharma-ece/stm32-can-node',
        verifiedByFaculty: true,
        facultyMentor: 'Dr. K. S. Ramanathan (Dept of ECE)',
        verificationConfidence: 'HIGH',
        skillsDemonstrated: ['Embedded C', 'Microcontrollers', 'CAN Protocol', 'DMA Buffering'],
        date: 'Jan 2026',
        metrics: '99.4% packet delivery under heavy EMI noise conditions'
      },
      {
        id: 'proj-2',
        title: 'Sub-GHz LoRaWAN Soil Moisture Mesh for Smart Agriculture',
        branch: 'ECE',
        category: 'IoT & Edge Computing',
        description: 'Ultra low-power sensor node waking up every 15 minutes, measuring capacitive soil permittivity and sending telemetry via LoRa SX1276 transceiver.',
        techStack: ['AVR Microcontroller', 'C++', 'LoRaWAN', 'SPI', 'Power Optimization'],
        role: 'Solo Developer',
        evidenceType: 'Hardware Demo Video',
        evidenceUrl: 'https://youtube.com/watch?v=demo-lora-node',
        verifiedByFaculty: true,
        facultyMentor: 'Prof. Anitha Murali',
        verificationConfidence: 'HIGH',
        skillsDemonstrated: ['Sensor Interfacing', 'SPI Protocol', 'Power Management'],
        date: 'Oct 2025',
        metrics: 'Estimated 18-month battery life on 2x AA cells'
      }
    ],
    certifications: [
      {
        id: 'cert-1',
        name: 'ARM Cortex-M Microcontroller Architecture & Firmware',
        issuer: 'ARM University Program & edX',
        date: 'Nov 2025',
        skills: ['ARM Cortex-M', 'Memory Mapping', 'Nested Vectored Interrupts (NVIC)'],
        verified: true,
        credentialId: 'ARM-NIT-2025-9921'
      },
      {
        id: 'cert-2',
        name: 'NPTEL Elite Certificate: Microprocessors and Interfacing',
        issuer: 'IIT Kharagpur / SWAYAM',
        date: 'Apr 2025',
        skills: ['Assembly Language', '8051', 'Interfacing Peripherals'],
        verified: true,
        credentialId: 'NPTEL25EC10283921'
      }
    ],
    achievements: [
      {
        id: 'ach-1',
        title: 'Winner - National Smart Mobility Hardware Hackathon 2025',
        event: 'EV Innovators Challenge (IIT Madras)',
        date: 'Dec 2025',
        description: 'Awarded 1st place among 140 teams for low-latency CAN brake telemetry system.',
        badgeType: 'Hackathon'
      },
      {
        id: 'ach-2',
        title: 'Author of IEEE Student Conference Paper',
        event: 'IEEE INDICON 2025',
        date: 'Nov 2025',
        description: 'Published paper titled "Low Overhead DMA-CAN Filter for Edge Telemetry".',
        badgeType: 'Paper Publication'
      }
    ],
    roadmap: [
      {
        week: 1,
        phaseTitle: 'FreeRTOS Kernel Fundamentals',
        focusSkill: 'RTOS Task Scheduling & Prioritization',
        status: 'Completed',
        learningObjective: 'Master preemptive context switching, tick interrupts, and FreeRTOS task states (Blocked, Ready, Running).',
        keyTopics: ['xTaskCreate API', 'vTaskDelay vs vTaskDelayUntil', 'Idle Task Hook', 'Task Priorities'],
        practicalTask: 'Create 3 periodic tasks with rate monotonic priorities on STM32 Nucleo.',
        milestoneProject: 'Multi-rate LED & UART diagnostic streamer without CPU blocking.',
        verificationCheck: 'Automated code check: verified 0% jitter in task invocation.'
      },
      {
        week: 2,
        phaseTitle: 'Inter-Task IPC & Synchronization',
        focusSkill: 'Queues, Mutexes & Binary Semaphores',
        status: 'In-Progress',
        learningObjective: 'Prevent race conditions, resolve priority inversions with mutex inheritance, and build thread-safe circular ring buffers.',
        keyTopics: ['xQueueSend / xQueueReceive', 'Binary vs Counting Semaphores', 'Priority Inversion Handling', 'Interrupt Service Routine (FromISR APIs)'],
        practicalTask: 'Buffer incoming UART GPS NMEA sentences in ISR and safely post to queue for processing.',
        milestoneProject: 'Producer-Consumer GPS & IMU sensor pipeline with mutex-guarded I2C bus.',
        verificationCheck: 'Practical code execution: Pass concurrency stress test.'
      },
      {
        week: 3,
        phaseTitle: 'Embedded Linux & Kernel Subsystems',
        focusSkill: 'Device Drivers & GPIO Subsystem',
        status: 'Upcoming',
        learningObjective: 'Understand Linux device driver models, character devices, Sysfs/Devfs, and Device Tree Overlays.',
        keyTopics: ['Character Device Driver Skeleton', 'Device Tree Syntax (.dts/.dtsi)', 'Kernel Module Makefile', 'POSIX Threads (pthreads)'],
        practicalTask: 'Write a kernel module that responds to GPIO button hardware interrupts.',
        milestoneProject: 'Userspace C service reading hardware ADC through Linux IIO subsystem.',
        verificationCheck: 'Mentor viva & module compilation log audit.'
      },
      {
        week: 4,
        phaseTitle: 'Industry Capstone & Skill Re-Assessment',
        focusSkill: 'Production-Grade Automotive Firmware Gateway',
        status: 'Upcoming',
        learningObjective: 'Synthesize RTOS, CAN Bus, and Power Fail-safe Storage into a production-grade firmware release.',
        keyTopics: ['Watchdog Timer (IWDG)', 'CRC-32 Firmware Verification', 'Flash Memory Ring-Buffer Log', 'MISRA C Guideline Checklist'],
        practicalTask: 'Build fail-safe firmware that automatically recovers state following unexpected brownout reset.',
        milestoneProject: 'End-to-End Automotive Telemetry Firmware with MISRA-C compliance.',
        verificationCheck: 'Platform Evidence-Based Verification Re-Assessment (Target score > 90%).'
      }
    ],
    applications: [
      {
        id: 'app-1',
        internshipId: 'job-1',
        roleTitle: 'Embedded IoT Firmware Intern',
        companyName: 'Bosch Engineering & Mobility',
        appliedDate: '2026-02-18',
        matchScore: 89,
        status: 'Shortlisted',
        feedback: 'Strong alignment with Embedded C and CAN telemetry; candidate currently progressing through FreeRTOS roadmap.'
      },
      {
        id: 'app-2',
        internshipId: 'job-2',
        roleTitle: 'EV Powertrain Firmware Trainee',
        companyName: 'Ather Energy',
        appliedDate: '2026-02-20',
        matchScore: 86,
        status: 'Applied',
        feedback: 'Application under review by Power Electronics & Embedded team.'
      }
    ]
  },
  {
    id: 'stud-2',
    name: 'Arjun Mehta',
    email: 'arjun.mehta@cse.demo.com',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    branch: 'CSE',
    year: 4,
    college: 'National Institute of Technology, Trichy',
    cgpa: 9.15,
    careerGoal: 'Cloud & AI Platform Engineer',
    bio: 'CSE Senior focused on Distributed Systems, Cloud Native architectures (Kubernetes, Go), and LLM orchestration.',
    phone: '+91 98111 22334',
    github: 'github.com/arjun-cloud-systems',
    linkedin: 'linkedin.com/in/arjun-mehta-ai',
    readinessScore: 92,
    fraudRiskFlag: false,
    verifiedSkills: [
      {
        id: 'vs-c1',
        name: 'Python & FastAPI',
        category: 'Backend & AI',
        branch: 'CSE',
        selfDeclaredLevel: 5,
        verifiedLevel: 5,
        status: 'VERIFIED',
        confidence: 'HIGH',
        assessmentScore: 95,
        projectEvidence: {
          projectName: 'High-Throughput Vector Search API',
          description: 'Built asynchronous API with Redis caching and Qdrant vector index.',
          verified: true
        },
        practicalTaskScore: 98,
        explanationScore: 96,
        consistencyScore: 98,
        lastVerifiedDate: '2026-01-10'
      },
      {
        id: 'vs-c2',
        name: 'Docker & Kubernetes',
        category: 'Cloud Infrastructure',
        branch: 'CSE',
        selfDeclaredLevel: 4,
        verifiedLevel: 4,
        status: 'VERIFIED',
        confidence: 'HIGH',
        assessmentScore: 90,
        projectEvidence: {
          projectName: 'Zero-Downtime Microservices Cluster',
          description: 'Deployed Helm charts with HPA auto-scaling and Prometheus metrics.',
          verified: true
        },
        practicalTaskScore: 92,
        explanationScore: 91,
        consistencyScore: 93,
        lastVerifiedDate: '2026-02-05'
      },
      {
        id: 'vs-c3',
        name: 'Distributed Systems & SQL/NoSQL',
        category: 'Systems Architecture',
        branch: 'CSE',
        selfDeclaredLevel: 4,
        verifiedLevel: 4,
        status: 'VERIFIED',
        confidence: 'HIGH',
        assessmentScore: 89,
        projectEvidence: {
          projectName: 'Distributed Consensus Log',
          description: 'Raft algorithm implementation in Go with heartbeat replication.',
          verified: true
        },
        practicalTaskScore: 90,
        explanationScore: 88,
        consistencyScore: 90,
        lastVerifiedDate: '2026-01-25'
      }
    ],
    skillGaps: [
      {
        id: 'sg-c1',
        skillName: 'Terraform & Infrastructure-as-Code',
        branch: 'CSE',
        category: 'Cloud DevOps',
        targetLevel: 4,
        currentLevel: 2,
        gapSeverity: 'MEDIUM',
        impactOnTargetRole: 'Needed for automated multi-cloud provisioning.',
        recommendedAction: 'Build AWS modular Terraform blueprints with state lock.',
        learningTimeEstWeeks: 2,
        resources: [
          {
            title: 'Terraform Associate Certification Blueprint',
            type: 'Course',
            provider: 'HashiCorp Academy',
            duration: '10 hours'
          }
        ]
      }
    ],
    projects: [],
    certifications: [],
    achievements: [],
    roadmap: [],
    applications: []
  },
  {
    id: 'stud-3',
    name: 'Sneha Patel',
    email: 'sneha.patel@eee.demo.com',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    branch: 'EEE',
    year: 3,
    college: 'National Institute of Technology, Trichy',
    cgpa: 8.78,
    careerGoal: 'EV Powertrain & BMS Engineer',
    bio: 'EEE student specializing in Power Electronics, Battery Management Systems (BMS), MATLAB Simulink, and Motor Inverters.',
    phone: '+91 97222 33445',
    readinessScore: 82,
    fraudRiskFlag: false,
    verifiedSkills: [
      {
        id: 'vs-e1',
        name: 'MATLAB / Simulink',
        category: 'Power Systems Modeling',
        branch: 'EEE',
        selfDeclaredLevel: 4,
        verifiedLevel: 4,
        status: 'VERIFIED',
        confidence: 'HIGH',
        assessmentScore: 91,
        projectEvidence: {
          projectName: 'PMSM Motor Field-Oriented Control (FOC) Model',
          description: 'Simulated 3-phase inverter SVPWM switching for 10kW traction motor.',
          verified: true
        },
        practicalTaskScore: 93,
        explanationScore: 90,
        consistencyScore: 92,
        lastVerifiedDate: '2026-02-12'
      },
      {
        id: 'vs-e2',
        name: 'Battery Management Systems (BMS)',
        category: 'Energy Storage & EV',
        branch: 'EEE',
        selfDeclaredLevel: 4,
        verifiedLevel: 4,
        status: 'VERIFIED',
        confidence: 'HIGH',
        assessmentScore: 87,
        projectEvidence: {
          projectName: 'Active Cell Balancing Circuit for Li-Ion Pack',
          description: 'Hardware prototype using LTC6811 multi-cell battery monitor IC.',
          verified: true
        },
        practicalTaskScore: 89,
        explanationScore: 86,
        consistencyScore: 88,
        lastVerifiedDate: '2026-01-30'
      }
    ],
    skillGaps: [
      {
        id: 'sg-e1',
        skillName: 'CANopen & UDS Automotive Diagnostics',
        branch: 'EEE',
        category: 'Automotive Communication',
        targetLevel: 4,
        currentLevel: 1,
        gapSeverity: 'HIGH',
        impactOnTargetRole: 'Essential for EV charger and battery communication protocols (CCS2/ISO15118).',
        recommendedAction: 'Practical analysis of CANopen object dictionary and diagnostic request frames.',
        learningTimeEstWeeks: 3,
        resources: []
      }
    ],
    projects: [],
    certifications: [],
    achievements: [],
    roadmap: [],
    applications: []
  },
  {
    id: 'stud-4',
    name: 'Vikramaditya Verma',
    email: 'vikram.verma@mech.demo.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    branch: 'Mechanical',
    year: 4,
    college: 'National Institute of Technology, Trichy',
    cgpa: 8.65,
    careerGoal: 'Robotics & Mechatronics CAD Engineer',
    bio: 'Mechanical engineering enthusiast building 6-DOF robotic arms, SolidWorks/Fusion 360 models, and ANSYS FEA structural simulations.',
    phone: '+91 96333 44556',
    readinessScore: 80,
    fraudRiskFlag: false,
    verifiedSkills: [
      {
        id: 'vs-m1',
        name: 'SolidWorks 3D CAD & GD&T',
        category: 'Mechanical Design',
        branch: 'Mechanical',
        selfDeclaredLevel: 5,
        verifiedLevel: 5,
        status: 'VERIFIED',
        confidence: 'HIGH',
        assessmentScore: 94,
        projectEvidence: {
          projectName: 'Lightweight Planetary Gearbox for Cobot Joint',
          description: 'Parametric CAD model with ASME Y14.5 geometric tolerance drawings.',
          verified: true
        },
        practicalTaskScore: 96,
        explanationScore: 92,
        consistencyScore: 95,
        lastVerifiedDate: '2026-01-18'
      },
      {
        id: 'vs-m2',
        name: 'ANSYS FEA & Topology Optimization',
        category: 'Simulation & CAE',
        branch: 'Mechanical',
        selfDeclaredLevel: 4,
        verifiedLevel: 3,
        status: 'VERIFIED',
        confidence: 'MEDIUM',
        assessmentScore: 80,
        projectEvidence: {
          projectName: 'Chassis Torsional Rigidity Analysis',
          description: 'Von Mises stress and modal resonance analysis.',
          verified: true
        },
        practicalTaskScore: 82,
        explanationScore: 78,
        consistencyScore: 80,
        lastVerifiedDate: '2025-12-10'
      }
    ],
    skillGaps: [
      {
        id: 'sg-m1',
        skillName: 'ROS 2 (Robot Operating System)',
        branch: 'Mechanical',
        category: 'Robotics Software',
        targetLevel: 4,
        currentLevel: 1,
        gapSeverity: 'HIGH',
        impactOnTargetRole: 'Critical for industrial robotics and autonomous mobile robots (AMR).',
        recommendedAction: 'Build URDF models and implement MoveIt 2 motion planning.',
        learningTimeEstWeeks: 4,
        resources: []
      }
    ],
    projects: [],
    certifications: [],
    achievements: [],
    roadmap: [],
    applications: []
  },
  {
    id: 'stud-5',
    name: 'Kavya Rao',
    email: 'kavya.rao@civil.demo.com',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    branch: 'Civil',
    year: 3,
    college: 'National Institute of Technology, Trichy',
    cgpa: 8.85,
    careerGoal: 'BIM & Structural Design Specialist',
    bio: 'Civil Engineering student passionate about Revit BIM modeling, ETABS structural seismic analysis, and sustainable construction materials.',
    phone: '+91 95444 55667',
    readinessScore: 86,
    fraudRiskFlag: false,
    verifiedSkills: [
      {
        id: 'vs-cv1',
        name: 'Autodesk Revit & BIM Modeling',
        category: 'Civil & Architectural CAD',
        branch: 'Civil',
        selfDeclaredLevel: 4,
        verifiedLevel: 4,
        status: 'VERIFIED',
        confidence: 'HIGH',
        assessmentScore: 92,
        projectEvidence: {
          projectName: '4D BIM Clash Detection for Commercial Complex',
          description: 'Federated architectural, structural, and MEP Revit models in Navisworks.',
          verified: true
        },
        practicalTaskScore: 94,
        explanationScore: 91,
        consistencyScore: 93,
        lastVerifiedDate: '2026-02-08'
      },
      {
        id: 'vs-cv2',
        name: 'ETABS & STAAD.Pro Structural Analysis',
        category: 'Structural Engineering',
        branch: 'Civil',
        selfDeclaredLevel: 4,
        verifiedLevel: 4,
        status: 'VERIFIED',
        confidence: 'HIGH',
        assessmentScore: 89,
        projectEvidence: {
          projectName: 'G+12 High-Rise Seismic Response Spectrum Design (IS 1893:2016)',
          description: 'Earthquake force calculation and shear wall reinforcement design.',
          verified: true
        },
        practicalTaskScore: 90,
        explanationScore: 88,
        consistencyScore: 91,
        lastVerifiedDate: '2026-01-22'
      }
    ],
    skillGaps: [
      {
        id: 'sg-cv1',
        skillName: 'GIS & Drone Photogrammetry (ArcGIS/QGIS)',
        branch: 'Civil',
        category: 'Geospatial Engineering',
        targetLevel: 3,
        currentLevel: 1,
        gapSeverity: 'MEDIUM',
        impactOnTargetRole: 'Essential for smart infrastructure surveying and digital twin generation.',
        recommendedAction: 'Process drone point clouds for topographic contour generation.',
        learningTimeEstWeeks: 2,
        resources: []
      }
    ],
    projects: [],
    certifications: [],
    achievements: [],
    roadmap: [],
    applications: []
  },
  {
    id: 'stud-6',
    name: 'Rahul Nair',
    email: 'rahul.nair@ece.demo.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    branch: 'ECE',
    year: 4,
    college: 'National Institute of Technology, Trichy',
    cgpa: 9.02,
    careerGoal: 'VLSI Design & Physical Verification Engineer',
    bio: 'ECE final year specializing in SystemVerilog, UVM testbenches, Static Timing Analysis (STA), and Cadence Virtuoso.',
    phone: '+91 94555 66778',
    readinessScore: 88,
    fraudRiskFlag: false,
    verifiedSkills: [
      {
        id: 'vs-v1',
        name: 'SystemVerilog & UVM',
        category: 'VLSI & Verification',
        branch: 'ECE',
        selfDeclaredLevel: 4,
        verifiedLevel: 4,
        status: 'VERIFIED',
        confidence: 'HIGH',
        assessmentScore: 93,
        projectEvidence: {
          projectName: 'UVM Testbench for AXI4-Lite Protocol Interconnect',
          description: 'Constrained random stimulus generator and coverage collector.',
          verified: true
        },
        practicalTaskScore: 95,
        explanationScore: 91,
        consistencyScore: 94,
        lastVerifiedDate: '2026-02-15'
      }
    ],
    skillGaps: [],
    projects: [],
    certifications: [],
    achievements: [],
    roadmap: [],
    applications: []
  },
  {
    id: 'stud-7',
    name: 'Priya Sundaram',
    email: 'priya.sundaram@cse.demo.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    branch: 'CSE',
    year: 3,
    college: 'National Institute of Technology, Trichy',
    cgpa: 8.95,
    careerGoal: 'Cybersecurity & Threat Intelligence Specialist',
    bio: 'CSE student passionate about network protocol security, SIEM analysis, cryptography, and penetration testing.',
    phone: '+91 93666 77889',
    readinessScore: 85,
    fraudRiskFlag: false,
    verifiedSkills: [
      {
        id: 'vs-s1',
        name: 'Network Security & Wireshark',
        category: 'Cybersecurity',
        branch: 'CSE',
        selfDeclaredLevel: 4,
        verifiedLevel: 4,
        status: 'VERIFIED',
        confidence: 'HIGH',
        assessmentScore: 91,
        projectEvidence: {
          projectName: 'Automated Intrusion Detection with Snort Rules',
          description: 'Real-time PCAP packet analyzer with TLS fingerprinting.',
          verified: true
        },
        practicalTaskScore: 92,
        explanationScore: 90,
        consistencyScore: 92,
        lastVerifiedDate: '2026-02-01'
      }
    ],
    skillGaps: [],
    projects: [],
    certifications: [],
    achievements: [],
    roadmap: [],
    applications: []
  },
  {
    id: 'stud-8',
    name: 'Devendra Singh',
    email: 'devendra.singh@mech.demo.com',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    branch: 'Mechanical',
    year: 3,
    college: 'National Institute of Technology, Trichy',
    cgpa: 8.42,
    careerGoal: 'Smart Manufacturing & CNC Automation Engineer',
    bio: 'Mechanical student focused on Industry 4.0, PLC Siemens ladder logic, CNC G-code optimization, and digital shop-floor analytics.',
    phone: '+91 92777 88990',
    readinessScore: 79,
    fraudRiskFlag: false,
    verifiedSkills: [
      {
        id: 'vs-sm1',
        name: 'PLC Programming (Siemens TIA Portal)',
        category: 'Industrial Automation',
        branch: 'Mechanical',
        selfDeclaredLevel: 4,
        verifiedLevel: 3,
        status: 'VERIFIED',
        confidence: 'MEDIUM',
        assessmentScore: 81,
        projectEvidence: {
          projectName: 'Automated Bottling Line SCADA & Ladder Logic',
          description: 'Implemented pneumatic conveyor sequencing with safety E-stop interlocking.',
          verified: true
        },
        practicalTaskScore: 83,
        explanationScore: 79,
        consistencyScore: 82,
        lastVerifiedDate: '2026-01-14'
      }
    ],
    skillGaps: [],
    projects: [],
    certifications: [],
    achievements: [],
    roadmap: [],
    applications: []
  }
];

export const DEMO_JOBS: JobOpening[] = [
  {
    id: 'job-1',
    companyId: 'comp-1',
    companyName: 'Bosch Engineering & Mobility Solutions',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    role: 'Embedded IoT Firmware Intern',
    discipline: ['ECE', 'EEE'],
    type: 'Internship',
    location: 'Bengaluru, Karnataka (Hybrid)',
    mode: 'Hybrid',
    duration: '6 Months',
    stipend: '₹45,000 / month',
    postedDate: '2026-02-10',
    deadline: '2026-03-31',
    openings: 8,
    applicantsCount: 42,
    shortlistedCount: 6,
    description: 'Join our Connected Vehicle & Edge Compute group building robust low-latency automotive firmware for next-generation telematics control units (TCUs) and sensor gateways.',
    responsibilities: [
      'Write bare-metal and RTOS-based Embedded C drivers for ARM Cortex-M microcontrollers.',
      'Implement CAN bus 2.0B / CAN-FD frame parsing and diagnostics over OBD-II.',
      'Integrate low-power Bluetooth (BLE) and LTE-M telemetry payloads using MQTT/JSON.',
      'Participate in hardware-in-the-loop (HIL) lab testing and oscilloscope debugging.'
    ],
    requiredSkills: [
      { name: 'Embedded C', minLevel: 4, weight: 30, isMustHave: true },
      { name: 'Microcontrollers (ARM Cortex-M & AVR)', minLevel: 4, weight: 25, isMustHave: true },
      { name: 'RTOS (FreeRTOS)', minLevel: 3, weight: 20, isMustHave: true },
      { name: 'Arduino & Sensor Interfacing', minLevel: 3, weight: 15, isMustHave: false },
      { name: 'PCB Design & KiCad', minLevel: 2, weight: 10, isMustHave: false }
    ],
    status: 'Active'
  },
  {
    id: 'job-2',
    companyId: 'comp-2',
    companyName: 'Ather Energy',
    companyLogo: 'https://images.unsplash.com/photo-1558441719-5a1e2f385c7a?w=100&auto=format&fit=crop&q=80',
    role: 'EV Powertrain Firmware & BMS Trainee',
    discipline: ['ECE', 'EEE'],
    type: 'Internship',
    location: 'Bengaluru / Hosur',
    mode: 'On-site',
    duration: '6 Months',
    stipend: '₹40,000 / month',
    postedDate: '2026-02-12',
    deadline: '2026-04-05',
    openings: 5,
    applicantsCount: 38,
    shortlistedCount: 4,
    description: 'Work on smart electric scooter battery management algorithms, thermal mitigation routines, and real-time state-of-charge (SOC) telemetry.',
    responsibilities: [
      'Develop embedded C code for battery voltage and temperature cell balancing.',
      'Conduct hardware bench tests on regenerative braking and inverter motor control.',
      'Collaborate with hardware verification engineers to validate ISO 26262 safety standards.'
    ],
    requiredSkills: [
      { name: 'Embedded C', minLevel: 4, weight: 30, isMustHave: true },
      { name: 'Battery Management Systems (BMS)', minLevel: 3, weight: 30, isMustHave: true },
      { name: 'MATLAB / Simulink', minLevel: 3, weight: 25, isMustHave: false },
      { name: 'Microcontrollers (ARM Cortex-M & AVR)', minLevel: 3, weight: 15, isMustHave: false }
    ],
    status: 'Active'
  },
  {
    id: 'job-3',
    companyId: 'comp-3',
    companyName: 'Qualcomm India',
    companyLogo: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=100&auto=format&fit=crop&q=80',
    role: 'VLSI Logic Verification Engineer (RTL/UVM)',
    discipline: ['ECE'],
    type: 'Full-Time',
    location: 'Hyderabad, Telangana',
    mode: 'On-site',
    duration: 'Full-Time',
    stipend: '₹18.5 LPA',
    postedDate: '2026-02-05',
    deadline: '2026-03-25',
    openings: 6,
    applicantsCount: 56,
    shortlistedCount: 8,
    description: 'Design and execute coverage-driven verification testbenches for Snapdragon edge AI compute engines and high-speed memory interfaces.',
    responsibilities: [
      'Write SystemVerilog assertions and UVM sequences.',
      'Analyze code coverage and functional coverage metrics.',
      'Debug RTL simulation failures on Synopsys VCS.'
    ],
    requiredSkills: [
      { name: 'SystemVerilog & UVM', minLevel: 4, weight: 40, isMustHave: true },
      { name: 'Digital Electronics & Verilog', minLevel: 4, weight: 35, isMustHave: true },
      { name: 'C Programming', minLevel: 3, weight: 25, isMustHave: false }
    ],
    status: 'Active'
  },
  {
    id: 'job-4',
    companyId: 'comp-4',
    companyName: 'Larsen & Toubro (L&T Construction)',
    companyLogo: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?w=100&auto=format&fit=crop&q=80',
    role: 'BIM & Structural Digital Twin Specialist',
    discipline: ['Civil'],
    type: 'Internship',
    location: 'Chennai / Mumbai',
    mode: 'On-site',
    duration: '6 Months',
    stipend: '₹35,000 / month',
    postedDate: '2026-02-01',
    deadline: '2026-03-28',
    openings: 4,
    applicantsCount: 29,
    shortlistedCount: 5,
    description: 'Join L&T Heavy Civil Infrastructure IC building 4D/5D BIM models for metro rail transit, airport terminals, and mega bridge spans.',
    responsibilities: [
      'Develop coordinated 3D structural and architectural BIM models in Autodesk Revit.',
      'Conduct automated clash detection and quantify bill-of-materials in Navisworks.',
      'Perform seismic code compliance checks using ETABS.'
    ],
    requiredSkills: [
      { name: 'Autodesk Revit & BIM Modeling', minLevel: 4, weight: 45, isMustHave: true },
      { name: 'ETABS & STAAD.Pro Structural Analysis', minLevel: 3, weight: 35, isMustHave: true },
      { name: 'GIS & Drone Photogrammetry (ArcGIS/QGIS)', minLevel: 2, weight: 20, isMustHave: false }
    ],
    status: 'Active'
  },
  {
    id: 'job-5',
    companyId: 'comp-5',
    companyName: 'Microsoft Cloud & AI',
    companyLogo: 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?w=100&auto=format&fit=crop&q=80',
    role: 'Cloud Infrastructure & Distributed Systems Engineer',
    discipline: ['CSE', 'ECE'],
    type: 'Full-Time',
    location: 'Hyderabad / Noida',
    mode: 'Hybrid',
    duration: 'Full-Time',
    stipend: '₹24.0 LPA',
    postedDate: '2026-02-14',
    deadline: '2026-04-15',
    openings: 12,
    applicantsCount: 110,
    shortlistedCount: 15,
    description: 'Build hyperscale Azure telemetry backends, microservice orchestrators, and AI inference pipelines.',
    responsibilities: [
      'Design REST & gRPC distributed services in Python, Go, and C#.',
      'Manage container deployments with Kubernetes and CI/CD automated test gates.',
      'Optimize database queries for multi-region active-active clusters.'
    ],
    requiredSkills: [
      { name: 'Python & FastAPI', minLevel: 4, weight: 35, isMustHave: true },
      { name: 'Docker & Kubernetes', minLevel: 4, weight: 35, isMustHave: true },
      { name: 'Distributed Systems & SQL/NoSQL', minLevel: 3, weight: 30, isMustHave: true }
    ],
    status: 'Active'
  },
  {
    id: 'job-6',
    companyId: 'comp-6',
    companyName: 'Tata Motors EV & Robotics',
    companyLogo: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=100&auto=format&fit=crop&q=80',
    role: 'Robotics Mechanical Design Engineer',
    discipline: ['Mechanical', 'EEE'],
    type: 'Internship',
    location: 'Pune, Maharashtra',
    mode: 'On-site',
    duration: '6 Months',
    stipend: '₹38,000 / month',
    postedDate: '2026-02-08',
    deadline: '2026-03-30',
    openings: 5,
    applicantsCount: 34,
    shortlistedCount: 6,
    description: 'Design industrial robotic end-effectors, AGV battery swapping modules, and automated body-in-white manufacturing fixtures.',
    responsibilities: [
      '3D modeling and GD&T drafting of precision linkages in SolidWorks.',
      'Stress and fatigue FEA simulations using ANSYS Workbench.',
      'Collaborate with PLC automation team to program robotic cycle times.'
    ],
    requiredSkills: [
      { name: 'SolidWorks 3D CAD & GD&T', minLevel: 4, weight: 40, isMustHave: true },
      { name: 'ANSYS FEA & Topology Optimization', minLevel: 3, weight: 35, isMustHave: true },
      { name: 'PLC Programming (Siemens TIA Portal)', minLevel: 2, weight: 25, isMustHave: false }
    ],
    status: 'Active'
  }
];

export const DEMO_ASSESSMENTS: Assessment[] = [
  {
    id: 'assess-1',
    title: 'Embedded Systems & FreeRTOS Real-Time Kernel',
    branch: 'ECE',
    skillName: 'RTOS (FreeRTOS)',
    difficulty: 'Intermediate',
    durationMinutes: 20,
    totalQuestions: 4,
    passingScore: 75,
    attemptsCount: 142,
    avgScore: 68,
    description: 'Evaluates practical knowledge of priority inversion, mutex ownership, timer ISR context switches, and queue overflow mitigation.',
    questions: [
      {
        id: 'q1',
        question: 'What occurs when a higher-priority Task A is preempted while waiting for a shared mutex held by a lower-priority Task C, while an intermediate Task B executes continuously?',
        options: [
          'Deadlock condition requiring watchdog reset',
          'Priority Inversion, resolved via Priority Inheritance mechanism',
          'Stack Overflow in Task C',
          'Automatic promotion of Task B to Highest Priority'
        ],
        correctIndex: 1,
        explanation: 'Priority Inversion occurs when Task B starves Task A because Task C holds the mutex. FreeRTOS mutexes implement Priority Inheritance where Task C temporarily inherits Task A\'s high priority.',
        conceptTag: 'Synchronization & Mutexes',
        difficulty: 'Medium'
      },
      {
        id: 'q2',
        isCode: true,
        codeSnippet: `// Inside an Interrupt Service Routine (ISR)
void UART_RX_IRQHandler(void) {
    BaseType_t xHigherPriorityTaskWoken = pdFALSE;
    uint8_t byte = UART->DR;
    xQueueSendFromISR(xRxQueue, &byte, &xHigherPriorityTaskWoken);
    portYIELD_FROM_ISR(xHigherPriorityTaskWoken);
}`,
        question: 'Why is portYIELD_FROM_ISR() invoked at the end of the UART ISR?',
        options: [
          'To clear the hardware interrupt flag in NVIC',
          'To ensure an immediate context switch occurs if the unblocked receiving task has a higher priority than the interrupted task',
          'To prevent memory leak in FreeRTOS heap memory',
          'To disable nested interrupts globally'
        ],
        correctIndex: 1,
        explanation: 'portYIELD_FROM_ISR requests a context switch so that when the ISR exits, the CPU immediately resumes the newly awakened higher priority task rather than the lower priority interrupted task.',
        conceptTag: 'Interrupt Handling',
        difficulty: 'Hard'
      },
      {
        id: 'q3',
        question: 'Which FreeRTOS API must be used to delay a task by a fixed period independent of execution time jitter?',
        options: [
          'vTaskDelay(pdMS_TO_TICKS(100))',
          'vTaskDelayUntil(&xLastWakeTime, xFrequency)',
          'sleep(100)',
          'vTaskSuspend(NULL)'
        ],
        correctIndex: 1,
        explanation: 'vTaskDelayUntil tracks the previous unblock time to enforce constant periodicity, whereas vTaskDelay adds delay relative to the moment the API is called.',
        conceptTag: 'Deterministic Timing',
        difficulty: 'Medium'
      },
      {
        id: 'q4',
        question: 'In bare-metal C on ARM Cortex-M, why must memory-mapped peripheral register pointers be declared with the \'volatile\' qualifier?',
        options: [
          'To place the variable in Flash ROM rather than SRAM',
          'To instruct the C compiler not to optimize away repeated reads/writes to hardware register addresses',
          'To automatically enable DMA transfers',
          'To make the variable thread-safe without locks'
        ],
        correctIndex: 1,
        explanation: 'The volatile keyword tells the compiler that the value may change outside the program flow (by hardware) and prevents compiler optimizations from caching the value in CPU registers.',
        conceptTag: 'Embedded C Fundamentals',
        difficulty: 'Easy'
      }
    ],
    practicalTask: {
      id: 'pt-1',
      title: 'Practical Verification: Circular Ring Buffer with Atomic Head/Tail Indices',
      instructions: 'Review the ring buffer implementation below. Identify the concurrency hazard when writing from ISR while reading in main task, and provide the fix.',
      starterCodeOrPrompt: `typedef struct {
    uint8_t buffer[64];
    volatile uint8_t head;
    volatile uint8_t tail;
} RingBuffer_t;

bool RingBuffer_Put(RingBuffer_t* rb, uint8_t data) {
    uint8_t next = (rb->head + 1) % 64;
    if (next == rb->tail) return false; // Full
    rb->buffer[rb->head] = data;
    rb->head = next;
    return true;
}`,
      expectedOutputCriteria: [
        'Explains single-producer single-consumer atomicity',
        'Recognizes memory barrier / interrupt masking needed if multi-producer',
        'Validates buffer wrap-around logic'
      ],
      explanationPrompt: 'Explain in 2-3 sentences why single-producer single-consumer ring buffers can operate lock-free without mutexes on single-core ARM Cortex-M.',
      modificationTask: 'Modify the function to take a 16-bit payload and provide atomic check on 32-bit aligned boundaries.'
    }
  },
  {
    id: 'assess-2',
    title: 'Cloud Distributed Systems & Kubernetes Microservices',
    branch: 'CSE',
    skillName: 'Docker & Kubernetes',
    difficulty: 'Intermediate',
    durationMinutes: 15,
    totalQuestions: 3,
    passingScore: 75,
    attemptsCount: 210,
    avgScore: 72,
    description: 'Evaluates containerization, Kubernetes pod lifecycle, liveness vs readiness probes, and ingress routing.',
    questions: [
      {
        id: 'cq1',
        question: 'What is the primary operational difference between a Kubernetes Liveness Probe and a Readiness Probe?',
        options: [
          'Liveness probe routes network traffic; Readiness probe reboots the node',
          'Liveness probe restarts an unresponsive container; Readiness probe removes the container from service load balancer until healthy',
          'Liveness probe runs only on startup; Readiness probe runs continuously',
          'There is no functional difference'
        ],
        correctIndex: 1,
        explanation: 'Liveness probes restart crashed/deadlocked containers, while readiness probes prevent traffic from reaching pods that are still warming up or temporarily overloaded.',
        conceptTag: 'Kubernetes Pod Lifecycle',
        difficulty: 'Medium'
      },
      {
        id: 'cq2',
        question: 'In Docker multi-stage builds, why is copying binary artifacts from a builder container into a minimal alpine/scratch image considered best practice?',
        options: [
          'It increases compilation speed by 500%',
          'It drastically reduces final container image size and minimizes attack surface by removing compiler toolchains and headers',
          'It allows containers to run without root privileges automatically',
          'It is strictly required by OCI container standards'
        ],
        correctIndex: 1,
        explanation: 'Multi-stage builds allow compiling in a heavy environment while shipping only runtime binaries in a tiny secure image.',
        conceptTag: 'Docker Security & Optimization',
        difficulty: 'Easy'
      },
      {
        id: 'cq3',
        question: 'How does a Distributed Key-Value store ensure consistency during network partition according to the CAP Theorem?',
        options: [
          'By providing 100% Availability and 100% Consistency simultaneously',
          'By choosing CP (rejecting write requests if quorum consensus cannot be confirmed) or AP (accepting writes with potential stale reads)',
          'By disabling TCP/IP acknowledgements',
          'By using single-node SQLite databases'
        ],
        correctIndex: 1,
        explanation: 'Under CAP theorem, during network partitions (P), distributed systems must tradeoff between Consistency (C) and Availability (A).',
        conceptTag: 'Distributed Systems Theory',
        difficulty: 'Hard'
      }
    ],
    practicalTask: {
      id: 'pt-2',
      title: 'Practical Verification: Kubernetes Deployment Manifest with Rolling Update & HPA',
      instructions: 'Write a declarative Kubernetes deployment YAML snippet featuring rollingUpdate strategy and CPU utilization threshold.',
      starterCodeOrPrompt: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: telemetry-api-deployment
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0`,
      expectedOutputCriteria: [
        'Includes resources requests/limits',
        'Defines liveness & readiness probes',
        'Labels match selector requirements'
      ],
      explanationPrompt: 'Explain how maxSurge: 1 and maxUnavailable: 0 guarantees zero dropped requests during new version rollouts.',
      modificationTask: 'Add HorizontalPodAutoscaler configuration targeting 75% average CPU utilization.'
    }
  }
];

export const DEMO_COLLABORATIONS: CollaborationOffer[] = [
  {
    id: 'collab-1',
    companyId: 'comp-1',
    companyName: 'Bosch Engineering & Mobility Solutions',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    title: 'Automotive Embedded Systems & CAN-FD Industry Hackathon & Lab Kit Sponsorship',
    type: 'Live Project',
    branch: ['ECE', 'EEE', 'Mechanical'],
    duration: '8 Weeks',
    mode: 'Hybrid',
    targetAudience: 'Pre-final & Final Year ECE/EEE students & Embedded Faculty',
    description: 'Bosch Mobility engineers provide 20 STM32 automotive development kits, live CAN-bus challenge data, and weekly mentorship reviews for student teams.',
    deliverables: [
      '20x STM32 & CAN-FD hardware development kits sponsored to college embedded lab',
      'Joint certification with Bosch Engineering',
      'Direct interview fast-track for top 15 performers',
      'Faculty development workshop on Automotive Ethernet'
    ],
    industryLeads: 'Dr. Vikramaditya Sen, Chief Architect - Automotive Telematics, Bosch',
    availableSlots: 3,
    requestedInstitutions: [
      {
        institutionName: 'National Institute of Technology, Trichy',
        contactFaculty: 'Dr. K. S. Ramanathan (HOD - ECE)',
        dateRequested: '2026-02-15',
        status: 'Scheduled'
      }
    ],
    status: 'Open'
  },
  {
    id: 'collab-2',
    companyId: 'comp-2',
    companyName: 'Ather Energy',
    companyLogo: 'https://images.unsplash.com/photo-1558441719-5a1e2f385c7a?w=100&auto=format&fit=crop&q=80',
    title: 'EV Battery Management Systems (BMS) & Thermal Simulation Masterclass',
    type: 'Workshop',
    branch: ['EEE', 'Mechanical', 'ECE'],
    duration: '3 Days Intensive (24 Hours)',
    mode: 'In-Campus',
    targetAudience: 'EEE & Mechanical students working on Formula Student or EV Capstones',
    description: 'Hands-on training by Ather battery pack designers covering cell chemistry, thermal runaway modeling, active balancing topologies, and BMS firmware.',
    deliverables: [
      'Comprehensive BMS simulation toolkits in MATLAB/Simulink',
      'Live teardown session of 3.7kWh Li-Ion NMC battery module',
      'Internship shortlisting test conducted on last day'
    ],
    industryLeads: 'Rupal Goswami, Lead BMS Engineer, Ather Energy',
    availableSlots: 5,
    requestedInstitutions: [
      {
        institutionName: 'National Institute of Technology, Trichy',
        contactFaculty: 'Prof. Anitha Murali (Dept of EEE)',
        dateRequested: '2026-02-18',
        status: 'Approved'
      }
    ],
    status: 'Open'
  },
  {
    id: 'collab-3',
    companyId: 'comp-3',
    companyName: 'Qualcomm India',
    companyLogo: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=100&auto=format&fit=crop&q=80',
    title: 'Semiconductor VLSI & SystemVerilog/UVM Faculty Enablement Program',
    type: 'Faculty Development',
    branch: ['ECE'],
    duration: '2 Weeks (Virtual)',
    mode: 'Virtual',
    targetAudience: 'ECE Faculty teaching Digital IC Design, VLSI, and Computer Architecture',
    description: 'Empower academia to update curriculum to match 3nm/2nm ASIC design verification industry standards.',
    deliverables: [
      'Access to cloud EDA tool licenses for academic lab computers',
      'Standardized UVM testbench curriculum modules',
      'AICTE-recognized faculty development certificate'
    ],
    industryLeads: 'Srinivas Murthy, Senior Director of Silicon Engineering, Qualcomm',
    availableSlots: 10,
    requestedInstitutions: [],
    status: 'Open'
  },
  {
    id: 'collab-4',
    companyId: 'comp-4',
    companyName: 'Larsen & Toubro (L&T)',
    companyLogo: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?w=100&auto=format&fit=crop&q=80',
    title: 'Smart Infrastructure 4D BIM & Digital Twin Co-op Fellowship',
    type: 'Live Project',
    branch: ['Civil'],
    duration: '12 Weeks',
    mode: 'Hybrid',
    targetAudience: 'Civil Engineering Students (3rd & 4th Year)',
    description: 'Students solve live construction scheduling clashes on active metro corridor infrastructure projects under L&T Chief Engineers.',
    deliverables: [
      'Project stipends of ₹20,000/month per student team',
      'Direct PPO consideration for top 5 teams',
      'Real-world BIM clash data access'
    ],
    industryLeads: 'Rajeshwari Iyer, Head of Digital Construction, L&T',
    availableSlots: 2,
    requestedInstitutions: [],
    status: 'Open'
  }
];

export const DEMO_INSTITUTION_ANALYTICS: InstitutionAnalytics = {
  totalStudents: 1480,
  verifiedProfilesCount: 1145,
  activeIndustryPartners: 48,
  totalInternshipOffers: 312,
  avgReadinessScore: 82.4,
  branchSkillDemand: [
    {
      branch: 'ECE',
      skills: [
        { name: 'Embedded C & RTOS', demandPercentage: 88, growthRate: '+24% YoY' },
        { name: 'VLSI & SystemVerilog', demandPercentage: 79, growthRate: '+19% YoY' },
        { name: 'IoT Telemetry & Protocols', demandPercentage: 74, growthRate: '+15% YoY' },
        { name: 'PCB Layout & Signal Integrity', demandPercentage: 62, growthRate: '+11% YoY' }
      ]
    },
    {
      branch: 'CSE',
      skills: [
        { name: 'Cloud Native & Kubernetes', demandPercentage: 92, growthRate: '+31% YoY' },
        { name: 'AI/ML & LLM Orchestration', demandPercentage: 89, growthRate: '+42% YoY' },
        { name: 'Cybersecurity & Threat Detection', demandPercentage: 81, growthRate: '+27% YoY' },
        { name: 'Full-Stack Distributed Systems', demandPercentage: 78, growthRate: '+14% YoY' }
      ]
    },
    {
      branch: 'EEE',
      skills: [
        { name: 'EV Powertrain & BMS', demandPercentage: 86, growthRate: '+38% YoY' },
        { name: 'MATLAB / Simulink Motor Control', demandPercentage: 80, growthRate: '+21% YoY' },
        { name: 'Power Electronics & Inverters', demandPercentage: 75, growthRate: '+18% YoY' },
        { name: 'Renewable Smart Grid Systems', demandPercentage: 68, growthRate: '+16% YoY' }
      ]
    },
    {
      branch: 'Mechanical',
      skills: [
        { name: 'SolidWorks CAD & GD&T', demandPercentage: 84, growthRate: '+12% YoY' },
        { name: 'Robotics & ROS 2 Simulation', demandPercentage: 76, growthRate: '+35% YoY' },
        { name: 'ANSYS FEA & CFD Analysis', demandPercentage: 72, growthRate: '+15% YoY' },
        { name: 'Smart Manufacturing & PLC', demandPercentage: 65, growthRate: '+22% YoY' }
      ]
    },
    {
      branch: 'Civil',
      skills: [
        { name: 'Autodesk Revit & 4D BIM', demandPercentage: 85, growthRate: '+28% YoY' },
        { name: 'ETABS Structural Seismic Design', demandPercentage: 79, growthRate: '+16% YoY' },
        { name: 'GIS & Drone Photogrammetry', demandPercentage: 71, growthRate: '+33% YoY' },
        { name: 'Green Building / LEED Energy Analysis', demandPercentage: 60, growthRate: '+19% YoY' }
      ]
    }
  ],
  branchSkillGaps: [
    {
      branch: 'ECE',
      gaps: [
        { skillName: 'RTOS (FreeRTOS / Zephyr)', gapSeverity: 'HIGH', studentsWithGapPercent: 38, industryUrgency: 'Critical: Required in 84% of campus core hires' },
        { skillName: 'Embedded Linux & Device Drivers', gapSeverity: 'HIGH', studentsWithGapPercent: 44, industryUrgency: 'High: Tier-1 automotive firms require kernel fundamentals' },
        { skillName: 'High-Speed PCB Design', gapSeverity: 'MEDIUM', studentsWithGapPercent: 29, industryUrgency: 'Moderate: Hardware prototyping gap' }
      ]
    },
    {
      branch: 'CSE',
      gaps: [
        { skillName: 'Kubernetes & Helm Infrastructure', gapSeverity: 'HIGH', studentsWithGapPercent: 41, industryUrgency: 'Critical: Cloud DevOps gap' },
        { skillName: 'Production LLM Guardrails & RAG', gapSeverity: 'HIGH', studentsWithGapPercent: 36, industryUrgency: 'High: AI engineering shift' },
        { skillName: 'Network Packet Analysis & SIEM', gapSeverity: 'MEDIUM', studentsWithGapPercent: 26, industryUrgency: 'Moderate: Security operations' }
      ]
    },
    {
      branch: 'EEE',
      gaps: [
        { skillName: 'Automotive CANopen & UDS Protocol', gapSeverity: 'HIGH', studentsWithGapPercent: 46, industryUrgency: 'High: EV OEM requirement' },
        { skillName: 'Hardware-in-the-Loop (HIL) Testing', gapSeverity: 'HIGH', studentsWithGapPercent: 39, industryUrgency: 'High: Validation testing' }
      ]
    },
    {
      branch: 'Mechanical',
      gaps: [
        { skillName: 'ROS 2 & Robot Kinematics', gapSeverity: 'HIGH', studentsWithGapPercent: 52, industryUrgency: 'Critical: Robotics gap in core curriculum' },
        { skillName: 'Topology Optimization & Additive Design', gapSeverity: 'MEDIUM', studentsWithGapPercent: 31, industryUrgency: 'Moderate' }
      ]
    },
    {
      branch: 'Civil',
      gaps: [
        { skillName: 'Navisworks 4D Clash Automation', gapSeverity: 'HIGH', studentsWithGapPercent: 40, industryUrgency: 'High: L&T / Shapoorji requirement' },
        { skillName: 'Drone Point Cloud Topography', gapSeverity: 'MEDIUM', studentsWithGapPercent: 35, industryUrgency: 'Moderate: Survey digitization' }
      ]
    }
  ],
  departmentReadiness: [
    { department: 'ECE', avgReadiness: 83.2, totalEnrolled: 320, assessmentParticipationRate: 94, internshipPlacementRate: 88 },
    { department: 'CSE', avgReadiness: 87.5, totalEnrolled: 410, assessmentParticipationRate: 97, internshipPlacementRate: 92 },
    { department: 'EEE', avgReadiness: 81.0, totalEnrolled: 260, assessmentParticipationRate: 91, internshipPlacementRate: 84 },
    { department: 'Mechanical', avgReadiness: 79.4, totalEnrolled: 280, assessmentParticipationRate: 88, internshipPlacementRate: 81 },
    { department: 'Civil', avgReadiness: 80.8, totalEnrolled: 210, assessmentParticipationRate: 89, internshipPlacementRate: 83 }
  ],
  placementTrends: [
    { year: '2023', totalPlaced: 245, avgStipend: '₹28,000/mo', coreBranchPercentage: 64 },
    { year: '2024', totalPlaced: 278, avgStipend: '₹34,500/mo', coreBranchPercentage: 72 },
    { year: '2025', totalPlaced: 304, avgStipend: '₹39,200/mo', coreBranchPercentage: 81 },
    { year: '2026 (Projected)', totalPlaced: 335, avgStipend: '₹44,000/mo', coreBranchPercentage: 89 }
  ]
};
