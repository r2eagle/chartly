export interface ColorPalette {
  id: string;
  name: string;
  colors: string[];
}

export const COLOR_PALETTES: ColorPalette[] = [
  {
    id: 'default',
    name: 'Default',
    colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']
  },
  {
    id: 'pastel',
    name: 'Pastel',
    colors: ['#A5B4FC', '#86EFAC', '#FDE68A', '#FCA5A5', '#C4B5FD', '#F9A8D4']
  },
  {
    id: 'vivid',
    name: 'Vivid',
    colors: ['#2563EB', '#059669', '#D97706', '#DC2626', '#7C3AED', '#DB2777']
  },
  {
    id: 'ocean',
    name: 'Ocean',
    colors: ['#0891B2', '#06B6D4', '#22D3EE', '#67E8F9', '#A5F3FC', '#CFFAFE']
  },
  {
    id: 'sunset',
    name: 'Sunset',
    colors: ['#DC2626', '#EA580C', '#F97316', '#FB923C', '#FDBA74', '#FED7AA']
  },
  {
    id: 'forest',
    name: 'Forest',
    colors: ['#14532D', '#166534', '#15803D', '#16A34A', '#22C55E', '#4ADE80']
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    colors: ['#18181B', '#3F3F46', '#52525B', '#71717A', '#A1A1AA', '#D4D4D8']
  },
  {
    id: 'rainbow',
    name: 'Rainbow',
    colors: ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#06B6D4', '#3B82F6', '#8B5CF6']
  }
];

export const getColorPalette = (paletteId: string): ColorPalette => {
  return COLOR_PALETTES.find(p => p.id === paletteId) || COLOR_PALETTES[0];
};

export const applyColorPalette = (datasetCount: number, paletteId: string): string[] => {
  const palette = getColorPalette(paletteId);
  const colors: string[] = [];

  for (let i = 0; i < datasetCount; i++) {
    colors.push(palette.colors[i % palette.colors.length]);
  }

  return colors;
};