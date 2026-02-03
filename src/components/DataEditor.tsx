import React, { useState } from 'react';
import { X } from 'lucide-react';
import { ChartData, ChartConfig } from '../types/chart.types';

interface Props {
  data: ChartData;
  chartType: ChartConfig['type'];
  onDataChange: (data: Partial<ChartData>) => void;
  onAddDataPoint: (label: string, values: number[]) => void;
  onRemoveDataPoint: (index: number) => void;
}

export const DataEditor: React.FC<Props> = ({
  data,
  chartType,
  onDataChange,
  onAddDataPoint,
  onRemoveDataPoint
}) => {
  const [newLabel, setNewLabel] = useState('');
  const [newValue, setNewValue] = useState('');

  const handleAddDataPoint = () => {
    if (newLabel && newValue) {
      const value = parseFloat(newValue);
      if (!isNaN(value)) {
        onAddDataPoint(newLabel, [value]);
        setNewLabel('');
        setNewValue('');
      }
    }
  };

  const handleLabelChange = (index: number, value: string) => {
    const newLabels = [...data.labels];
    newLabels[index] = value;
    onDataChange({ labels: newLabels });
  };

  const handleValueChange = (datasetIndex: number, valueIndex: number, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      const newDatasets = [...data.datasets];
      newDatasets[datasetIndex] = {
        ...newDatasets[datasetIndex],
        data: newDatasets[datasetIndex].data.map((v, i) =>
          i === valueIndex ? numValue : v
        )
      };
      onDataChange({ datasets: newDatasets });
    }
  };

  const handleDatasetLabelChange = (datasetIndex: number, label: string) => {
    const newDatasets = [...data.datasets];
    newDatasets[datasetIndex] = {
      ...newDatasets[datasetIndex],
      label
    };
    onDataChange({ datasets: newDatasets });
  };

  return (
    <div className="space-y-wf-2">
      {/* Dataset Label */}
      <div>
        <label className="block text-wf-sm font-semibold text-wf-text-primary mb-wf-1">
          Dataset Name
        </label>
        <input
          type="text"
          value={data.datasets[0]?.label || ''}
          onChange={(e) => handleDatasetLabelChange(0, e.target.value)}
          className="wf-input"
          placeholder="e.g., Sales Data"
        />
      </div>

      {/* Data Points */}
      <div>
        <label className="block text-wf-sm font-semibold text-wf-text-primary mb-wf-1">
          Data Points
        </label>
        <div className="space-y-1.5">
          {data.labels.map((label, index) => (
            <div key={index} className="flex items-center gap-1.5">
              <input
                type="text"
                value={label}
                onChange={(e) => handleLabelChange(index, e.target.value)}
                className="flex-1 wf-input"
                placeholder="Label"
              />
              <input
                type="number"
                value={data.datasets[0]?.data[index] || 0}
                onChange={(e) => handleValueChange(0, index, e.target.value)}
                className="w-24 wf-input"
                placeholder="Value"
              />
              <button
                onClick={() => onRemoveDataPoint(index)}
                className="p-1 text-wf-text-secondary hover:text-wf-text-primary bg-wf-bg-tertiary hover:bg-wf-bg-secondary rounded-wf transition-all"
                aria-label="Remove data point"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add New Data Point */}
      <div className="border-t border-wf-border pt-wf-2">
        <label className="block text-wf-sm font-semibold text-wf-text-primary mb-wf-1">
          Add Data Point
        </label>
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            className="flex-1 wf-input"
            placeholder="Label"
          />
          <input
            type="number"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            className="w-24 wf-input"
            placeholder="Value"
          />
          <button
            onClick={handleAddDataPoint}
            className="wf-btn wf-btn-primary"
          >
            Add
          </button>
        </div>
      </div>

      {/* Data Summary */}
      <div className="p-wf-2 bg-wf-bg-tertiary rounded-wf text-wf-sm text-wf-text-primary flex justify-between">
        <span><strong className="text-wf-text-primary">Points:</strong> {data.labels.length}</span>
        {data.datasets[0] && (
          <span><strong className="text-wf-text-primary">Sum:</strong> {data.datasets[0].data.reduce((a, b) => a + b, 0).toFixed(2)}</span>
        )}
      </div>
    </div>
  );
};