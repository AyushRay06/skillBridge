/**
 * Seed script for CGRole + CGRoleSkill
 *
 * Idempotent — uses upsert so safe to run multiple times.
 *
 * Run with:
 *   cd /Users/ayushkumarray/100xAyush/Projects/skillBridge/backend
 *   /usr/local/bin/node src/scripts/seedRoles.js
 */

import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ROLES = [
  // ─── Tech roles ────────────────────────────────────────────────────────────

  {
    name: "Frontend Developer",
    nameAssamese: "ফ্ৰণ্টএণ্ড ডেভেলপাৰ",
    nameHindi: "फ्रंटएंड डेवलपर",
    description:
      "Frontend Developers build the user-facing parts of web applications. They turn designs into interactive, accessible web experiences using modern JavaScript frameworks. Strong communication with designers and backend engineers is essential.",
    category: "tech",
    skills: [
      { skill: "React", weight: 0.9, required: true },
      { skill: "JavaScript", weight: 0.95, required: true },
      { skill: "TypeScript", weight: 0.7, required: false },
      { skill: "HTML", weight: 0.8, required: true },
      { skill: "CSS", weight: 0.8, required: true },
      { skill: "Tailwind", weight: 0.6, required: false },
      { skill: "Next.js", weight: 0.65, required: false },
      { skill: "Git", weight: 0.7, required: true },
    ],
  },
  {
    name: "Backend Developer",
    nameAssamese: "বেকএণ্ড ডেভেলপাৰ",
    nameHindi: "बैकएंड डेवलपर",
    description:
      "Backend Developers design and build the server-side logic, APIs, and databases that power applications. They ensure performance, security, and scalability. Proficiency in at least one server-side language and database is required.",
    category: "tech",
    skills: [
      { skill: "Node.js", weight: 0.85, required: true },
      { skill: "Express", weight: 0.75, required: false },
      { skill: "PostgreSQL", weight: 0.8, required: true },
      { skill: "REST API", weight: 0.85, required: true },
      { skill: "Docker", weight: 0.6, required: false },
      { skill: "Git", weight: 0.7, required: true },
      { skill: "JavaScript", weight: 0.8, required: true },
    ],
  },
  {
    name: "Full Stack Developer",
    nameAssamese: "ফুল ষ্টেক ডেভেলপাৰ",
    nameHindi: "फुल स्टैक डेवलपर",
    description:
      "Full Stack Developers work across both frontend and backend layers of web applications. They handle everything from UI to database design and deployment. Versatility and the ability to own a feature end-to-end are key.",
    category: "tech",
    skills: [
      { skill: "React", weight: 0.85, required: true },
      { skill: "Node.js", weight: 0.85, required: true },
      { skill: "PostgreSQL", weight: 0.75, required: true },
      { skill: "TypeScript", weight: 0.65, required: false },
      { skill: "Git", weight: 0.75, required: true },
      { skill: "REST API", weight: 0.8, required: true },
      { skill: "Docker", weight: 0.55, required: false },
    ],
  },
  {
    name: "Mobile Developer (Android)",
    nameAssamese: "মোবাইল ডেভেলপাৰ (এণ্ড্ৰইড)",
    nameHindi: "मोबाइल डेवलपर (एंड्रॉइड)",
    description:
      "Android Developers create native mobile applications for the Android ecosystem. They use Kotlin or Java alongside the Android SDK to build performant, user-friendly apps. Knowledge of Material Design and device APIs is important.",
    category: "tech",
    skills: [
      { skill: "Kotlin", weight: 0.9, required: true },
      { skill: "Java", weight: 0.7, required: false },
      { skill: "Android SDK", weight: 0.9, required: true },
      { skill: "Firebase", weight: 0.6, required: false },
      { skill: "Git", weight: 0.7, required: true },
      { skill: "REST API", weight: 0.65, required: false },
    ],
  },
  {
    name: "Mobile Developer (iOS)",
    nameAssamese: "মোবাইল ডেভেলপাৰ (আইঅ'এছ)",
    nameHindi: "मोबाइल डेवलपर (iOS)",
    description:
      "iOS Developers build applications for Apple's mobile platform using Swift and Xcode. They must understand Human Interface Guidelines and App Store submission processes. Experience with UIKit or SwiftUI is expected.",
    category: "tech",
    skills: [
      { skill: "Swift", weight: 0.95, required: true },
      { skill: "Xcode", weight: 0.85, required: true },
      { skill: "UIKit", weight: 0.75, required: false },
      { skill: "Firebase", weight: 0.5, required: false },
      { skill: "Git", weight: 0.7, required: true },
      { skill: "REST API", weight: 0.65, required: false },
    ],
  },
  {
    name: "DevOps Engineer",
    nameAssamese: "ডেভঅপছ ইঞ্জিনিয়াৰ",
    nameHindi: "डेवऑप्स इंजीनियर",
    description:
      "DevOps Engineers bridge development and operations by automating infrastructure, CI/CD pipelines, and deployment workflows. They champion reliability, observability, and developer productivity. Cloud and containerisation skills are essential.",
    category: "tech",
    skills: [
      { skill: "Docker", weight: 0.9, required: true },
      { skill: "Kubernetes", weight: 0.8, required: false },
      { skill: "CI/CD", weight: 0.85, required: true },
      { skill: "Linux", weight: 0.85, required: true },
      { skill: "AWS", weight: 0.75, required: false },
      { skill: "Terraform", weight: 0.7, required: false },
      { skill: "Bash", weight: 0.75, required: true },
    ],
  },
  {
    name: "Cloud Engineer",
    nameAssamese: "ক্লাউড ইঞ্জিনিয়াৰ",
    nameHindi: "क्लाउड इंजीनियर",
    description:
      "Cloud Engineers design, build, and manage scalable infrastructure on cloud platforms such as AWS, Azure, or GCP. They implement security best practices, cost optimisation, and disaster recovery strategies. Certifications from major cloud providers are highly valued.",
    category: "tech",
    skills: [
      { skill: "AWS", weight: 0.85, required: false },
      { skill: "Azure", weight: 0.7, required: false },
      { skill: "GCP", weight: 0.65, required: false },
      { skill: "Terraform", weight: 0.8, required: true },
      { skill: "Docker", weight: 0.75, required: true },
      { skill: "Kubernetes", weight: 0.7, required: false },
      { skill: "Linux", weight: 0.8, required: true },
    ],
  },
  {
    name: "Data Analyst",
    nameAssamese: "ডেটা বিশ্লেষক",
    nameHindi: "डेटा विश्लेषक",
    description:
      "Data Analysts transform raw data into actionable business insights through analysis and visualisation. They work closely with stakeholders to define KPIs, build dashboards, and tell stories with data. Strong Excel, SQL, and visualisation skills are core.",
    category: "tech",
    skills: [
      { skill: "Python", weight: 0.7, required: false },
      { skill: "SQL", weight: 0.9, required: true },
      { skill: "Excel", weight: 0.85, required: true },
      { skill: "Tableau", weight: 0.65, required: false },
      { skill: "Power BI", weight: 0.65, required: false },
      { skill: "Statistics", weight: 0.75, required: true },
      { skill: "Pandas", weight: 0.6, required: false },
    ],
  },
  {
    name: "Data Scientist",
    nameAssamese: "ডেটা বিজ্ঞানী",
    nameHindi: "डेटा साइंटिस्ट",
    description:
      "Data Scientists apply statistical modelling and machine learning to solve complex business problems. They extract insights from large datasets and communicate findings to non-technical stakeholders. A strong foundation in maths, statistics, and Python is expected.",
    category: "tech",
    skills: [
      { skill: "Python", weight: 0.95, required: true },
      { skill: "Machine Learning", weight: 0.9, required: true },
      { skill: "TensorFlow", weight: 0.65, required: false },
      { skill: "Pandas", weight: 0.8, required: true },
      { skill: "NumPy", weight: 0.75, required: true },
      { skill: "Statistics", weight: 0.85, required: true },
      { skill: "SQL", weight: 0.7, required: true },
    ],
  },
  {
    name: "Machine Learning Engineer",
    nameAssamese: "মেচিন লাৰ্নিং ইঞ্জিনিয়াৰ",
    nameHindi: "मशीन लर्निंग इंजीनियर",
    description:
      "ML Engineers productionise machine learning models and build the infrastructure to train, serve, and monitor them at scale. They combine software engineering rigour with deep ML knowledge. MLOps and containerisation skills are increasingly important.",
    category: "tech",
    skills: [
      { skill: "Python", weight: 0.95, required: true },
      { skill: "TensorFlow", weight: 0.75, required: false },
      { skill: "PyTorch", weight: 0.75, required: false },
      { skill: "MLOps", weight: 0.8, required: true },
      { skill: "Docker", weight: 0.7, required: true },
      { skill: "Git", weight: 0.65, required: true },
      { skill: "SQL", weight: 0.6, required: false },
    ],
  },
  {
    name: "AI/LLM Engineer",
    nameAssamese: "এআই/এলএলএম ইঞ্জিনিয়াৰ",
    nameHindi: "एआई/एलएलएम इंजीनियर",
    description:
      "AI/LLM Engineers build intelligent applications powered by large language models and generative AI. They work with prompt engineering, RAG pipelines, and AI orchestration frameworks. A strong understanding of LLM capabilities and limitations is critical.",
    category: "tech",
    skills: [
      { skill: "Python", weight: 0.9, required: true },
      { skill: "LangChain", weight: 0.8, required: false },
      { skill: "OpenAI API", weight: 0.75, required: false },
      { skill: "Vector Databases", weight: 0.7, required: false },
      { skill: "Docker", weight: 0.6, required: false },
      { skill: "Git", weight: 0.65, required: true },
    ],
  },
  {
    name: "Cybersecurity Analyst",
    nameAssamese: "চাইবাৰ সুৰক্ষা বিশ্লেষক",
    nameHindi: "साइबर सुरक्षा विश्लेषक",
    description:
      "Cybersecurity Analysts protect organisations from cyber threats by monitoring systems, responding to incidents, and implementing security controls. They assess vulnerabilities and ensure compliance with security standards. Certifications like CEH or CompTIA Security+ strengthen profiles.",
    category: "tech",
    skills: [
      { skill: "Networking", weight: 0.85, required: true },
      { skill: "Linux", weight: 0.8, required: true },
      { skill: "Ethical Hacking", weight: 0.75, required: false },
      { skill: "SIEM", weight: 0.7, required: false },
      { skill: "Penetration Testing", weight: 0.7, required: false },
    ],
  },
  {
    name: "UI/UX Designer",
    nameAssamese: "ইউআই/ইউএক্স ডিজাইনাৰ",
    nameHindi: "यूआई/यूएक्स डिज़ाइनर",
    description:
      "UI/UX Designers craft intuitive, beautiful, and accessible digital experiences. They conduct user research, create wireframes and prototypes, and collaborate closely with engineers. Proficiency in Figma and a solid understanding of design principles are expected.",
    category: "creative",
    skills: [
      { skill: "Figma", weight: 0.9, required: true },
      { skill: "User Research", weight: 0.8, required: true },
      { skill: "Prototyping", weight: 0.8, required: true },
      { skill: "Adobe XD", weight: 0.55, required: false },
      { skill: "HTML/CSS", weight: 0.6, required: false },
      { skill: "Usability Testing", weight: 0.75, required: false },
    ],
  },
  {
    name: "QA Engineer",
    nameAssamese: "কিউএ ইঞ্জিনিয়াৰ",
    nameHindi: "क्यूए इंजीनियर",
    description:
      "QA Engineers ensure software quality through systematic testing, defect reporting, and process improvement. They design test plans, automate regression tests, and collaborate with developers to prevent bugs from reaching production. Attention to detail is paramount.",
    category: "tech",
    skills: [
      { skill: "Manual Testing", weight: 0.85, required: true },
      { skill: "Selenium", weight: 0.65, required: false },
      { skill: "Postman", weight: 0.7, required: false },
      { skill: "SQL", weight: 0.6, required: false },
      { skill: "Test Planning", weight: 0.8, required: true },
      { skill: "Bug Reporting", weight: 0.85, required: true },
    ],
  },
  {
    name: "Database Administrator",
    nameAssamese: "ডেটাবেছ প্ৰশাসক",
    nameHindi: "डेटाबेस प्रशासक",
    description:
      "Database Administrators manage, optimise, and secure databases to ensure data availability and integrity. They handle backups, performance tuning, and disaster recovery planning. Experience with multiple RDBMS and NoSQL systems is a strong advantage.",
    category: "tech",
    skills: [
      { skill: "PostgreSQL", weight: 0.85, required: true },
      { skill: "MySQL", weight: 0.75, required: false },
      { skill: "MongoDB", weight: 0.65, required: false },
      { skill: "SQL", weight: 0.9, required: true },
      { skill: "Backup & Recovery", weight: 0.8, required: true },
      { skill: "Performance Tuning", weight: 0.8, required: true },
    ],
  },
  {
    name: "Blockchain Developer",
    nameAssamese: "ব্লকচেইন ডেভেলপাৰ",
    nameHindi: "ब्लॉकचेन डेवलपर",
    description:
      "Blockchain Developers build decentralised applications and smart contracts on blockchain platforms. They must deeply understand distributed systems, cryptography, and token economics. Solidity and Ethereum ecosystem knowledge are most in demand.",
    category: "tech",
    skills: [
      { skill: "Solidity", weight: 0.9, required: true },
      { skill: "Ethereum", weight: 0.85, required: true },
      { skill: "Web3.js", weight: 0.75, required: false },
      { skill: "Smart Contracts", weight: 0.9, required: true },
      { skill: "JavaScript", weight: 0.7, required: true },
    ],
  },
  {
    name: "Embedded Systems Engineer",
    nameAssamese: "এম্বেডেড ছিষ্টেম ইঞ্জিনিয়াৰ",
    nameHindi: "एम्बेडेड सिस्टम इंजीनियर",
    description:
      "Embedded Systems Engineers program microcontrollers and firmware for hardware devices such as IoT sensors, automotive systems, and industrial machines. They work close to the hardware layer where efficiency is critical. Strong C/C++ and electronics knowledge is required.",
    category: "tech",
    skills: [
      { skill: "C", weight: 0.9, required: true },
      { skill: "C++", weight: 0.85, required: true },
      { skill: "Microcontrollers", weight: 0.85, required: true },
      { skill: "RTOS", weight: 0.7, required: false },
      { skill: "Electronics", weight: 0.75, required: true },
    ],
  },
  {
    name: "Game Developer",
    nameAssamese: "গেম ডেভেলপাৰ",
    nameHindi: "गेम डेवलपर",
    description:
      "Game Developers design and implement interactive entertainment experiences for PC, mobile, or console platforms. They work with game engines such as Unity or Unreal to bring game mechanics, graphics, and physics to life. Creativity and performance optimisation skills are essential.",
    category: "creative",
    skills: [
      { skill: "Unity", weight: 0.85, required: false },
      { skill: "C#", weight: 0.8, required: false },
      { skill: "Unreal Engine", weight: 0.75, required: false },
      { skill: "3D Modelling", weight: 0.6, required: false },
      { skill: "Physics Simulation", weight: 0.65, required: false },
    ],
  },
  {
    name: "Technical Writer",
    nameAssamese: "টেকনিকেল ৰাইটাৰ",
    nameHindi: "तकनीकी लेखक",
    description:
      "Technical Writers create clear, accurate documentation for software products, APIs, and developer tools. They bridge the gap between engineers and end users, making complex systems understandable. Strong writing skills and curiosity about technology are essential.",
    category: "creative",
    skills: [
      { skill: "Documentation", weight: 0.9, required: true },
      { skill: "Markdown", weight: 0.8, required: true },
      { skill: "API Writing", weight: 0.75, required: false },
      { skill: "Communication", weight: 0.85, required: true },
      { skill: "Research", weight: 0.7, required: true },
    ],
  },
  {
    name: "Product Manager (Tech)",
    nameAssamese: "প্ৰডাক্ট মেনেজাৰ (টেক)",
    nameHindi: "प्रोडक्ट मैनेजर (टेक)",
    description:
      "Tech Product Managers define product vision, prioritise features, and coordinate across engineering, design, and business teams. They translate customer needs into product requirements and track outcomes with data. Strong communication and analytical skills are critical.",
    category: "management",
    skills: [
      { skill: "Product Strategy", weight: 0.9, required: true },
      { skill: "Agile", weight: 0.8, required: true },
      { skill: "JIRA", weight: 0.65, required: false },
      { skill: "User Research", weight: 0.75, required: true },
      { skill: "Data Analysis", weight: 0.7, required: true },
      { skill: "Communication", weight: 0.85, required: true },
    ],
  },

  // ─── Assam/Northeast specific roles ──────────────────────────────────────

  {
    name: "APSC Civil Services (Assam)",
    nameAssamese: "এপিএছচি অসামৰিক সেৱা",
    nameHindi: "एपीएससी सिविल सेवा (असम)",
    description:
      "The Assam Public Service Commission conducts examinations for Class I and Class II state government positions. Candidates must have a strong command of general studies, Assamese language and culture, and constitutional knowledge. Consistent preparation over 1-2 years is typical.",
    category: "govt",
    skills: [
      { skill: "General Studies", weight: 0.9, required: true },
      { skill: "Assamese Language", weight: 0.85, required: true },
      { skill: "Reasoning", weight: 0.75, required: true },
      { skill: "Essay Writing", weight: 0.8, required: true },
      { skill: "Current Affairs", weight: 0.85, required: true },
      { skill: "Constitution", weight: 0.8, required: true },
    ],
  },
  {
    name: "IBPS PO/Banking Officer",
    nameAssamese: "আইবিপিএছ পিঅ'/বেংকিং অফিচাৰ",
    nameHindi: "आईबीपीएस पीओ/बैंकिंग ऑफिसर",
    description:
      "IBPS PO and similar banking exams lead to Probationary Officer roles in public sector banks across India. The exam tests quantitative aptitude, reasoning, English language, and banking/finance awareness. A bank PO role is prestigious and offers strong job security.",
    category: "finance",
    skills: [
      { skill: "Quantitative Aptitude", weight: 0.9, required: true },
      { skill: "Reasoning", weight: 0.9, required: true },
      { skill: "English", weight: 0.8, required: true },
      { skill: "Banking Awareness", weight: 0.85, required: true },
      { skill: "Computer Basics", weight: 0.6, required: false },
    ],
  },
  {
    name: "SSC CGL (Staff Selection Commission)",
    nameAssamese: "এছএছচি চিজিএল",
    nameHindi: "एसएससी सीजीएल",
    description:
      "SSC CGL is a prestigious central government examination recruiting candidates for various Group B and Group C posts across ministries and departments. It tests quantitative aptitude, English, general awareness, and reasoning. Government job security and perks make it highly competitive.",
    category: "govt",
    skills: [
      { skill: "Quantitative Aptitude", weight: 0.9, required: true },
      { skill: "English", weight: 0.85, required: true },
      { skill: "General Awareness", weight: 0.85, required: true },
      { skill: "Reasoning", weight: 0.9, required: true },
    ],
  },
  {
    name: "Oil Sector Engineer (OIL/ONGC)",
    nameAssamese: "তেল খণ্ডৰ অভিযন্তা (অইএল/অএনজিচি)",
    nameHindi: "तेल क्षेत्र इंजीनियर (OIL/ONGC)",
    description:
      "Engineers at Oil India Limited and ONGC work in exploration, drilling, production, and refining operations. Northeast India has significant oil reserves making this a regionally important career. A relevant engineering degree and strong technical aptitude are prerequisites.",
    category: "tech",
    skills: [
      { skill: "Petroleum Engineering", weight: 0.8, required: false },
      { skill: "Mechanical Engineering", weight: 0.75, required: false },
      { skill: "Electrical Engineering", weight: 0.7, required: false },
      { skill: "Technical Aptitude", weight: 0.85, required: true },
      { skill: "Safety Protocols", weight: 0.8, required: true },
    ],
  },
  {
    name: "Northeast Startup Founder",
    nameAssamese: "উত্তৰ-পূৰ্বৰ ষ্টাৰ্টআপ প্ৰতিষ্ঠাতা",
    nameHindi: "पूर्वोत्तर स्टार्टअप संस्थापक",
    description:
      "Startup founders in Northeast India are building innovative solutions addressing local problems in agriculture, healthcare, education, and tourism. Access to government startup schemes (like Startup India and Assam's startup ecosystem) creates opportunities. Resilience, business acumen, and domain expertise are key.",
    category: "management",
    skills: [
      { skill: "Business Planning", weight: 0.9, required: true },
      { skill: "Marketing", weight: 0.75, required: true },
      { skill: "Finance", weight: 0.7, required: true },
      { skill: "Communication", weight: 0.85, required: true },
      { skill: "Problem Solving", weight: 0.9, required: true },
      { skill: "Leadership", weight: 0.85, required: true },
    ],
  },
  {
    name: "Government School Teacher (Assam)",
    nameAssamese: "চৰকাৰী বিদ্যালয়ৰ শিক্ষক (অসম)",
    nameHindi: "सरकारी स्कूल शिक्षक (असम)",
    description:
      "Government school teachers in Assam teach students across primary and secondary levels. They must pass the Teacher Eligibility Test (TET) and relevant subject examinations conducted by SEBA or AHSEC boards. Teaching offers a respected, stable career with good work-life balance.",
    category: "govt",
    skills: [
      { skill: "Subject Knowledge", weight: 0.9, required: true },
      { skill: "Communication", weight: 0.85, required: true },
      { skill: "Pedagogy", weight: 0.8, required: true },
      { skill: "Assamese Language", weight: 0.75, required: true },
      { skill: "TET Qualification", weight: 0.9, required: true },
    ],
  },
  {
    name: "State Government IT Officer",
    nameAssamese: "ৰাজ্য চৰকাৰৰ আইটি অফিচাৰ",
    nameHindi: "राज्य सरकार आईटी अधिकारी",
    description:
      "State IT Officers manage and implement digital infrastructure for Assam government departments, supporting e-governance initiatives. They oversee networks, databases, and government software systems. A computer science degree and programming knowledge are typically required.",
    category: "govt",
    skills: [
      { skill: "Computer Science", weight: 0.85, required: true },
      { skill: "Programming", weight: 0.8, required: true },
      { skill: "Networking", weight: 0.75, required: true },
      { skill: "Government Policy", weight: 0.65, required: false },
      { skill: "Database Management", weight: 0.75, required: true },
    ],
  },
  {
    name: "Journalist/Reporter (Northeast)",
    nameAssamese: "সাংবাদিক/প্ৰতিবেদক (উত্তৰ-পূৰ্ব)",
    nameHindi: "पत्रकार/रिपोर्टर (पूर्वोत्तर)",
    description:
      "Journalists in Northeast India cover regional politics, culture, environment, and development stories for print, broadcast, and digital media. Fluency in Assamese and a deep understanding of the region's unique geopolitical context are valuable. Strong investigative and storytelling skills distinguish great reporters.",
    category: "creative",
    skills: [
      { skill: "Reporting", weight: 0.9, required: true },
      { skill: "Assamese Writing", weight: 0.85, required: true },
      { skill: "Research", weight: 0.8, required: true },
      { skill: "Photography", weight: 0.6, required: false },
      { skill: "Communication", weight: 0.9, required: true },
      { skill: "Digital Media", weight: 0.7, required: false },
    ],
  },
  {
    name: "NGO/Social Worker (Northeast)",
    nameAssamese: "এনজিঅ'/সামাজিক কৰ্মী (উত্তৰ-পূৰ্ব)",
    nameHindi: "एनजीओ/सामाजिक कार्यकर्ता (पूर्वोत्तर)",
    description:
      "Social workers and NGO professionals in Northeast India work on community development, women empowerment, environmental conservation, and tribal welfare. They manage projects, engage communities, and write reports for donors and government bodies. Passion for the cause is as important as professional skills.",
    category: "management",
    skills: [
      { skill: "Community Engagement", weight: 0.9, required: true },
      { skill: "Project Management", weight: 0.8, required: true },
      { skill: "Communication", weight: 0.85, required: true },
      { skill: "Report Writing", weight: 0.8, required: true },
      { skill: "Fundraising", weight: 0.7, required: false },
    ],
  },
  {
    name: "Agricultural Officer (Assam)",
    nameAssamese: "কৃষি বিষয়া (অসম)",
    nameHindi: "कृषि अधिकारी (असम)",
    description:
      "Agricultural Officers in Assam advise farmers, implement government schemes, and promote modern farming techniques suited to the region's climate and crops like tea, rice, and mustard. Field work is a major component of the role. A degree in agriculture and passing the APSC exam are typically required.",
    category: "govt",
    skills: [
      { skill: "Agriculture", weight: 0.9, required: true },
      { skill: "Soil Science", weight: 0.8, required: true },
      { skill: "Crop Management", weight: 0.85, required: true },
      { skill: "Government Policy", weight: 0.7, required: true },
      { skill: "Field Work", weight: 0.8, required: true },
    ],
  },

  // ─── Non-tech professional roles ────────────────────────────────────────────

  {
    name: "Business Analyst",
    nameAssamese: "ব্যৱসায় বিশ্লেষক",
    nameHindi: "बिज़नेस एनालिस्ट",
    description:
      "Business Analysts bridge the gap between business needs and technical solutions by gathering requirements, modelling processes, and defining acceptance criteria. They work with stakeholders across departments to drive organisational improvements. Strong communication and analytical skills are essential.",
    category: "management",
    skills: [
      { skill: "Requirements Gathering", weight: 0.9, required: true },
      { skill: "SQL", weight: 0.7, required: false },
      { skill: "Excel", weight: 0.8, required: true },
      { skill: "Communication", weight: 0.9, required: true },
      { skill: "Process Mapping", weight: 0.8, required: true },
      { skill: "Stakeholder Management", weight: 0.85, required: true },
    ],
  },
  {
    name: "Digital Marketing Specialist",
    nameAssamese: "ডিজিটেল মাৰ্কেটিং বিশেষজ্ঞ",
    nameHindi: "डिजिटल मार्केटिंग विशेषज्ञ",
    description:
      "Digital Marketing Specialists plan and execute online marketing campaigns across search, social, email, and content channels. They analyse performance data to optimise campaigns and maximise ROI. Knowledge of SEO, paid advertising platforms, and analytics tools is required.",
    category: "management",
    skills: [
      { skill: "SEO", weight: 0.85, required: true },
      { skill: "Google Ads", weight: 0.8, required: false },
      { skill: "Social Media", weight: 0.8, required: true },
      { skill: "Analytics", weight: 0.75, required: true },
      { skill: "Content Writing", weight: 0.7, required: false },
      { skill: "Email Marketing", weight: 0.65, required: false },
    ],
  },
  {
    name: "Content Writer",
    nameAssamese: "কন্টেন্ট ৰাইটাৰ",
    nameHindi: "कंटेंट राइटर",
    description:
      "Content Writers create engaging written content for websites, blogs, social media, and marketing materials. They research topics thoroughly and optimise content for search engines. Strong grammar, storytelling ability, and the capacity to adapt to different brand voices are key.",
    category: "creative",
    skills: [
      { skill: "Writing", weight: 0.95, required: true },
      { skill: "Research", weight: 0.8, required: true },
      { skill: "SEO", weight: 0.75, required: false },
      { skill: "Social Media", weight: 0.65, required: false },
      { skill: "WordPress", weight: 0.6, required: false },
      { skill: "Communication", weight: 0.75, required: true },
    ],
  },
  {
    name: "Graphic Designer",
    nameAssamese: "গ্ৰাফিক ডিজাইনাৰ",
    nameHindi: "ग्राफिक डिज़ाइनर",
    description:
      "Graphic Designers create visual content for branding, marketing, and digital media. They use industry-standard tools to design logos, social media graphics, print materials, and UI elements. A strong portfolio demonstrating visual creativity and technical proficiency is essential.",
    category: "creative",
    skills: [
      { skill: "Photoshop", weight: 0.85, required: true },
      { skill: "Illustrator", weight: 0.8, required: true },
      { skill: "Figma", weight: 0.7, required: false },
      { skill: "Typography", weight: 0.75, required: true },
      { skill: "Branding", weight: 0.7, required: false },
      { skill: "Canva", weight: 0.55, required: false },
    ],
  },
  {
    name: "Human Resources Manager",
    nameAssamese: "মানৱ সম্পদ প্ৰবন্ধক",
    nameHindi: "मानव संसाधन प्रबंधक",
    description:
      "HR Managers oversee the full employee lifecycle from recruitment and onboarding to performance management and exit. They ensure compliance with labour laws and cultivate a positive organisational culture. Strong interpersonal skills and discretion with confidential information are paramount.",
    category: "management",
    skills: [
      { skill: "Recruitment", weight: 0.9, required: true },
      { skill: "HRIS", weight: 0.65, required: false },
      { skill: "Communication", weight: 0.9, required: true },
      { skill: "Labour Law", weight: 0.8, required: true },
      { skill: "Performance Management", weight: 0.8, required: true },
    ],
  },
  {
    name: "Financial Analyst",
    nameAssamese: "বিত্তীয় বিশ্লেষক",
    nameHindi: "वित्तीय विश्लेषक",
    description:
      "Financial Analysts evaluate financial data, build models, and provide investment or business performance insights to support decision-making. They prepare reports, forecasts, and valuations for management or clients. A strong foundation in accounting, Excel, and financial modelling is expected.",
    category: "finance",
    skills: [
      { skill: "Excel", weight: 0.9, required: true },
      { skill: "Financial Modelling", weight: 0.9, required: true },
      { skill: "Accounting", weight: 0.8, required: true },
      { skill: "SQL", weight: 0.6, required: false },
      { skill: "Power BI", weight: 0.6, required: false },
      { skill: "Communication", weight: 0.75, required: true },
    ],
  },
  {
    name: "Sales Manager",
    nameAssamese: "বিক্ৰয় প্ৰবন্ধক",
    nameHindi: "सेल्स मैनेजर",
    description:
      "Sales Managers lead sales teams, set targets, develop sales strategies, and manage client relationships to drive revenue growth. They mentor team members and track KPIs using CRM tools. Strong negotiation skills and a results-driven mindset are essential.",
    category: "management",
    skills: [
      { skill: "CRM", weight: 0.8, required: false },
      { skill: "Communication", weight: 0.95, required: true },
      { skill: "Negotiation", weight: 0.9, required: true },
      { skill: "B2B Sales", weight: 0.85, required: false },
      { skill: "Leadership", weight: 0.85, required: true },
      { skill: "Customer Success", weight: 0.75, required: false },
    ],
  },
  {
    name: "Operations Manager",
    nameAssamese: "অপাৰেচন্স প্ৰবন্ধক",
    nameHindi: "ऑपरेशन मैनेजर",
    description:
      "Operations Managers streamline day-to-day business processes, manage supply chains, and ensure efficient resource utilisation across departments. They implement process improvements, manage vendors, and monitor KPIs. Strong organisational and problem-solving skills are critical.",
    category: "management",
    skills: [
      { skill: "Process Improvement", weight: 0.9, required: true },
      { skill: "Excel", weight: 0.8, required: true },
      { skill: "ERP", weight: 0.7, required: false },
      { skill: "Supply Chain", weight: 0.75, required: false },
      { skill: "Communication", weight: 0.85, required: true },
      { skill: "Project Management", weight: 0.8, required: true },
    ],
  },
  {
    name: "Chartered Accountant",
    nameAssamese: "চাৰ্টাৰ্ড একাউণ্টেণ্ট",
    nameHindi: "चार्टर्ड अकाउंटेंट",
    description:
      "Chartered Accountants (CAs) are highly qualified finance professionals who handle accounting, taxation, auditing, and financial advisory services. Qualifying as a CA requires clearing the ICAI examinations, which is a rigorous multi-year process. CAs are in consistent demand across industries and practice.",
    category: "finance",
    skills: [
      { skill: "Accounting", weight: 0.95, required: true },
      { skill: "Taxation", weight: 0.9, required: true },
      { skill: "Audit", weight: 0.85, required: true },
      { skill: "Tally", weight: 0.75, required: false },
      { skill: "Financial Reporting", weight: 0.85, required: true },
      { skill: "Compliance", weight: 0.8, required: true },
    ],
  },
  {
    name: "Healthcare Administrator",
    nameAssamese: "স্বাস্থ্যসেৱা প্ৰশাসক",
    nameHindi: "हेल्थकेयर प्रशासक",
    description:
      "Healthcare Administrators manage the operational, financial, and human resource aspects of hospitals, clinics, and healthcare facilities. They ensure regulatory compliance, optimise workflows, and coordinate between clinical and administrative teams. A background in healthcare management or hospital administration is preferred.",
    category: "management",
    skills: [
      { skill: "Hospital Management", weight: 0.9, required: true },
      { skill: "Medical Billing", weight: 0.75, required: false },
      { skill: "Communication", weight: 0.85, required: true },
      { skill: "HIPAA Compliance", weight: 0.7, required: false },
      { skill: "Excel", weight: 0.7, required: true },
    ],
  },
];

