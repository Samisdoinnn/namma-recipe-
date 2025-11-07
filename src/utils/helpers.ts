import { UNITS } from '@/constants/theme';

export const convertUnits = (
  quantity: number,
  fromUnit: string,
  toUnit: string,
  system: 'metric' | 'imperial'
): number => {
  // Volume conversions
  const volumeConversions: { [key: string]: number } = {
    // Metric
    ml: 1,
    l: 1000,
    // Imperial
    'fl oz': 29.5735,
    cup: 236.588,
    tbsp: 14.7868,
    tsp: 4.92892,
    pint: 473.176,
    quart: 946.353,
    gallon: 3785.41,
  };

  // Weight conversions
  const weightConversions: { [key: string]: number } = {
    // Metric
    g: 1,
    kg: 1000,
    // Imperial
    oz: 28.3495,
    lb: 453.592,
  };

  // Determine conversion type
  const isVolume = fromUnit in volumeConversions && toUnit in volumeConversions;
  const isWeight = fromUnit in weightConversions && toUnit in weightConversions;

  if (!isVolume && !isWeight) {
    return quantity; // Can't convert between different types
  }

  const conversions = isVolume ? volumeConversions : weightConversions;
  
  // Convert to base unit, then to target unit
  const baseValue = quantity * conversions[fromUnit];
  const result = baseValue / conversions[toUnit];
  
  return Math.round(result * 100) / 100; // Round to 2 decimal places
};

export const formatTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

export const formatDate = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) {
    return `${diffMins} minutes ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hours ago`;
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString();
  }
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
