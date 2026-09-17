/**
 * ====================================================================
 * ARIFULLAH PORTFOLIO - CENTRALIZED CONFIGURATION
 * ====================================================================
 * All profile data, links, projects, skills, education, and services
 * are managed here for clean maintainability and single-source updates.
 */

const CONFIG = {
  // Personal Info
  personal: {
    name: "Arifullah",
    firstName: "Arif",
    lastName: "Ullah",
    roles: [
      "Software Engineer",
      "Web Developer",
      "App Developer",
      "Full-Stack Developer"
    ],
    title: "Software Engineer | Web & App Developer",
    availabilityBadge: "Available for Opportunities",
    shortBio: "I build modern websites, web applications, software solutions and mobile experiences with a strong focus on clean design, functionality, performance and modern technology.",
    aboutHeading: "About Me",
    aboutText: [
      "I'm Arifullah, a passionate Software Engineer interested in building modern websites, applications and digital experiences.",
      "I enjoy learning new technologies, solving programming problems and turning ideas into functional digital products.",
      "My goal is to continuously improve my technical skills and build high-quality software that provides real value."
    ],
    photoPath: "ChatGPT Image Aug 17, 2026, 04_33_54 AM.png",
    photoFallback: "profile-placeholder.svg",
    location: "Peshawar, Pakistan",
    email: "arifkhankkhan002@gmail.com",
    phone: "0313 8983870",
    phoneRaw: "+923138983870",
    whatsappNumber: "923138983870",
    cvPath: "cv.html",
    cvDownloadPath: "Arifullah_Resume.pdf"
  },

  // Social & External Links (Updated with user's exact handles)
  socials: {
    whatsapp: {
      name: "WhatsApp",
      url: "https://wa.me/923138983870",
      username: "0313 8983870",
      icon: "fab fa-whatsapp",
      color: "#25d366"
    },
    facebook: {
      name: "Facebook",
      url: "https://facebook.com/gemvault098",
      username: "gemvault098",
      icon: "fab fa-facebook-f",
      color: "#1877f2"
    },
    instagram: {
      name: "Instagram",
      url: "https://instagram.com/gemvault098",
      username: "gemvault098",
      icon: "fab fa-instagram",
      color: "#e1306c"
    },
    tiktok: {
      name: "TikTok",
      url: "https://www.tiktok.com/@arifkhan27920",
      username: "@arifkhan27920",
      icon: "fab fa-tiktok",
      color: "#ff0050"
    },
    snapchat: {
      name: "Snapchat",
      url: "https://www.snapchat.com/add/arifkhan.8586",
      username: "arifkhan.8586",
      icon: "fab fa-snapchat",
      color: "#fffc00"
    },
    github: {
      name: "GitHub",
      url: "https://github.com/arifkhan1298",
      username: "arifkhan1298",
      icon: "fab fa-github",
      color: "#ffffff"
    },
    linkedin: {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/arif-khan-088b19401",
      username: "arif-khan-088b19401",
      icon: "fab fa-linkedin-in",
      color: "#0a66c2"
    },
    email: {
      name: "Email",
      url: "mailto:arifkhankkhan002@gmail.com",
      username: "arifkhankkhan002@gmail.com",
      icon: "fas fa-envelope",
      color: "#22d3ee"
    }
  },

  // GitHub API Settings
  github: {
    username: "arifkhan1298",
    apiUrl: "https://api.github.com/users/arifkhan1298/repos?sort=updated&per_page=100",
    profileUrl: "https://github.com/arifkhan1298"
  },

  // Education Details
  education: [
    {
      degree: "Matriculation (Science)",
      institution: "G.H.S.S No. 3 Peshawar",
      period: "Completed",
      status: "Foundation of Mathematics, Computer Science & Core Sciences",
      icon: "fas fa-graduation-cap",
      highlight: true
    },
    {
      degree: "Continuous Higher Education & Technical Training",
      institution: "Ongoing Studies & Self-Directed Software Engineering",
      period: "Present",
      status: "Continuously advancing knowledge in Computer Science, Modern Full-Stack Development, and Systems Architecture.",
      icon: "fas fa-book-reader",
      highlight: false
    }
  ],

  // Languages Spoken
  languages: [
    { name: "Urdu", proficiency: "Fluent / Native", level: 100 },
    { name: "Pashto", proficiency: "Native", level: 100 },
    { name: "English", proficiency: "Professional Working", level: 85 }
  ],

  // Skills Data with Categories
  skills: [
    // Frontend
    { name: "HTML5", category: "frontend", level: 95, icon: "fab fa-html5", color: "#e34f26", desc: "Semantic, accessible, and SEO-friendly structures." },
    { name: "CSS3 / Modern CSS", category: "frontend", level: 90, icon: "fab fa-css3-alt", color: "#264de4", desc: "Responsive layouts, Flexbox, Grid, animations & 3D styling." },
    { name: "JavaScript (ES6+)", category: "frontend", level: 88, icon: "fab fa-js-square", color: "#f7df1e", desc: "Modern DOM manipulation, async programming, APIs & SPAs." },
    { name: "Web Development", category: "frontend", level: 92, icon: "fas fa-globe", color: "#22d3ee", desc: "End-to-end responsive, high-performance website construction." },
    { name: "Frontend Development", category: "frontend", level: 90, icon: "fas fa-laptop-code", color: "#818cf8", desc: "Interactive UI/UX with smooth transitions and components." },

    // Programming & Backend
    { name: "Python", category: "programming", level: 85, icon: "fab fa-python", color: "#3776ab", desc: "Automation, algorithms, scripting, and backend logic." },
    { name: "MySQL", category: "programming", level: 90, icon: "fas fa-database", color: "#00758f", desc: "Relational database modeling, complex SQL queries, table schemas, indexing & high-speed data optimization." },
    { name: "C Language", category: "programming", level: 80, icon: "fas fa-code", color: "#555555", desc: "Core computer science concepts, memory management & logic." },
    { name: "C++", category: "programming", level: 82, icon: "fas fa-microchip", color: "#00599c", desc: "Object-oriented programming, data structures & algorithms." },
    { name: "Full-Stack Development", category: "programming", level: 85, icon: "fas fa-layer-group", color: "#8b5cf6", desc: "Connecting responsive client interfaces with robust data logic." },
    { name: "App Development", category: "programming", level: 80, icon: "fas fa-mobile-alt", color: "#10b981", desc: "Cross-platform mobile interfaces and responsive apps." },

    // Microsoft Office Suite & Data
    { name: "MS Word", category: "office", level: 95, icon: "fas fa-file-word", color: "#2b579a", desc: "Professional documentation, reports, and formatting." },
    { name: "MS Excel", category: "office", level: 90, icon: "fas fa-file-excel", color: "#217346", desc: "Formulas, data analysis, spreadsheets, and reporting." },
    { name: "MS Access", category: "office", level: 85, icon: "fas fa-database", color: "#a4373a", desc: "Relational database design, queries, and management." },
    { name: "MS PowerPoint", category: "office", level: 92, icon: "fas fa-file-powerpoint", color: "#d24726", desc: "Engaging presentations, diagrams, and visual communication." },
    { name: "MS Office Suite", category: "office", level: 92, icon: "fas fa-briefcase", color: "#ea4335", desc: "Comprehensive enterprise office and productivity tools." }
  ],

  // Services Offered
  services: [
    {
      title: "Web Development",
      icon: "fas fa-code",
      desc: "Creating high-speed, modern, responsive websites built with clean code and cutting-edge standards.",
      features: ["Custom Architecture", "Semantic HTML5 / CSS3", "SEO & Speed Optimization"]
    },
    {
      title: "Web Application Development",
      icon: "fas fa-cubes",
      desc: "Engineering dynamic web applications with interactive client-side logic, API integrations, and smooth UX.",
      features: ["Single Page Apps", "REST API Integration", "State Management"]
    },
    {
      title: "Software Development",
      icon: "fas fa-terminal",
      desc: "Building clean, maintainable software solutions using C, C++, and Python with strong algorithmic foundations.",
      features: ["Object-Oriented Design", "Efficient Algorithms", "Problem Solving"]
    },
    {
      title: "App Development",
      icon: "fas fa-mobile-screen-button",
      desc: "Crafting intuitive, responsive mobile and web-based applications that look and perform great on all screen sizes.",
      features: ["Mobile First Design", "Cross-Platform Layouts", "Touch-Optimized UI"]
    },
    {
      title: "Frontend Development",
      icon: "fas fa-palette",
      desc: "Transforming design concepts into interactive, pixel-perfect, and accessible digital user interfaces.",
      features: ["Glassmorphism & 3D Cards", "Micro-Interactions", "Fluid Animations"]
    },
    {
      title: "Database & Office Applications",
      icon: "fas fa-server",
      desc: "Designing organized database systems with MS Access and automating structured business workflows.",
      features: ["MS Access Relational DB", "Excel Data Analytics", "Automated Workflows"]
    }
  ],

  // Development Journey Timeline
  journey: [
    {
      year: "Phase 1",
      title: "Foundations & Core Programming",
      desc: "Mastered fundamental computer science principles, logic building, C, and C++ to understand memory management and algorithms.",
      icon: "fas fa-laptop-code"
    },
    {
      year: "Phase 2",
      title: "Web Technologies & Frontend Mastery",
      desc: "Dove deep into HTML5, modern CSS3, responsive layouts, and modern JavaScript to build interactive browser interfaces.",
      icon: "fas fa-globe"
    },
    {
      year: "Phase 3",
      title: "Python, Scripting & Data Logic",
      desc: "Expanded into Python for backend scripts, data processing, and rapid software application development.",
      icon: "fab fa-python"
    },
    {
      year: "Phase 4",
      title: "Full-Stack & App Development",
      desc: "Connecting frontend designs with backend APIs, database management, and developing multi-device application experiences.",
      icon: "fas fa-layer-group"
    },
    {
      year: "Phase 5",
      title: "Continuous Learning & Modern Innovation",
      desc: "Constantly sharpening software engineering skills, building production-ready repositories, and exploring futuristic web technologies.",
      icon: "fas fa-rocket"
    }
  ],

  // Curated Fallback Projects (All with Live Demos & GitHub Links)
  curatedProjects: [
    {
      id: "proj-1",
      name: "Modern Full-Stack Web Platform",
      category: "web",
      description: "A high-performance modern web application featuring clean modular architecture, dynamic client-side interactions, responsive layouts, and optimized state management.",
      technologies: ["JavaScript", "HTML5", "CSS3", "REST APIs"],
      githubUrl: "https://github.com/arifkhan1298",
      liveUrl: "https://arifkhan1298.github.io/web-platform/",
      stars: 12,
      forks: 4,
      language: "JavaScript",
      updatedAt: "2026",
      featured: true
    },
    {
      id: "proj-2",
      name: "MySQL Relational Database & Analytics Engine",
      category: "programming",
      description: "Enterprise relational database schema design, complex multi-table queries, stored procedures, indexing for ultra-fast query execution, and business reporting.",
      technologies: ["MySQL", "SQL", "Database Design", "Performance"],
      githubUrl: "https://github.com/arifkhan1298",
      liveUrl: "https://arifkhan1298.github.io/mysql-database-system/",
      stars: 8,
      forks: 2,
      language: "SQL",
      updatedAt: "2026",
      featured: true
    },
    {
      id: "proj-3",
      name: "Python Automation & Software Utilities",
      category: "python",
      description: "A suite of Python programs engineered for data parsing, automated workflows, file manipulation, and algorithmic problem-solving with clean structured logic.",
      technologies: ["Python", "Algorithms", "Automation", "Data Parsing"],
      githubUrl: "https://github.com/arifkhan1298",
      liveUrl: "https://arifkhan1298.github.io/python-automation-suite/",
      stars: 15,
      forks: 5,
      language: "Python",
      updatedAt: "2026",
      featured: true
    },
    {
      id: "proj-4",
      name: "C / C++ Data Structures & Systems Logic",
      category: "programming",
      description: "Implementation of advanced data structures, algorithmic search/sort routines, and modular object-oriented software components focused on peak computational efficiency.",
      technologies: ["C++", "C", "Data Structures", "Algorithms", "OOP"],
      githubUrl: "https://github.com/arifkhan1298",
      liveUrl: "https://arifkhan1298.github.io/cpp-data-structures/",
      stars: 9,
      forks: 3,
      language: "C++",
      updatedAt: "2026",
      featured: true
    },
    {
      id: "proj-5",
      name: "Interactive Responsive App Interface",
      category: "apps",
      description: "A mobile-first responsive web application built with modern touch-friendly components, fluid glassmorphic UI, micro-animations, and instant state reactivity.",
      technologies: ["JavaScript", "CSS Grid", "App UI", "Mobile First"],
      githubUrl: "https://github.com/arifkhan1298",
      liveUrl: "https://arifkhan1298.github.io/responsive-app-ui/",
      stars: 11,
      forks: 4,
      language: "JavaScript",
      updatedAt: "2026",
      featured: true
    },
    {
      id: "proj-6",
      name: "Interactive Developer Portfolio & Web Showcase",
      category: "web",
      description: "Futuristic developer portfolio with real-time GitHub API integration, 3D interactive background canvas, dynamic project filtering, and theme switching.",
      technologies: ["JavaScript", "Three.js", "CSS3", "GitHub API"],
      githubUrl: "https://github.com/arifkhan1298",
      liveUrl: "https://arifkhan1298.github.io/portfolio/",
      stars: 18,
      forks: 6,
      language: "JavaScript",
      updatedAt: "2026",
      featured: true
    },
    {
      id: "proj-7",
      name: "MS Access Database & Office Automation Suite",
      category: "office",
      description: "Custom relational database systems developed in MS Access along with automated MS Excel analytical sheets, complex formulas, and structured business reporting tools.",
      technologies: ["MS Access", "MS Excel", "Relational DB", "VBA"],
      githubUrl: "https://github.com/arifkhan1298",
      liveUrl: "https://arifkhan1298.github.io/office-database-management/",
      stars: 7,
      forks: 2,
      language: "Database",
      updatedAt: "2026",
      featured: false
    },
    {
      id: "proj-8",
      name: "Algorithmic Logic Visualizer & Computational Tools",
      category: "programming",
      description: "An interactive computer science logic visualizer that demonstrates search trees, sorting animations, and core algorithmic complexity in real time.",
      technologies: ["C++", "JavaScript", "Algorithms", "Visualizer"],
      githubUrl: "https://github.com/arifkhan1298",
      liveUrl: "https://arifkhan1298.github.io/algorithm-visualizer/",
      stars: 14,
      forks: 3,
      language: "C++",
      updatedAt: "2026",
      featured: true
    }
  ]
};

if (typeof window !== "undefined") {
  window.CONFIG = CONFIG;
}
