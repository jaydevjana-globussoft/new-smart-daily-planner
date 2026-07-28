import React, { useState } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import {
  BarChart3,
  TrendingUp,
  Clock,
  PieChart as PieIcon,
  Zap,
  Target,
  Activity,
  Award,
  CheckCircle2
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart
} from 'recharts';
import NeumoCard from '../Common/NeumoCard';
import { usePlannerStore } from '../../store/usePlannerStore';

// Datasets for 2D Interactive Visualizations

const WEEKLY_DATA = [
  { day: 'Mon', completed: 8, target: 10, focusHours: 6.5, energyScore: 85 },
  { day: 'Tue', completed: 9, target: 9, focusHours: 7.2, energyScore: 92 },
  { day: 'Wed', completed: 7, target: 10, focusHours: 5.8, energyScore: 78 },
  { day: 'Thu', completed: 10, target: 10, focusHours: 8.0, energyScore: 96 },
  { day: 'Fri', completed: 6, target: 8, focusHours: 5.0, energyScore: 70 },
  { day: 'Sat', completed: 5, target: 6, focusHours: 4.2, energyScore: 65 },
  { day: 'Sun', completed: 7, target: 7, focusHours: 5.5, energyScore: 82 }
];

const MONTHLY_DATA = [
  { day: 'W1', completed: 42, target: 48, focusHours: 32.0, energyScore: 84 },
  { day: 'W2', completed: 51, target: 50, focusHours: 38.5, energyScore: 90 },
  { day: 'W3', completed: 46, target: 48, focusHours: 34.2, energyScore: 86 },
  { day: 'W4', completed: 55, target: 52, focusHours: 41.0, energyScore: 94 }
];

const CATEGORY_DISTRIBUTION = [
  { name: 'Work & Deep Focus', value: 18.5, color: '#7C5CFC', percentage: '44%' },
  { name: 'Health & Fitness', value: 7.0, color: '#22C55E', percentage: '17%' },
  { name: 'Personal & Mindful', value: 5.5, color: '#A855F7', percentage: '13%' },
  { name: 'Learning & Skill', value: 6.0, color: '#3B82F6', percentage: '14%' },
  { name: 'Household & Family', value: 4.0, color: '#FF7A59', percentage: '12%' }
];

const RADAR_BALANCE_DATA = [
  { category: 'Deep Work', current: 88, ideal: 90 },
  { category: 'Fitness', current: 75, ideal: 80 },
  { category: 'Rest & Mindfulness', current: 82, ideal: 85 },
  { category: 'Learning', current: 70, ideal: 75 },
  { category: 'Family / Social', current: 85, ideal: 85 }
];

const HOURLY_PRODUCTIVITY = [
  { hour: '6 AM', focus: 30 },
  { hour: '8 AM', focus: 65 },
  { hour: '10 AM', focus: 95 },
  { hour: '12 PM', focus: 50 },
  { hour: '2 PM', focus: 85 },
  { hour: '4 PM', focus: 75 },
  { hour: '6 PM', focus: 40 },
  { hour: '8 PM', focus: 60 }
];

