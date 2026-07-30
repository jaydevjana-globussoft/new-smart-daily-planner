export const USER_ARCHETYPES = [
  {
    id: 'professional',
    label: 'Working Professional',
    icon: 'Briefcase',
    tagline: 'Optimize meetings, deep work blocks & work-life balance',
    accent: '#E35336'
  },
  {
    id: 'student',
    label: 'Student',
    icon: 'GraduationCap',
    tagline: 'Track lectures, study sessions, exams & extracurriculars',
    accent: '#F4A460'
  },
  {
    id: 'freelancer',
    label: 'Freelancer / Creator',
    icon: 'Laptop',
    tagline: 'Manage client deadlines, creative focus & flexible hours',
    accent: '#E35336'
  },
  {
    id: 'business_owner',
    label: 'Business Owner',
    icon: 'Building',
    tagline: 'Delegate tasks, track strategy, sales calls & operations',
    accent: '#A0522D'
  },
  {
    id: 'homemaker',
    label: 'Homemaker / Caregiver',
    icon: 'Home',
    tagline: 'Organize household chores, meal prep & family routines',
    accent: '#F4A460'
  },
  {
    id: 'job_seeker',
    label: 'Job Seeker',
    icon: 'Search',
    tagline: 'Schedule interviews, resume polishes & skill learning',
    accent: '#E35336'
  },
  {
    id: 'retiree',
    label: 'Retired / Active Elder',
    icon: 'Sun',
    tagline: 'Focus on health, hobbies, community & relaxed pace',
    accent: '#F5F5DC'
  }
];

export const CATEGORY_COLORS = {
  work: { bg: '#E35336', text: '#F5F5DC', label: 'Work & Projects' },
  health: { bg: '#F4A460', text: '#120d0b', label: 'Health & Fitness' },
  personal: { bg: '#A0522D', text: '#F5F5DC', label: 'Personal & Mindful' },
  study: { bg: '#E35336', text: '#F5F5DC', label: 'Learning & Study' },
  household: { bg: '#F4A460', text: '#120d0b', label: 'Household & Family' },
  leisure: { bg: '#A0522D', text: '#F5F5DC', label: 'Leisure & Hobbies' },
  finance: { bg: '#E35336', text: '#F5F5DC', label: 'Finance & Admin' }
};

export const INITIAL_TASKS_BY_ARCHETYPE = {
  professional: [
    { id: 't1', title: 'Morning Focus & Coffee Routine', time: '07:30', duration: 45, category: 'personal', completed: true, energy: 'High' },
    { id: 't2', title: 'Daily Standup & Team Alignment', time: '09:00', duration: 30, category: 'work', completed: true, energy: 'Medium' },
    { id: 't3', title: 'Deep Work: Q3 Product Roadmap', time: '10:00', duration: 120, category: 'work', completed: false, energy: 'High' },
    { id: 't4', title: 'Mindful Lunch Break & Walk', time: '12:30', duration: 60, category: 'health', completed: false, energy: 'Low' },
    { id: 't5', title: 'Client Sync & Code Review', time: '14:30', duration: 90, category: 'work', completed: false, energy: 'Medium' },
    { id: 't6', title: 'Gym Workout - Upper Body', time: '18:00', duration: 60, category: 'health', completed: false, energy: 'High' }
  ],
  student: [
    { id: 't101', title: 'Morning Review & Flashcards', time: '08:00', duration: 45, category: 'study', completed: true, energy: 'High' },
    { id: 't102', title: 'Computer Science Lecture (CS201)', time: '09:30', duration: 90, category: 'study', completed: true, energy: 'High' },
    { id: 't103', title: 'Library Study Group - Algorithms Assignment', time: '11:30', duration: 120, category: 'study', completed: false, energy: 'High' },
    { id: 't104', title: 'Campus Lunch & Social Hour', time: '13:30', duration: 60, category: 'leisure', completed: false, energy: 'Low' },
    { id: 't105', title: 'Physics Lab Experiment', time: '15:00', duration: 90, category: 'study', completed: false, energy: 'Medium' },
    { id: 't106', title: 'Basketball Practice / Exercise', time: '17:30', duration: 60, category: 'health', completed: false, energy: 'High' }
  ],
  freelancer: [
    { id: 't201', title: 'Client Email Triage & Invoicing', time: '09:00', duration: 45, category: 'finance', completed: true, energy: 'Medium' },
    { id: 't202', title: 'UX Design Sprint for AcquiCorp', time: '10:00', duration: 150, category: 'work', completed: false, energy: 'High' },
    { id: 't203', title: 'Healthy Homemade Lunch', time: '13:00', duration: 60, category: 'health', completed: false, energy: 'Low' },
    { id: 't204', title: 'Social Media Portfolio Content Creation', time: '14:30', duration: 90, category: 'work', completed: false, energy: 'Medium' },
    { id: 't205', title: 'Reading & Skill Development (Figma Masterclass)', time: '17:00', duration: 60, category: 'personal', completed: false, energy: 'Medium' }
  ],
  homemaker: [
    { id: 't301', title: 'Family Breakfast & School Run', time: '07:00', duration: 60, category: 'household', completed: true, energy: 'High' },
    { id: 't302', title: 'Weekly Grocery Shopping & Pantry Reset', time: '09:00', duration: 90, category: 'household', completed: true, energy: 'Medium' },
    { id: 't303', title: 'Home Yoga & Meditation Session', time: '11:00', duration: 45, category: 'health', completed: false, energy: 'High' },
    { id: 't304', title: 'Prepare Dinner Meal Prep & Kitchen Cleaning', time: '16:00', duration: 90, category: 'household', completed: false, energy: 'Medium' }
  ],
  business_owner: [
    { id: 't401', title: 'Financial Dashboard & Sales Metrics Review', time: '08:00', duration: 60, category: 'finance', completed: true, energy: 'High' },
    { id: 't402', title: 'Executive Team Meeting & OKR Check-in', time: '09:30', duration: 90, category: 'work', completed: true, energy: 'High' },
    { id: 't403', title: 'Investor Pitch Prep / Strategic Partnerships', time: '13:00', duration: 120, category: 'work', completed: false, energy: 'High' },
    { id: 't404', title: 'Networking Call with Industry Mentor', time: '16:00', duration: 45, category: 'personal', completed: false, energy: 'Medium' }
  ],
  job_seeker: [
    { id: 't501', title: 'Review Job Openings & Custom Resume Tailoring', time: '09:00', duration: 120, category: 'work', completed: true, energy: 'High' },
    { id: 't502', title: 'System Design Mock Interview Practice', time: '11:30', duration: 90, category: 'study', completed: false, energy: 'High' },
    { id: 't503', title: 'LinkedIn Outreach & Connection Messages', time: '14:00', duration: 60, category: 'personal', completed: false, energy: 'Medium' },
    { id: 't504', title: 'Online Certification Course Module', time: '16:00', duration: 90, category: 'study', completed: false, energy: 'Medium' }
  ],
  retiree: [
    { id: 't601', title: 'Morning Garden Walk & Herbal Tea', time: '07:30', duration: 60, category: 'health', completed: true, energy: 'High' },
    { id: 't602', title: 'Book Club Reading - Historical Fiction', time: '09:30', duration: 90, category: 'leisure', completed: true, energy: 'Medium' },
    { id: 't603', title: 'Community Volunteer Committee Meeting', time: '14:00', duration: 90, category: 'personal', completed: false, energy: 'High' },
    { id: 't604', title: 'Watering Garden & Oil Painting Practice', time: '16:30', duration: 90, category: 'leisure', completed: false, energy: 'Medium' }
  ]
};

