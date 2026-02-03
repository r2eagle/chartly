import { BarChart3, LineChart, PieChart, Donut } from 'lucide-react';

export const CHART_TYPES = {
  bar: {
    id: 'bar',
    name: 'Bar Chart',
    icon: BarChart3,
    description: 'Great for comparing values across categories'
  },
  line: {
    id: 'line',
    name: 'Line Chart',
    icon: LineChart,
    description: 'Perfect for showing trends over time'
  },
  pie: {
    id: 'pie',
    name: 'Pie Chart',
    icon: PieChart,
    description: 'Ideal for showing parts of a whole'
  },
  doughnut: {
    id: 'doughnut',
    name: 'Doughnut Chart',
    icon: Donut,
    description: 'Like a pie chart with a hollow center'
  }
} as const;

export type ChartType = keyof typeof CHART_TYPES;