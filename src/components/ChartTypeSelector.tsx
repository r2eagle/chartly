import React from 'react';
import { ChartConfig } from '../types/chart.types';
import { CHART_TYPES } from '../constants/chartTypes';

interface Props {
  selectedType: ChartConfig['type'];
  onSelectType: (type: ChartConfig['type']) => void;
}

export const ChartTypeSelector: React.FC<Props> = ({ selectedType, onSelectType }) => {
  return (
    <div className="space-y-wf-2">
      <div className="grid grid-cols-2 gap-wf-2">
        {Object.values(CHART_TYPES).map(type => {
          const IconComponent = type.icon;
          return (
            <button
              key={type.id}
              onClick={() => onSelectType(type.id as ChartConfig['type'])}
              className={`
                p-wf-2 rounded-wf border transition-all text-left
                ${selectedType === type.id
                  ? 'border-wf-action-primary'
                  : 'border-wf-border hover:border-wf-action-primary'
                }
              `}
            >
              <div className="flex items-start gap-wf-2">
                <IconComponent
                  size={20}
                  className={selectedType === type.id ? 'text-wf-action-primary' : 'text-wf-text-secondary'}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-wf-sm font-semibold text-wf-text-primary leading-tight">{type.name}</h3>
                  <p className="text-[10px] text-wf-text-secondary mt-0.5 line-clamp-2">{type.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {selectedType && (
        <div className="p-wf-2 bg-wf-bg-tertiary rounded-wf border border-wf-action-primary">
          <p className="text-wf-sm text-wf-text-primary">
            <strong className="text-wf-action-primary">Selected:</strong> {CHART_TYPES[selectedType].name}
          </p>
        </div>
      )}
    </div>
  );
};