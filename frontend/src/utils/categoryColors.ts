export interface CategoryMeta {
  color: string;
  bg: string;
  border: string;
  label: string;
  emoji: string;
}

export const CATEGORY_META: Record<string, CategoryMeta> = {
  groceries:      { color: '#66bb6a', bg: 'rgba(102,187,106,0.12)', border: 'rgba(102,187,106,0.25)', label: 'Groceries',      emoji: '🛒' },
  utilities:      { color: '#29b6f6', bg: 'rgba(41,182,246,0.12)',  border: 'rgba(41,182,246,0.25)',  label: 'Utilities',       emoji: '💡' },
  transportation: { color: '#ab47bc', bg: 'rgba(171,71,188,0.12)',  border: 'rgba(171,71,188,0.25)',  label: 'Transport',       emoji: '🚗' },
  entertainment:  { color: '#ec407a', bg: 'rgba(236,64,122,0.12)',  border: 'rgba(236,64,122,0.25)',  label: 'Entertainment',   emoji: '🎬' },
  healthcare:     { color: '#ef5350', bg: 'rgba(239,83,80,0.12)',   border: 'rgba(239,83,80,0.25)',   label: 'Healthcare',      emoji: '🏥' },
  education:      { color: '#5c6bc0', bg: 'rgba(92,107,192,0.12)', border: 'rgba(92,107,192,0.25)',  label: 'Education',       emoji: '📚' },
  household:      { color: '#8d6e63', bg: 'rgba(141,110,99,0.12)', border: 'rgba(141,110,99,0.25)',  label: 'Household',       emoji: '🏠' },
  dining:         { color: '#ffa726', bg: 'rgba(255,167,38,0.12)',  border: 'rgba(255,167,38,0.25)',  label: 'Dining',          emoji: '🍽️' },
  shopping:       { color: '#ff7043', bg: 'rgba(255,112,67,0.12)',  border: 'rgba(255,112,67,0.25)',  label: 'Shopping',        emoji: '🛍️' },
  other:          { color: '#78909c', bg: 'rgba(120,144,156,0.12)', border: 'rgba(120,144,156,0.25)', label: 'Other',           emoji: '📦' },
};

export const getCategoryMeta = (category: string): CategoryMeta =>
  CATEGORY_META[category?.toLowerCase()] ?? CATEGORY_META.other;

export const formatCurrency = (value: number, currency = 'BRL'): string =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(value);
