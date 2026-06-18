import type { CardKind, YeelightCardConfig } from "./types";

export function gridOptions(kind: CardKind, config: YeelightCardConfig | undefined): Record<string, number> {
  const fallback = kind === "device" ? { columns: 6, rows: 3, min_columns: 3, min_rows: 2 } : { columns: 6, rows: 2, min_columns: 3, min_rows: 2 };
  return { ...fallback, ...numericGridOptions(config?.grid_options) };
}

export function iconStyle(config: YeelightCardConfig): string {
  const height = cssLength(config.icon_height);
  return height ? `width:${height};height:${height}` : "";
}

function numericGridOptions(options: Record<string, unknown> | undefined): Record<string, number> {
  if (!options) {
    return {};
  }
  return Object.fromEntries(Object.entries(options).filter(([, value]) => typeof value === "number" && Number.isFinite(value) && value > 0)) as Record<string, number>;
}

function cssLength(value: string | undefined): string {
  if (!value) {
    return "";
  }
  return /^\d+(\.\d+)?$/.test(value) ? `${value}px` : /^[\w\s.%(),#-]+$/.test(value) ? value : "";
}
