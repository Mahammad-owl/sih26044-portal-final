const db = require('../database/db');

// Predefined Skill Pattern Matcher with aliases and contextual keywords
const SKILL_KEYWORDS = [
  { id: 'skl-emb-c', name: 'Embedded C', patterns: ['embedded c', 'c programming', 'bare-metal c', 'bare metal', 'arm c', 'ansi c', 'c/c++'] },
  { id: 'skl-micro', name: 'Microcontrollers (ARM/STM32/AVR)', patterns: ['stm32', 'arm cortex', 'microcontroller', 'avr', 'atmega', 'esp32', 'pic microcontroller', 'arduino', 'mcu', 'uart', 'spi', 'i2c', 'can bus', 'gpio', 'timers', 'dma'] },
  { id: 'skl-dig-elec', name: 'Digital Electronics', patterns: ['digital electronics', 'fsm', 'combinational logic', 'sequential logic', 'k-map', 'flip-flop', 'boolean algebra', 'timing analysis'] },
  { id: 'skl-rtos', name: 'RTOS (FreeRTOS)', patterns: ['rtos', 'freertos', 'real-time operating system', 'task scheduling', 'semaphores', 'mutex', 'threadx', 'zephyr rtos'] },
  { id: 'skl-emb-linux', name: 'Embedded Linux & Device Drivers', patterns: ['embedded linux', 'yocto', 'kernel driver', 'u-boot', 'device tree', 'busybox', 'v4l2', 'linux kernel'] },
  { id: 'skl-verilog', name: 'Verilog HDL', patterns: ['verilog', 'systemverilog', 'hdl', 'vhdl', 'fpga', 'vivado', 'quartus', 'rtl design', 'testbench'] },
  { id: 'skl-vlsi', name: 'VLSI Design & Physical Verification', patterns: ['vlsi', 'asic', 'cmos', 'static timing analysis', 'sta', 'cadence', 'synopsys', 'drc/lvs', 'magic eda', 'openlane'] },
  { id: 'skl-iot', name: 'IoT Protocols (MQTT/CoAP/BLE)', patterns: ['iot', 'mqtt', 'coap', 'lorawan', 'ble', 'bluetooth low energy', 'zigbee', 'sensor node', 'nodemcu', 'iot edge'] },
  { id: 'skl-pcb', name: 'PCB Design & Altium Designer', patterns: ['pcb design', 'kicad', 'altium', 'eagle pcb', 'schematic capture', 'gerber', 'surface mount', 'smd'] },
  { id: 'skl-python', name: 'Python Programming', patterns: ['python', 'numpy', 'pandas', 'scipy', 'django', 'flask', 'fastapi', 'matplotlib', 'pyspark'] },
  { id: 'skl-ml', name: 'Machine Learning & Deep Learning', patterns: ['machine learning', 'deep learning', 'pytorch', 'tensorflow', 'scikit-learn', 'cnn', 'rnn', 'computer vision', 'opencv', 'nlp'] },
  { id: 'skl-react', name: 'React.js & Frontend Engineering', patterns: ['react', 'react.js', 'reactjs', 'redux', 'tailwind', 'javascript', 'typescript', 'next.js', 'html5', 'css3'] },
  { id: 'skl-sql', name: 'SQL & Database Architecture', patterns: ['sql', 'postgresql', 'mysql', 'sqlite', 'oracle db', 'rdbms', 'database query', 'acid'] },
  { id: 'skl-cloud', name: 'Cloud Computing & AWS', patterns: ['aws', 'cloud computing', 'ec2', 's3', 'docker', 'kubernetes', 'azure', 'gcp', 'serverless', 'ci/cd'] },
  { id: 'skl-cyber', name: 'Cybersecurity & Threat Analysis', patterns: ['cybersecurity', 'penetration testing', 'wireshark', 'kali linux', 'owasp', 'soc', 'firewall', 'cryptography'] },
  { id: 'skl-power', name: 'Power Systems Analysis', patterns: ['power systems', 'load flow', 'transmission line', 'substation', 'etap', 'power grid', 'fault analysis'] },
  { id: 'skl-control', name: 'Control Systems Engineering', patterns: ['control systems', 'matlab', 'simulink', 'pid controller', 'bode plot', 'root locus', 'state-space'] },
  { id: 'skl-machines', name: 'Electrical Machines & Drives', patterns: ['electrical machines', 'induction motor', 'bldc', 'motor drive', 'inverter', 'pwm drive', 'transformer'] },
  { id: 'skl-smartgrid', name: 'Smart Grid & SCADA Integration', patterns: ['smart grid', 'scada', 'microgrid', 'iec 61850', 'renewable integration', 'ami meter'] },
  { id: 'skl-cad', name: 'SolidWorks & CAD Modeling', patterns: ['solidworks', 'cad', 'autocad', 'catia', 'creo', 'parametric modeling', '3d modeling', 'gd&t'] },
  { id: 'skl-robotics', name: 'Robotics & ROS Framework', patterns: ['robotics', 'ros', 'ros2', 'gazebo', 'moveit', 'kinematics', 'manipulator', 'lidar navigation'] },
  { id: 'skl-fea', name: 'Finite Element Analysis (ANSYS)', patterns: ['fea', 'ansys', 'finite element analysis', 'cfd', 'stress analysis', 'thermal simulation'] },
  { id: 'skl-mfg', name: 'CNC & Modern Manufacturing', patterns: ['cnc', 'g-code', 'cam', 'additive manufacturing', '3d printing', 'dfm', 'machining'] },
  { id: 'skl-struct', name: 'Structural Analysis (STAAD.Pro)', patterns: ['staad', 'staad.pro', 'structural analysis', 'rcc design', 'etabs', 'seismic design', 'is 456'] },
  { id: 'skl-autocad-civil', name: 'AutoCAD Civil 3D', patterns: ['autocad civil', 'civil 3d', 'topographical', 'road design', 'land grading'] },
  { id: 'skl-bim', name: 'BIM & Autodesk Revit', patterns: ['bim', 'revit', 'building information modeling', 'navisworks', 'clash detection'] }
];

