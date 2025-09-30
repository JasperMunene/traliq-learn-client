import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getAccessToken() {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
}
