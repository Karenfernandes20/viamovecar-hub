import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatBrazilianPhone = (phone: string | undefined): string => {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");

  // Format based on length (10 or 11 digits)
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  } else if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 13 && cleaned.startsWith("55")) { // Country code handling
    const ddd = cleaned.slice(2, 4);
    const nine = cleaned.slice(4, 5);
    const part1 = cleaned.slice(4, 9);
    const part2 = cleaned.slice(9);
    if (cleaned.length === 13) return `(${ddd}) ${part1}-${part2}`;
    // Fallback
    return phone;
  }

  return phone;
};
