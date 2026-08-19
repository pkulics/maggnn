
import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

// Mock data representing a life journey
const data = [
  { age: 0, score: 50 },
  { age: 5, score: 55 },
  { age: 10, score: 60 },
  { age: 15, score: 58 },
  { age: 20, score: 65 }, // Youth peak
  { age: 25, score: 62 },
  { age: 30, score: 75 }, // Career start
  { age: 35, score: 70 },
  { age: 40, score: 85 }, // Prime
  { age: 45, score: 80 },
  { age: 50, score: 88 }, // Peak wisdom
  { age: 55, score: 85 },
  { age: 60, score: 90 }, // Golden age
  { age: 65, score: 85 },
  { age: 70, score: 80 },
  { age: 75, score: 75 },
  { age: 80, score: 70 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-raised/90 backdrop-blur-sm p-3 rounded-lg shadow-xl border border-border-subtle">
        <p className="text-sm font-medium text-content-secondary">Age {label}</p>
        <p className="text-lg font-bold text-brand-text">Luck: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function LifeTrendChart() {
  return (
    <div className="w-full h-[400px] bg-surface-raised/60 backdrop-blur-sm rounded-xl border border-border-subtle shadow-xl p-6 relative overflow-hidden">
        {/* Decorative Title */}
        <div className="absolute top-6 left-8 z-10">
            <h3 className="text-lg font-serif font-bold text-content-primary">Life Trajectory</h3>
            <p className="text-sm text-content-secondary">Personal Growth Trends</p>
        </div>

        {/* Chart */}
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 50,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(var(--sys-brand-main))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="oklch(var(--sys-brand-main))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            {/* Subtle Grid */}
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(var(--sys-border-subtle))" />
            
            {/* Axes - Minimalist */}
            <XAxis 
                dataKey="age" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'oklch(var(--sys-content-muted))', fontSize: 12 }}
                dy={10}
            />
            <YAxis 
                hide={true} 
                domain={[40, 100]}
            />
            
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'oklch(var(--sys-brand-main))', strokeWidth: 1, strokeDasharray: '5 5' }} />
            
            {/* The Curve */}
            <Area 
                type="monotone" 
                dataKey="score" 
                stroke="oklch(var(--sys-brand-main))" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorScore)" 
                animationDuration={2000}
                animationEasing="ease-in-out"
            />
            
            {/* Reference Line for 'Average' */}
            <ReferenceLine y={60} stroke="oklch(var(--sys-border-base))" strokeDasharray="3 3" />
          </AreaChart>
        </ResponsiveContainer>

    </div>
  );
}
