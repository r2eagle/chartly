import React from 'react';
import { Settings, BarChart3, Eye } from 'lucide-react';
import { ChartTypeSelector } from './ChartTypeSelector';
import { DataEditor } from './DataEditor';
import { StyleEditor } from './StyleEditor';
import { PreviewPanel } from './PreviewPanel';
import { useChartConfig } from '../hooks/useChartConfig';
import { useWebflow } from '../hooks/useWebflow';

export const App: React.FC = () => {
  const chartConfig = useChartConfig();
  const { insertChart } = useWebflow();

  const handleInsertChart = async () => {
    try {
      await insertChart(chartConfig.config);
    } catch (error) {
      console.error('Failed to insert chart:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-wf-bg-primary">
      {/* Header - Webflow Dark Theme */}
      <div className="bg-wf-bg-secondary border-b border-wf-border px-wf-2 py-wf-2">
        <h1 className="text-wf-base font-semibold text-wf-text-primary">ChartFlow</h1>
      </div>

      {/* Two-Column Layout */}
      <div className="flex-1 grid grid-cols-2 gap-0 overflow-hidden">
        {/* Left Column: Settings (Scrollable) */}
        <div className="overflow-auto custom-scrollbar border-r border-wf-border">
          {/* Chart Type Section */}
          <div className="border-b border-wf-border">
            <div className="sticky top-0 bg-wf-bg-secondary px-wf-2 py-wf-2 border-b border-wf-border z-10">
              <div className="flex items-center gap-2">
                <BarChart3 size={14} className="text-wf-action-primary" />
                <h2 className="text-wf-sm font-semibold text-wf-text-primary">Chart Type</h2>
              </div>
            </div>
            <div className="px-wf-2 py-wf-3">
              <ChartTypeSelector
                selectedType={chartConfig.config.type}
                onSelectType={chartConfig.updateChartType}
              />
            </div>
          </div>

          {/* Data Section */}
          <div className="border-b border-wf-border">
            <div className="sticky top-0 bg-wf-bg-secondary px-wf-2 py-wf-2 border-b border-wf-border z-10">
              <div className="flex items-center gap-2">
                <Settings size={14} className="text-wf-action-primary" />
                <h2 className="text-wf-sm font-semibold text-wf-text-primary">Chart Data</h2>
              </div>
            </div>
            <div className="px-wf-2 py-wf-3">
              <DataEditor
                data={chartConfig.config.data}
                chartType={chartConfig.config.type}
                onDataChange={chartConfig.updateChartData}
                onAddDataPoint={chartConfig.addDataPoint}
                onRemoveDataPoint={chartConfig.removeDataPoint}
              />
            </div>
          </div>

          {/* Style Section */}
          <div>
            <div className="sticky top-0 bg-wf-bg-secondary px-wf-2 py-wf-2 border-b border-wf-border z-10">
              <div className="flex items-center gap-2">
                <Settings size={14} className="text-wf-action-primary" />
                <h2 className="text-wf-sm font-semibold text-wf-text-primary">Chart Style</h2>
              </div>
            </div>
            <div className="px-wf-2 py-wf-3">
              <StyleEditor
                config={chartConfig.config}
                onOptionsChange={chartConfig.updateChartOptions}
                onTitleChange={chartConfig.updateChartTitle}
                onColorsChange={chartConfig.updateDatasetColors}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Preview (Sticky) */}
        <div className="overflow-auto custom-scrollbar bg-wf-bg-primary">
          <div className="sticky top-0 bg-wf-bg-secondary px-wf-2 py-wf-2 border-b border-wf-border">
            <div className="flex items-center gap-2">
              <Eye size={14} className="text-wf-action-primary" />
              <h2 className="text-wf-sm font-semibold text-wf-text-primary">Live Preview</h2>
            </div>
          </div>
          <div className="px-wf-2 py-wf-3">
            <PreviewPanel config={chartConfig.config} />
          </div>
        </div>
      </div>

      {/* Footer Actions - Webflow Dark Theme */}
      <div className="bg-wf-bg-secondary border-t border-wf-border px-wf-2 py-wf-2 flex gap-wf-2">
        <button
          onClick={() => chartConfig.resetConfig()}
          className="flex-1 wf-btn wf-btn-secondary"
        >
          Reset
        </button>
        <button
          onClick={handleInsertChart}
          className="flex-1 wf-btn wf-btn-primary"
        >
          Insert Chart
        </button>
      </div>
    </div>
  );
};