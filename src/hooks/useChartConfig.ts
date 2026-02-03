import { useState, useCallback } from 'react';
import { ChartConfig, ChartData, ChartOptions } from '../types/chart.types';
import { getDefaultChartConfig } from '../utils/chartDefaults';

export const useChartConfig = (initialType: ChartConfig['type'] = 'bar') => {
  const [config, setConfig] = useState<ChartConfig>(() =>
    getDefaultChartConfig(initialType)
  );

  const updateChartType = useCallback((type: ChartConfig['type']) => {
    setConfig(prev => ({
      ...prev,
      type,
      updatedAt: new Date().toISOString()
    }));
  }, []);

  const updateChartData = useCallback((data: Partial<ChartData>) => {
    setConfig(prev => ({
      ...prev,
      data: {
        ...prev.data,
        ...data
      },
      updatedAt: new Date().toISOString()
    }));
  }, []);

  const updateChartOptions = useCallback((options: Partial<ChartOptions>) => {
    setConfig(prev => ({
      ...prev,
      options: {
        ...prev.options,
        ...options,
        plugins: {
          ...prev.options.plugins,
          ...(options.plugins || {})
        },
        scales: {
          ...prev.options.scales,
          ...(options.scales || {})
        }
      },
      updatedAt: new Date().toISOString()
    }));
  }, []);

  const updateChartTitle = useCallback((title: string) => {
    setConfig(prev => ({
      ...prev,
      title,
      options: {
        ...prev.options,
        plugins: {
          ...prev.options.plugins,
          title: {
            ...prev.options.plugins.title,
            text: title
          }
        }
      },
      updatedAt: new Date().toISOString()
    }));
  }, []);

  const addDataPoint = useCallback((label: string, values: number[]) => {
    setConfig(prev => {
      const newLabels = [...prev.data.labels, label];
      const newDatasets = prev.data.datasets.map((dataset, index) => ({
        ...dataset,
        data: [...dataset.data, values[index] || 0]
      }));

      return {
        ...prev,
        data: {
          labels: newLabels,
          datasets: newDatasets
        },
        updatedAt: new Date().toISOString()
      };
    });
  }, []);

  const removeDataPoint = useCallback((index: number) => {
    setConfig(prev => {
      const newLabels = prev.data.labels.filter((_, i) => i !== index);
      const newDatasets = prev.data.datasets.map(dataset => ({
        ...dataset,
        data: dataset.data.filter((_, i) => i !== index)
      }));

      return {
        ...prev,
        data: {
          labels: newLabels,
          datasets: newDatasets
        },
        updatedAt: new Date().toISOString()
      };
    });
  }, []);

  const updateDatasetColors = useCallback((datasetIndex: number, backgroundColor: string | string[], borderColor?: string | string[]) => {
    setConfig(prev => {
      const newDatasets = [...prev.data.datasets];
      newDatasets[datasetIndex] = {
        ...newDatasets[datasetIndex],
        backgroundColor,
        borderColor: borderColor || backgroundColor
      };

      return {
        ...prev,
        data: {
          ...prev.data,
          datasets: newDatasets
        },
        updatedAt: new Date().toISOString()
      };
    });
  }, []);

  const resetConfig = useCallback((type?: ChartConfig['type']) => {
    setConfig(getDefaultChartConfig(type || config.type));
  }, [config.type]);

  return {
    config,
    updateChartType,
    updateChartData,
    updateChartOptions,
    updateChartTitle,
    addDataPoint,
    removeDataPoint,
    updateDatasetColors,
    resetConfig
  };
};