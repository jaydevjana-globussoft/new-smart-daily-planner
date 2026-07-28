import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import dayjs from 'dayjs';
import { INITIAL_TASKS_BY_ARCHETYPE, INITIAL_HABITS, INITIAL_GOALS } from '../constants/plannerData';

export const usePlannerStore = create(
  persist(
    (set, get) => ({
      // Current selected user lifestyle archetype
      archetype: 'professional',

      // Sidebar collapsed toggle state
      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      
      // Active date selection
      selectedDate: dayjs().format('YYYY-MM-DD'),
      
      // Tasks, Habits, Goals
      tasks: INITIAL_TASKS_BY_ARCHETYPE.professional,
      habits: INITIAL_HABITS,
      goals: INITIAL_GOALS,
      
      // Notifications
      notifications: [
        { id: 'n1', title: 'Upcoming Focus Block', time: '10 mins away', read: false, type: 'reminder' },
        { id: 'n2', title: 'AI Suggestion Ready', time: '1 hour ago', read: false, type: 'ai' },
        { id: 'n3', title: 'Habit Streak Milestone!', time: 'Yesterday', read: true, type: 'achievement' }
      ],

      // Actions
      setArchetype: (newArchetype) => {
        const defaultTasks = INITIAL_TASKS_BY_ARCHETYPE[newArchetype] || INITIAL_TASKS_BY_ARCHETYPE.professional;
        set({
          archetype: newArchetype,
          tasks: defaultTasks
        });
      },

      setSelectedDate: (dateStr) => set({ selectedDate: dateStr }),

      // Task actions
      addTask: (newTask) => set((state) => ({
        tasks: [...state.tasks, {
          id: `t_${Date.now()}`,
          time: dayjs().format('HH:mm'),
          duration: 45,
          category: 'work',
          completed: false,
          energy: 'Medium',
          ...newTask
        }]
      })),

      toggleTask: (taskId) => set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      })),

      deleteTask: (taskId) => set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== taskId)
      })),

      updateTaskTimeAndDuration: (taskId, newTime, newDuration) => set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === taskId ? { ...t, time: newTime, duration: newDuration } : t
        )
      })),

      updateTaskDetails: (taskId, updates) => set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === taskId ? { ...t, ...updates } : t
        )
      })),

      // Habit actions
      toggleHabit: (habitId) => set((state) => ({
        habits: state.habits.map((h) => {
          if (h.id === habitId) {
            const nextCompleted = !h.completedToday;
            return {
              ...h,
              completedToday: nextCompleted,
              streak: nextCompleted ? h.streak + 1 : Math.max(0, h.streak - 1)
            };
          }
          return h;
        })
      })),

      addHabit: (newHabit) => set((state) => ({
        habits: [...state.habits, {
          id: `h_${Date.now()}`,
          streak: 1,
          target: 'Daily',
          category: 'health',
          completedToday: false,
          history: [false, false, false, false, false, false, false],
          ...newHabit
        }]
      })),

      // Goal actions
      addGoal: (newGoal) => set((state) => ({
        goals: [...state.goals, {
          id: `g_${Date.now()}`,
          progress: 0,
          milestones: ['Initial Setup'],
          targetDate: dayjs().add(1, 'month').format('YYYY-MM-DD'),
          category: 'personal',
          ...newGoal
        }]
      })),

      updateGoalProgress: (goalId, delta) => set((state) => ({
        goals: state.goals.map((g) => {
          if (g.id === goalId) {
            const nextProg = Math.min(100, Math.max(0, g.progress + delta));
            return { ...g, progress: nextProg };
          }
          return g;
        })
      })),

      // Notification actions
      markAllNotificationsRead: () => set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true }))
      })),

      clearNotifications: () => set({ notifications: [] })
    }),
    {
      name: 'smart-daily-planner-storage',
      partialize: (state) => ({
        archetype: state.archetype,
        tasks: state.tasks,
        habits: state.habits,
        goals: state.goals
      })
    }
  )
);
