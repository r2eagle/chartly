import { ChartConfig, ChartData, ChartOptions } from '../types/chart.types';

export const DEFAULT_COLORS = [
  '#3B82F6', // blue
  '#10B981', // green
  '#F59E0B', // amber
  '#EF4444', // red
  '#8B5CF6', // violet
  '#EC4899', // pink
  '#06B6D4', // cyan
  '#F97316'  // orange
];

export const getDefaultChartData = (): ChartData => ({
  labels: ['January', 'February', 'March', 'April', 'May'],
  datasets: [
    {
      label: 'Sample Data',
      data: [65, 59, 80, 81, 56],
      backgroundColor: DEFAULT_COLORS[0],
      borderColor: DEFAULT_COLORS[0],
      borderWidth: 1
    }
  ]
});

export const getDefaultChartOptions = (): ChartOptions => ({
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: true,
      position: 'top'
    },
    title: {
      display: true,
      text: 'Chart Title'
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        display: true
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  }
});

export const getDefaultChartConfig = (type: ChartConfig['type']): ChartConfig => ({
  id: `chart-${Date.now()}`,
  type,
  title: 'New Chart',
  data: getDefaultChartData(),
  options: getDefaultChartOptions(),
  dataSource: {
    type: 'manual'
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});