export const INITIAL_HABITS = [
  { id: 'h1', title: 'Drink 2.5L Water', streak: 12, target: 'Daily', category: 'health', completedToday: true, history: [true, true, true, false, true, true, true] },
  { id: 'h2', title: '30 Mins Daily Movement', streak: 5, target: 'Daily', category: 'health', completedToday: false, history: [true, true, false, true, true, true, false] },
  { id: 'h3', title: 'Read 15 Pages', streak: 18, target: 'Daily', category: 'personal', completedToday: true, history: [true, true, true, true, true, true, true] },
  { id: 'h4', title: 'Zero Social Media Before 10 AM', streak: 3, target: 'Weekdays', category: 'personal', completedToday: false, history: [false, true, true, true, false, true, false] }
];

export const INITIAL_GOALS = [
  { id: 'g1', title: 'Complete AI Architecture Certification', category: 'study', progress: 68, targetDate: '2026-08-30', milestones: ['Enroll Course', 'Finish Modules 1-4', 'Pass Practice Exam', 'Final Certification'] },
  { id: 'g2', title: 'Run a 10K Marathon', category: 'health', progress: 45, targetDate: '2026-09-15', milestones: ['5K Non-stop', 'Interval Training', '8K Long Run', 'Race Day'] },
  { id: 'g3', title: 'Read 24 Books This Year', category: 'personal', progress: 80, targetDate: '2026-12-31', milestones: ['15 Books Finished', 'Track Monthly Notes', 'Write Reviews'] }
];

export const INITIAL_AI_SUGGESTIONS = [
  {
    id: 's1',
    title: 'High Focus Window Detected',
    description: 'Based on your energy patterns, 10:00 AM - 12:00 PM is optimal for your "Deep Work: Product Roadmap" task.',
    actionLabel: 'Lock Schedule',
    category: 'work',
    priority: 'high',
    tag: '⚡ Focus Optimizer'
  },
  {
    id: 's2',
    title: 'Hydration & Stretch Alert',
    description: 'You have been sitting for 90 minutes. Take a 5-minute break and log a glass of water.',
    actionLabel: 'Log Hydration',
    category: 'health',
    priority: 'medium',
    tag: '💧 Wellness AI'
  },
  {
    id: 's3',
    title: 'Evening Wind-down Routine',
    description: 'Schedule a 20-minute digital detox before bed at 10:00 PM to improve sleep quality by 25%.',
    actionLabel: 'Add to Schedule',
    category: 'personal',
    priority: 'low',
    tag: '🌙 Circadian Sync'
  }
];
