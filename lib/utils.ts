import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPublicAddress(address: string): string {
  if (address.includes("0x")) {
    return (
      address.slice(0, 6) +
      "..." +
      address.slice(address.length - 4, address.length)
    );
  } else return "";
}
