export interface ChartConfig {
  id: string;
  type: 'bar' | 'line' | 'pie' | 'doughnut';
  title: string;
  data: ChartData;
  options: ChartOptions;
  dataSource: DataSource;
  createdAt: string;
  updatedAt: string;
}

export interface ChartData {
  labels: string[];
  datasets: Dataset[];
}

export interface Dataset {
  label: string;
  data: number[];
  backgroundColor: string | string[];
  borderColor: string | string[];
  borderWidth: number;
}

export interface ChartOptions {
  responsive: boolean;
  maintainAspectRatio: boolean;
  plugins: {
    legend: LegendOptions;
    title: TitleOptions;
  };
  scales?: ScaleOptions;
}

export interface LegendOptions {
  display: boolean;
  position: 'top' | 'bottom' | 'left' | 'right';
  labels?: {
    font?: {
      size?: number;
      family?: string;
    };
  };
}

export interface TitleOptions {
  display: boolean;
  text?: string;
  font?: {
    size?: number;
    family?: string;
  };
}

export interface ScaleOptions {
  x?: {
    display?: boolean;
    grid?: {
      display?: boolean;
      color?: string;
      borderColor?: string;
      tickColor?: string;
    };
    ticks?: {
      color?: string;
    };
  };
  y?: {
    display?: boolean;
    grid?: {
      display?: boolean;
      color?: string;
      borderColor?: string;
      tickColor?: string;
    };
    ticks?: {
      color?: string;
    };
    beginAtZero?: boolean;
  };
}

export interface DataSource {
  type: 'manual' | 'cms';
  collectionId?: string;
  labelField?: string;
  valueField?: string;
  refreshInterval?: number;
}