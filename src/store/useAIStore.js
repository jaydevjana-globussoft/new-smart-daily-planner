import { create } from 'zustand';
import { INITIAL_AI_SUGGESTIONS } from '../constants/plannerData';

export const useAIStore = create((set, get) => ({
  isOpen: false,
  isTyping: false,
  suggestions: INITIAL_AI_SUGGESTIONS,
  messages: [
    {
      id: 'm1',
      sender: 'ai',
      text: "Hello! I'm your Smart Daily Planner AI Assistant. I observe your energy & peak focus windows to tailor your daily schedule seamlessly.",
      timestamp: '10:00 AM',
      actions: [
        { label: '⚡ Optimize Today Schedule', type: 'optimize' },
        { label: '☕ Add 15m Coffee Break', type: 'add_break' }
      ]
    }
  ],

  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  setIsOpen: (status) => set({ isOpen: status }),

  sendMessage: async (text) => {
    const userMsg = {
      id: `m_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    set((state) => ({
      messages: [...state.messages, userMsg],
      isTyping: true
    }));

    // Simulate smart AI response after delay
    setTimeout(() => {
      let aiText = "I've analyzed your schedule! Your energy peaks during the morning hours. I recommend placing high-cognitive tasks before 1:00 PM.";
      let actions = [{ label: '📅 Reschedule Focus Tasks', type: 'optimize' }];

      const lowerText = text.toLowerCase();
      if (lowerText.includes('break') || lowerText.includes('tired') || lowerText.includes('rest')) {
        aiText = "Recognized high fatigue indicators. I can block out a 20-minute restorative walk or power nap for you right now.";
        actions = [{ label: '💤 Insert 20m Rest Slot', type: 'add_rest' }];
      } else if (lowerText.includes('goal') || lowerText.includes('habit')) {
        aiText = "You're currently on a 12-day streak for your Water Hydration habit! Keep it up. Want me to schedule your next milestone review?";
        actions = [{ label: '🏆 View Habit Stats', type: 'view_stats' }];
      }

      const aiMsg = {
        id: `m_ai_${Date.now()}`,
        sender: 'ai',
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions
      };

      set((state) => ({
        messages: [...state.messages, aiMsg],
        isTyping: false
      }));
    }, 1200);
  },

  dismissSuggestion: (id) => set((state) => ({
    suggestions: state.suggestions.filter((s) => s.id !== id)
  }))
}));