function extractSkillsFromResume(text) {
  if (!text || typeof text !== 'string') {
    return { detectedSkills: [], summary: 'No text provided', count: 0 };
  }

  const lowerText = text.toLowerCase();
  const detected = [];
  const detectedIds = new Set();

  for (const item of SKILL_KEYWORDS) {
    for (const pattern of item.patterns) {
      const regex = new RegExp(`\\b${pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      const match = lowerText.match(regex);

      if (match && !detectedIds.has(item.id)) {
        detectedIds.add(item.id);

        // Find surrounding snippet context (up to 80 chars before and after)
        const matchIndex = match.index || lowerText.indexOf(pattern);
        const start = Math.max(0, matchIndex - 40);
        const end = Math.min(text.length, matchIndex + pattern.length + 40);
        let snippet = text.slice(start, end).trim();
        if (start > 0) snippet = '...' + snippet;
        if (end < text.length) snippet = snippet + '...';

        // Suggest proficiency based on text keywords (e.g. advanced, lead, 2+ years, basic)
        let suggestedLevel = 3;
        const surrounding = text.slice(Math.max(0, matchIndex - 100), Math.min(text.length, matchIndex + 100)).toLowerCase();
        if (surrounding.includes('expert') || surrounding.includes('lead') || surrounding.includes('architect') || surrounding.includes('advanced')) {
          suggestedLevel = 4;
        } else if (surrounding.includes('beginner') || surrounding.includes('basic') || surrounding.includes('learning')) {
          suggestedLevel = 2;
        }

        // Fetch DB skill details
        const dbSkill = db.prepare('SELECT * FROM skills WHERE id = ?').get(item.id);

        detected.push({
          skillId: item.id,
          skillName: dbSkill ? dbSkill.name : item.name,
          category: dbSkill ? dbSkill.category : 'Technical',
          discipline: dbSkill ? dbSkill.discipline : 'Cross-Discipline',
          matchedKeyword: pattern,
          snippet,
          suggestedLevel,
          confidence: 'AI-assisted Pattern Detection (High Confidence)'
        });
        break; // Stop after matching one pattern for this skill
      }
    }
  }

  return {
    detectedSkills: detected,
    count: detected.length,
    summary: `Extracted ${detected.length} technical skills across ${new Set(detected.map(d => d.discipline)).size} disciplines from resume text.`
  };
}

module.exports = {
  extractSkillsFromResume
};
