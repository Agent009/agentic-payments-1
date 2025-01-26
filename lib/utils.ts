import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const colorCache = new Map<string, { light: string; dark: string }>();
const baseHues = [200, 150, 280, 330, 130, 30, 260, 60, 310, 170];

export function generateConsistentColor(value: string) {
  if (colorCache.has(value)) {
    return colorCache.get(value)!;
  }

  // Generate a consistent number from the string
  const hash = value.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);

  // Use the hash to select a base hue
  const hue = baseHues[Math.abs(hash) % baseHues.length];

  // Create light and dark mode compatible colors
  const colors = {
    light: `hsl(${hue}, 70%, 90%)`,
    dark: `hsl(${hue}, 70%, 35%)`,
  };

  colorCache.set(value, colors);
  return colors;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export const reorderObjectByDepth = <T extends object>(object: { [key: string]: T }) => {
  const sortedKeys = Object.keys(object).sort((a, b) => {
    const depthA = a.split(" < ").length;
    const depthB = b.split(" < ").length;
    return depthA - depthB;
  });

  const reorderedObject: { [key: string]: T } = {};
  sortedKeys.forEach((key) => {
    reorderedObject[key] = object[key] as T;
  });

  return reorderedObject;
};
