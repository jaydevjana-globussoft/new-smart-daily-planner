import api from './plannerApi';

export const aiApi = {
  generateRecommendations: async (archetype, currentTasks) => {
    await new Promise((res) => setTimeout(res, 400));
    return [
      {
        id: `rec_${Date.now()}_1`,
        title: 'Focus Window Alignment',
        description: `As a ${archetype}, your peak focus is best spent on high-cognitive tasks before noon.`,
        suggestedTime: '10:00 AM'
      }
    ];
  },

  queryAssistant: async (prompt, userContext) => {
    await new Promise((res) => setTimeout(res, 600));
    return {
      reply: `Analyzing prompt: "${prompt}". Based on your schedule, I recommend blocking 45 minutes for deep concentration now.`,
      actionSuggested: true
    };
  }
};
