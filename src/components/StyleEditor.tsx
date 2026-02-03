import React, { useState } from 'react';
import { ChartConfig, ChartOptions } from '../types/chart.types';
import { COLOR_PALETTES, applyColorPalette } from '../utils/colorPalettes';

interface Props {
  config: ChartConfig;
  onOptionsChange: (options: Partial<ChartOptions>) => void;
  onTitleChange: (title: string) => void;
  onColorsChange: (datasetIndex: number, backgroundColor: string | string[], borderColor?: string | string[]) => void;
}

export const StyleEditor: React.FC<Props> = ({
  config,
  onOptionsChange,
  onTitleChange,
  onColorsChange
}) => {
  const [selectedPalette, setSelectedPalette] = useState('default');

  const handlePaletteChange = (paletteId: string) => {
    setSelectedPalette(paletteId);
    const colors = applyColorPalette(config.data.labels.length, paletteId);

    // For pie and doughnut charts, apply array of colors
    if (config.type === 'pie' || config.type === 'doughnut') {
      onColorsChange(0, colors, colors);
    } else {
      // For bar and line charts, use the first color
      onColorsChange(0, colors[0], colors[0]);
    }
  };

  const handleLegendPositionChange = (position: 'top' | 'bottom' | 'left' | 'right') => {
    onOptionsChange({
      plugins: {
        ...config.options.plugins,
        legend: {
          ...config.options.plugins.legend,
          position
        }
      }
    });
  };

  const handleLegendToggle = (display: boolean) => {
    onOptionsChange({
      plugins: {
        ...config.options.plugins,
        legend: {
          ...config.options.plugins.legend,
          display
        }
      }
    });
  };

  const handleGridToggle = (axis: 'x' | 'y', display: boolean) => {
    onOptionsChange({
      scales: {
        ...config.options.scales,
        [axis]: {
          ...config.options.scales?.[axis],
          grid: {
            display
          }
        }
      }
    });
  };

  const handleAxisColorChange = (axis: 'x' | 'y', colorType: 'border' | 'labels', color: string) => {
    if (colorType === 'border') {
      onOptionsChange({
        scales: {
          ...config.options.scales,
          [axis]: {
            ...config.options.scales?.[axis],
            grid: {
              ...config.options.scales?.[axis]?.grid,
              borderColor: color,
              tickColor: color
            }
          }
        }
      });
    } else {
      onOptionsChange({
        scales: {
          ...config.options.scales,
          [axis]: {
            ...config.options.scales?.[axis],
            ticks: {
              ...config.options.scales?.[axis]?.ticks,
              color: color
            }
          }
        }
      });
    }
  };

  return (
    <div className="space-y-wf-3">
      <div>
        <h2 className="text-wf-sm font-semibold text-wf-text-primary mb-wf-1">Chart Style</h2>
        <p className="text-wf-sm text-wf-text-secondary">Customize appearance</p>
      </div>

      {/* Chart Title */}
      <div>
        <label className="block text-wf-sm font-semibold text-wf-text-primary mb-wf-1">
          Chart Title
        </label>
        <input
          type="text"
          value={config.title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="wf-input"
          placeholder="Enter chart title"
        />
      </div>

      {/* Color Palette - Compact */}
      <div>
        <label className="block text-wf-sm font-semibold text-wf-text-primary mb-wf-1">
          Color Palette
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {COLOR_PALETTES.map(palette => (
            <button
              key={palette.id}
              onClick={() => handlePaletteChange(palette.id)}
              className={`
                p-1.5 rounded-wf border transition-all
                ${selectedPalette === palette.id
                  ? 'border-wf-action-primary'
                  : 'border-wf-border hover:border-wf-border-subtle'
                }
              `}
            >
              <div className="flex items-center gap-1.5">
                <div className="flex gap-0.5">
                  {palette.colors.slice(0, 3).map((color, i) => (
                    <div
                      key={i}
                      className="w-3 h-3 rounded-sm"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-wf-text-primary truncate">{palette.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Legend Settings - Compact */}
      <div>
        <label className="block text-wf-sm font-semibold text-wf-text-primary mb-wf-1">
          Legend
        </label>
        <div className="space-y-1">
          <label className="flex items-center gap-1.5">
            <input
              type="checkbox"
              checked={config.options.plugins.legend.display}
              onChange={(e) => handleLegendToggle(e.target.checked)}
              className="wf-checkbox"
            />
            <span className="text-wf-sm text-wf-text-primary">Show Legend</span>
          </label>

          {config.options.plugins.legend.display && (
            <select
              value={config.options.plugins.legend.position}
              onChange={(e) => handleLegendPositionChange(e.target.value as any)}
              className="wf-select"
            >
              <option value="top">Top</option>
              <option value="bottom">Bottom</option>
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
          )}
        </div>
      </div>

      {/* Grid Settings (for bar and line charts) - Compact */}
      {(config.type === 'bar' || config.type === 'line') && (
        <div>
          <label className="block text-wf-sm font-semibold text-wf-text-primary mb-wf-1">
            Grid Lines
          </label>
          <div className="space-y-1">
            <label className="flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={config.options.scales?.x?.grid?.display ?? false}
                onChange={(e) => handleGridToggle('x', e.target.checked)}
                className="wf-checkbox"
              />
              <span className="text-wf-sm text-wf-text-primary">X-axis</span>
            </label>
            <label className="flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={config.options.scales?.y?.grid?.display ?? true}
                onChange={(e) => handleGridToggle('y', e.target.checked)}
                className="wf-checkbox"
              />
              <span className="text-wf-sm text-wf-text-primary">Y-axis</span>
            </label>
          </div>
        </div>
      )}

      {/* Axis Colors (for bar and line charts) - Compact */}
      {(config.type === 'bar' || config.type === 'line') && (
        <div>
          <label className="block text-wf-sm font-semibold text-wf-text-primary mb-wf-1">
            Axis Colors
          </label>
          <div className="space-y-2">
            {/* X-axis colors */}
            <div>
              <span className="text-wf-xs text-wf-text-secondary">X-Axis</span>
              <div className="grid grid-cols-2 gap-1.5 mt-1">
                <div>
                  <label className="text-wf-xs text-wf-text-primary">Line</label>
                  <input
                    type="color"
                    value={config.options.scales?.x?.grid?.borderColor || '#666666'}
                    onChange={(e) => handleAxisColorChange('x', 'border', e.target.value)}
                    className="wf-color-input w-full h-8"
                  />
                </div>
                <div>
                  <label className="text-wf-xs text-wf-text-primary">Labels</label>
                  <input
                    type="color"
                    value={config.options.scales?.x?.ticks?.color || '#666666'}
                    onChange={(e) => handleAxisColorChange('x', 'labels', e.target.value)}
                    className="wf-color-input w-full h-8"
                  />
                </div>
              </div>
            </div>

            {/* Y-axis colors */}
            <div>
              <span className="text-wf-xs text-wf-text-secondary">Y-Axis</span>
              <div className="grid grid-cols-2 gap-1.5 mt-1">
                <div>
                  <label className="text-wf-xs text-wf-text-primary">Line</label>
                  <input
                    type="color"
                    value={config.options.scales?.y?.grid?.borderColor || '#666666'}
                    onChange={(e) => handleAxisColorChange('y', 'border', e.target.value)}
                    className="wf-color-input w-full h-8"
                  />
                </div>
                <div>
                  <label className="text-wf-xs text-wf-text-primary">Labels</label>
                  <input
                    type="color"
                    value={config.options.scales?.y?.ticks?.color || '#666666'}
                    onChange={(e) => handleAxisColorChange('y', 'labels', e.target.value)}
                    className="wf-color-input w-full h-8"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Display Settings - Compact */}
      <div>
        <label className="block text-wf-sm font-semibold text-wf-text-primary mb-wf-1">
          Display
        </label>
        <div className="space-y-1">
          <label className="flex items-center gap-1.5">
            <input
              type="checkbox"
              checked={config.options.responsive}
              onChange={(e) => onOptionsChange({ responsive: e.target.checked })}
              className="wf-checkbox"
            />
            <span className="text-wf-sm text-wf-text-primary">Responsive</span>
          </label>
          <label className="flex items-center gap-1.5">
            <input
              type="checkbox"
              checked={config.options.maintainAspectRatio}
              onChange={(e) => onOptionsChange({ maintainAspectRatio: e.target.checked })}
              className="wf-checkbox"
            />
            <span className="text-wf-sm text-wf-text-primary">Maintain Aspect Ratio</span>
          </label>
        </div>
      </div>
    </div>
  );
};