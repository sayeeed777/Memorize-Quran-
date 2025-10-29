import React from 'react';

interface BarChartProps {
  data: { label: string; value: number }[];
}

export const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.value), 1); // Avoid division by zero
  const chartHeight = 150;
  const barWidth = 30;
  const barMargin = 15;
  const chartWidth = data.length * (barWidth + barMargin);

  return (
    <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight + 30}`} className="min-w-[300px]">
        {data.map((d, i) => {
            const barHeight = (d.value / maxValue) * chartHeight;
            const x = i * (barWidth + barMargin);
            const y = chartHeight - barHeight;
            return (
            <g key={d.label}>
                <rect 
                x={x} 
                y={y} 
                width={barWidth} 
                height={barHeight} 
                className="fill-current text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                rx="6"
                />
                <text 
                x={x + barWidth / 2} 
                y={chartHeight + 20} 
                textAnchor="middle" 
                className="text-xs fill-current text-gray-500 dark:text-gray-400"
                >
                {d.label}
                </text>
                 <text 
                x={x + barWidth / 2} 
                y={y - 5}
                textAnchor="middle" 
                className="text-xs font-bold fill-current text-gray-900 dark:text-white"
                >
                {d.value > 0 ? d.value : ''}
                </text>
            </g>
            );
        })}
        </svg>
    </div>
  );
};