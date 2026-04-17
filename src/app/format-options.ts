export type Abbreviation = 'none' | 'auto' | 'thousands' | 'millions';
export type LabelPosition = 'above' | 'top' | 'middle' | 'bottom' | 'below';
export type ScaleMode = 'auto' | 'nice' | 'zero' | 'custom';

export interface NumberFormat {
  decimals: number;
  abbreviation: Abbreviation;
  prefix: string;
  suffix: string;
  thousandsSeparator: boolean;
  fontSize: number;
}

export interface AxisFormat extends NumberFormat {
  show: boolean;
  scaleMode: ScaleMode;
  min: number | null;
  max: number | null;
}

export interface DataLabelFormat extends NumberFormat {
  show: boolean;
  position: LabelPosition;
  rotation: number;
}

export interface DataLabelPlacement {
  anchor: 'start' | 'center' | 'end';
  align: 'start' | 'center' | 'end';
}

export function placementFor(position: LabelPosition): DataLabelPlacement {
  switch (position) {
    case 'above':  return { anchor: 'end',    align: 'end'    };
    case 'top':    return { anchor: 'end',    align: 'start'  };
    case 'middle': return { anchor: 'center', align: 'center' };
    case 'bottom': return { anchor: 'start',  align: 'end'    };
    case 'below':  return { anchor: 'start',  align: 'start'  };
  }
}

export interface FormatOptions {
  axis: AxisFormat;
  dataLabels: DataLabelFormat;
}

export const DEFAULT_AXIS_FORMAT: AxisFormat = {
  decimals: 1,
  abbreviation: 'auto',
  prefix: '',
  suffix: '',
  thousandsSeparator: true,
  fontSize: 10,
  show: true,
  scaleMode: 'auto',
  min: null,
  max: null,
};

export const DEFAULT_DATA_LABEL_FORMAT: DataLabelFormat = {
  decimals: 1,
  abbreviation: 'auto',
  prefix: '',
  suffix: '',
  thousandsSeparator: true,
  fontSize: 10,
  show: true,
  position: 'above',
  rotation: 0,
};

export const DEFAULT_FORMAT_OPTIONS: FormatOptions = {
  axis: { ...DEFAULT_AXIS_FORMAT },
  dataLabels: { ...DEFAULT_DATA_LABEL_FORMAT },
};

export function formatValue(raw: number, fmt: NumberFormat): string {
  if (raw === null || raw === undefined || isNaN(raw)) return '';

  let value = raw;
  let unit = '';
  const abs = Math.abs(raw);

  if (fmt.abbreviation === 'thousands' || (fmt.abbreviation === 'auto' && abs >= 1_000 && abs < 1_000_000)) {
    value = raw / 1_000;
    unit = 'k';
  } else if (fmt.abbreviation === 'millions' || (fmt.abbreviation === 'auto' && abs >= 1_000_000)) {
    value = raw / 1_000_000;
    unit = 'm';
  }

  const fixed = value.toFixed(fmt.decimals);
  let [intPart, decPart] = fixed.split('.');

  if (fmt.thousandsSeparator && !unit) {
    intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  const number = decPart !== undefined ? `${intPart}.${decPart}` : intPart;
  return `${fmt.prefix}${number}${unit}${fmt.suffix}`;
}
