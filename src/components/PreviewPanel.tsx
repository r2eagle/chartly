import React from 'react';
import { Lightbulb } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  BarController,
  LineController,
  PieController,
  DoughnutController
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { ChartConfig } from '../types/chart.types';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  BarController,
  LineController,
  PieController,
  DoughnutController
);

interface Props {
  config: ChartConfig;
}

export const PreviewPanel: React.FC<Props> = ({ config }) => {
  return (
    <div className="space-y-wf-3">
      <div className="bg-wf-bg-secondary rounded-wf shadow-sm p-wf-2 border border-wf-border" style={{ minHeight: '240px' }}>
        <Chart
          type={config.type}
          data={config.data}
          options={config.options as any}
        />
      </div>

      {/* Chart Info - Compact Grid */}
      <div className="grid grid-cols-2 gap-1.5 text-wf-sm">
        <div className="p-1.5 bg-wf-bg-tertiary rounded-wf">
          <p className="text-[10px] text-wf-text-secondary">Type</p>
          <p className="font-semibold text-wf-text-primary leading-tight">
            {config.type.charAt(0).toUpperCase() + config.type.slice(1)}
          </p>
        </div>
        <div className="p-1.5 bg-wf-bg-tertiary rounded-wf">
          <p className="text-[10px] text-wf-text-secondary">Points</p>
          <p className="font-semibold text-wf-text-primary leading-tight">
            {config.data.labels.length}
          </p>
        </div>
        <div className="p-1.5 bg-wf-bg-tertiary rounded-wf col-span-2">
          <p className="text-[10px] text-wf-text-secondary">Updated</p>
          <p className="font-semibold text-wf-text-primary leading-tight">
            {new Date(config.updatedAt).toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* Tip - Compact */}
      <div className="border-t border-wf-border pt-wf-2">
        <div className="flex items-start gap-2">
          <Lightbulb size={14} className="text-wf-action-primary flex-shrink-0 mt-0.5" />
          <p className="text-wf-sm text-wf-text-secondary">
            Add Chart.js to Page Settings after inserting
          </p>
        </div>
      </div>
    </div>
  );
};