async function seed() {
  console.log("[CG Seed] Starting role seed...\n");
  let created = 0;
  let updated = 0;

  for (const roleData of ROLES) {
    const { skills, ...roleFields } = roleData;

    try {
      // Check if role already exists
      const existing = await prisma.cGRole.findUnique({
        where: { name: roleFields.name },
      });

      if (existing) {
        // Delete existing skills and re-create (simplest idempotent approach)
        await prisma.cGRoleSkill.deleteMany({ where: { roleId: existing.id } });
        await prisma.cGRole.update({
          where: { id: existing.id },
          data: {
            ...roleFields,
            skills: {
              create: skills.map((s) => ({
                skill: s.skill,
                weight: s.weight,
                required: s.required,
              })),
            },
          },
        });
        updated++;
        process.stdout.write(`  ✓ Updated: ${roleFields.name}\n`);
      } else {
        await prisma.cGRole.create({
          data: {
            ...roleFields,
            skills: {
              create: skills.map((s) => ({
                skill: s.skill,
                weight: s.weight,
                required: s.required,
              })),
            },
          },
        });
        created++;
        process.stdout.write(`  + Created: ${roleFields.name}\n`);
      }
    } catch (err) {
      console.error(`  ✗ Error for role "${roleFields.name}":`, err.message);
    }
  }

  console.log(`\n[CG Seed] Done! ${created} created, ${updated} updated. Total: ${created + updated} roles.`);
}

seed()
  .catch((err) => {
    console.error("[CG Seed] Fatal error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
