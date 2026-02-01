/**
 * Helper utility to handle date conversion from various formats
 * (Firebase Timestamp, ISO string, Date object)
 */
export function toJsDate(date: any): Date | null {
    if (!date) return null;

    // Handle Date object
    if (date instanceof Date) {
        return date;
    }

    // Handle string or number
    const d = new Date(date);
    return isNaN(d.getTime()) ? null : d;
}

/**
 * Format a date to locale string with fallback
 */
export function formatJsDate(date: any, locale: string = 'en-US', options?: Intl.DateTimeFormatOptions): string {
    const d = toJsDate(date);
    if (!d) return '';
    return d.toLocaleString(locale, options);
}