const AnalyticsWidget = () => {
  const [timeRange, setTimeRange] = useState('weekly');
  const { archetype } = usePlannerStore();

  const chartData = timeRange === 'weekly' ? WEEKLY_DATA : MONTHLY_DATA;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* 2D Metrics Overview Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2.5 }}>
        <NeumoCard sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" sx={{ color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Total Focus Hours
            </Typography>
            <Box sx={{ p: 1, borderRadius: 2.5, backgroundColor: '#F4EEFF', color: '#7C5CFC' }}>
              <Clock size={18} />
            </Box>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: 'Outfit', color: '#1F2937' }}>
            42.2 hrs
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.8 }}>
            <TrendingUp size={14} color="#22C55E" />
            <Typography variant="caption" sx={{ color: '#16A34A', fontWeight: 700 }}>
              +14% vs last week
            </Typography>
          </Box>
        </NeumoCard>

        <NeumoCard sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" sx={{ color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Completion Rate
            </Typography>
            <Box sx={{ p: 1, borderRadius: 2.5, backgroundColor: 'rgba(34, 197, 94, 0.12)', color: '#16A34A' }}>
              <CheckCircle2 size={18} />
            </Box>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: 'Outfit', color: '#1F2937' }}>
            91.4%
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.8 }}>
            <TrendingUp size={14} color="#22C55E" />
            <Typography variant="caption" sx={{ color: '#16A34A', fontWeight: 700 }}>
              +6.2% overall
            </Typography>
          </Box>
        </NeumoCard>

        <NeumoCard sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" sx={{ color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Peak Energy Window
            </Typography>
            <Box sx={{ p: 1, borderRadius: 2.5, backgroundColor: 'rgba(245, 158, 11, 0.12)', color: '#D97706' }}>
              <Zap size={18} />
            </Box>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: 'Outfit', color: '#1F2937', fontSize: '1.5rem' }}>
            10 AM - 1 PM
          </Typography>
          <Typography variant="caption" sx={{ color: '#6B7280', fontWeight: 700, display: 'block', mt: 0.8 }}>
            95% Peak Focus Output
          </Typography>
        </NeumoCard>

        <NeumoCard sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" sx={{ color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Habit Streak Index
            </Typography>
            <Box sx={{ p: 1, borderRadius: 2.5, backgroundColor: 'rgba(168, 85, 247, 0.12)', color: '#A855F7' }}>
              <Award size={18} />
            </Box>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: 'Outfit', color: '#1F2937' }}>
            14 Days
          </Typography>
          <Typography variant="caption" sx={{ color: '#A855F7', fontWeight: 800, display: 'block', mt: 0.8 }}>
            Personal Best Record!
          </Typography>
        </NeumoCard>
      </Box>

      {/* Main Interactive 2D Trend & Focus Composed Chart */}
      <NeumoCard sx={{ p: { xs: 2.5, md: 3.5 } }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', gap: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ p: 1, borderRadius: 2.5, background: 'linear-gradient(135deg, #7C5CFC, #A855F7)', color: '#FFFFFF' }}>
              <BarChart3 size={22} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: 'Outfit', color: '#1F2937' }}>
                Activity & Focus Performance Trend
              </Typography>
              <Typography variant="body2" sx={{ color: '#6B7280' }}>
                Interactive multi-metric analysis of completed tasks, focus duration, and energy score.
              </Typography>
            </Box>
          </Box>

          {/* Time Range Toggle */}
          <Box className="neumo-inset" sx={{ p: 0.5, borderRadius: 3, display: 'flex', gap: 0.5, backgroundColor: '#F8F4FF' }}>
            <button
              onClick={() => setTimeRange('weekly')}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                border: 'none',
                backgroundColor: timeRange === 'weekly' ? '#7C5CFC' : 'transparent',
                color: timeRange === 'weekly' ? '#FFFFFF' : '#6B7280',
                fontWeight: 800,
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Weekly
            </button>
            <button
              onClick={() => setTimeRange('monthly')}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                border: 'none',
                backgroundColor: timeRange === 'monthly' ? '#7C5CFC' : 'transparent',
                color: timeRange === 'monthly' ? '#FFFFFF' : '#6B7280',
                fontWeight: 800,
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Monthly
            </button>
          </Box>
        </Box>

        {/* 2D Interactive Composed Chart */}
        <Box sx={{ width: '100%', height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="barColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7C5CFC" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#A855F7" stopOpacity={0.5} />
                </linearGradient>
                <linearGradient id="areaEnergy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="#6B7280" tickLine={false} axisLine={{ stroke: 'rgba(124, 92, 252, 0.15)' }} />
              <YAxis stroke="#6B7280" tickLine={false} axisLine={{ stroke: 'rgba(124, 92, 252, 0.15)' }} />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: 'rgba(124, 92, 252, 0.2)',
                  borderRadius: 14,
                  boxShadow: '0 10px 25px rgba(124, 92, 252, 0.12)',
                  color: '#1F2937'
                }}
              />
              <Area type="monotone" dataKey="energyScore" name="Energy Score (%)" stroke="#22C55E" fillOpacity={1} fill="url(#areaEnergy)" strokeWidth={2.5} />
              <Bar dataKey="completed" name="Tasks Completed" fill="url(#barColor)" radius={[6, 6, 0, 0]} barSize={28} />
              <Line type="monotone" dataKey="focusHours" name="Focus Hours" stroke="#FF7A59" strokeWidth={3} dot={{ r: 5, fill: '#FF7A59' }} activeDot={{ r: 8 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </Box>

        {/* Legend Indicator */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center', mt: 2, pt: 2, borderTop: '1px solid rgba(124, 92, 252, 0.1)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: 1, backgroundColor: '#7C5CFC' }} />
            <Typography variant="caption" sx={{ color: '#1F2937', fontWeight: 700 }}>Tasks Completed (Bars)</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 3, borderRadius: 2, backgroundColor: '#FF7A59' }} />
            <Typography variant="caption" sx={{ color: '#1F2937', fontWeight: 700 }}>Focus Duration (Hours Line)</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: 'rgba(34, 197, 94, 0.25)', border: '1.5px solid #22C55E' }} />
            <Typography variant="caption" sx={{ color: '#1F2937', fontWeight: 700 }}>Energy Index Area (%)</Typography>
          </Box>
        </Box>
      </NeumoCard>

      {/* Grid: 2D Radar Life Balance & Hourly Distribution */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3 }}>
        {/* 2D Lifestyle Radar Balance Chart */}
        <NeumoCard sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Box sx={{ p: 1, borderRadius: 2.5, backgroundColor: 'rgba(168, 85, 247, 0.12)', color: '#A855F7' }}>
              <Target size={20} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: 'Outfit', color: '#1F2937' }}>
                Lifestyle Balance Radar
              </Typography>
              <Typography variant="body2" sx={{ color: '#6B7280' }}>
                Ideal target vs actual time allocation across core life categories.
              </Typography>
            </Box>
          </Box>

          <Box sx={{ width: '100%', height: 260, my: 'auto' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={RADAR_BALANCE_DATA}>
                <PolarGrid stroke="rgba(124, 92, 252, 0.15)" />
                <PolarAngleAxis dataKey="category" stroke="#6B7280" tick={{ fill: '#1F2937', fontSize: 11, fontWeight: 700 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#9CA3AF" />
                <Radar name="Current Allocation" dataKey="current" stroke="#7C5CFC" fill="#7C5CFC" fillOpacity={0.4} />
                <Radar name="Target Optimal" dataKey="ideal" stroke="#22C55E" fill="#22C55E" fillOpacity={0.15} strokeDasharray="3 3" />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: 'rgba(124, 92, 252, 0.2)',
                    borderRadius: 14,
                    color: '#1F2937'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, pt: 1.5, borderTop: '1px solid rgba(124, 92, 252, 0.1)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#7C5CFC' }} />
              <Typography variant="caption" sx={{ color: '#1F2937', fontWeight: 700 }}>Actual Allocation</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', border: '1.5px dashed #22C55E' }} />
              <Typography variant="caption" sx={{ color: '#1F2937', fontWeight: 700 }}>Target Benchmark</Typography>
            </Box>
          </Box>
        </NeumoCard>

        {/* 2D Hourly Focus Profile Bar Chart */}
        <NeumoCard sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Box sx={{ p: 1, borderRadius: 2.5, backgroundColor: '#F4EEFF', color: '#7C5CFC' }}>
              <Activity size={20} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: 'Outfit', color: '#1F2937' }}>
                Hourly Focus & Energy Distribution
              </Typography>
              <Typography variant="body2" sx={{ color: '#6B7280' }}>
                Identifies peak cognitive output hours for optimal task scheduling.
              </Typography>
            </Box>
          </Box>

          <Box sx={{ width: '100%', height: 260, my: 'auto' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={HOURLY_PRODUCTIVITY} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="hourlyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7C5CFC" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#6366F1" stopOpacity={0.4} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" stroke="#6B7280" tickLine={false} axisLine={{ stroke: 'rgba(124, 92, 252, 0.15)' }} />
                <YAxis stroke="#6B7280" tickLine={false} axisLine={{ stroke: 'rgba(124, 92, 252, 0.15)' }} />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: 'rgba(124, 92, 252, 0.2)',
                    borderRadius: 14,
                    color: '#1F2937'
                  }}
                />
                <Bar dataKey="focus" name="Focus Level (%)" fill="url(#hourlyGrad)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 1.5, borderTop: '1px solid rgba(124, 92, 252, 0.1)' }}>
            <Typography variant="caption" sx={{ color: '#6B7280', fontWeight: 600 }}>
              Highest Output Window: <strong style={{ color: '#7C5CFC' }}>10:00 AM (95%)</strong>
            </Typography>
            <Chip label="Optimal for Deep Work" size="small" sx={{ backgroundColor: '#F4EEFF', color: '#7C5CFC', fontWeight: 800, height: 22, fontSize: '0.7rem' }} />
          </Box>
        </NeumoCard>
      </Box>

      {/* Category Time Distribution Interactive 2D Donut Chart */}
      <NeumoCard sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ p: 1, borderRadius: 2.5, backgroundColor: 'rgba(34, 197, 94, 0.12)', color: '#16A34A' }}>
              <PieIcon size={20} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: 'Outfit', color: '#1F2937' }}>
                Time Distribution by Life Category
              </Typography>
              <Typography variant="body2" sx={{ color: '#6B7280' }}>
                Proportional breakdown of total tracked hours across activity domains.
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1.2fr' }, gap: 3, alignItems: 'center' }}>
          {/* Donut Graphic */}
          <Box sx={{ width: '100%', height: 240, position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CATEGORY_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {CATEGORY_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={3} />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: 'rgba(124, 92, 252, 0.2)',
                    borderRadius: 14,
                    color: '#1F2937'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Donut Label */}
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                pointerEvents: 'none'
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: 'Outfit', color: '#1F2937', lineHeight: 1 }}>
                41.0
              </Typography>
              <Typography variant="caption" sx={{ color: '#6B7280', fontWeight: 700, fontSize: '0.7rem' }}>
                Total Hours
              </Typography>
            </Box>
          </Box>

          {/* Interactive Legend & Breakdown Items */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {CATEGORY_DISTRIBUTION.map((cat, idx) => (
              <Box
                key={idx}
                className="neumo-inset"
                sx={{
                  p: 1.5,
                  borderRadius: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid rgba(124, 92, 252, 0.12)',
                  transition: 'all 0.2s ease',
                  '&:hover': { transform: 'translateX(4px)', borderColor: cat.color }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: 1, backgroundColor: cat.color }} />
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#1F2937' }}>
                    {cat.name}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: cat.color }}>
                    {cat.value} hrs
                  </Typography>
                  <Chip
                    label={cat.percentage}
                    size="small"
                    sx={{
                      backgroundColor: `${cat.color}18`,
                      color: cat.color,
                      fontWeight: 800,
                      height: 22,
                      fontSize: '0.7rem'
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </NeumoCard>
    </Box>
  );
};

export default AnalyticsWidget;
