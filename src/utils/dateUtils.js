/**
 * Date utility functions for the Travel Journal app
 * Handles consistent date parsing across browsers
 */

/**
 * Month name to index mapping
 */
const MONTH_MAP = {
  january: 0,
  february: 1,
  march: 2,
  april: 3,
  may: 4,
  june: 5,
  july: 6,
  august: 7,
  september: 8,
  october: 9,
  november: 10,
  december: 11,
};

/**
 * Parse a journal date string (e.g., "March 2024") into a Date object
 * This handles the format consistently across all browsers
 *
 * @param {string} dateStr - Date string in format "Month Year" (e.g., "March 2024")
 * @returns {Date} Parsed Date object (first day of the month)
 */
export const parseJournalDate = (dateStr) => {
  if (!dateStr || typeof dateStr !== "string") {
    return new Date(0); // Return epoch for invalid input
  }

  const parts = dateStr.trim().split(" ");
  if (parts.length < 2) {
    return new Date(0);
  }

  const [month, yearStr] = parts;
  const monthIndex = MONTH_MAP[month.toLowerCase()];
  const year = parseInt(yearStr, 10);

  if (monthIndex === undefined || isNaN(year)) {
    return new Date(0);
  }

  return new Date(year, monthIndex, 1);
};

/**
 * Compare two journal date strings for sorting (descending - newest first)
 *
 * @param {string} dateA - First date string
 * @param {string} dateB - Second date string
 * @returns {number} Negative if dateA is newer, positive if dateB is newer
 */
export const compareDatesDesc = (dateA, dateB) => {
  return parseJournalDate(dateB).getTime() - parseJournalDate(dateA).getTime();
};

/**
 * Compare two journal date strings for sorting (ascending - oldest first)
 *
 * @param {string} dateA - First date string
 * @param {string} dateB - Second date string
 * @returns {number} Negative if dateA is older, positive if dateB is older
 */
export const compareDatesAsc = (dateA, dateB) => {
  return parseJournalDate(dateA).getTime() - parseJournalDate(dateB).getTime();
};

/**
 * Format a Date object to journal date format
 *
 * @param {Date} date - Date object to format
 * @returns {string} Formatted date string (e.g., "March 2024")
 */
export const formatToJournalDate = (date) => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return "";
  }

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  return `${months[date.getMonth()]} ${date.getFullYear()}`;
};

/**
 * Check if a journal date string is valid
 *
 * @param {string} dateStr - Date string to validate
 * @returns {boolean} True if valid
 */
export const isValidJournalDate = (dateStr) => {
  if (!dateStr || typeof dateStr !== "string") {
    return false;
  }

  const parts = dateStr.trim().split(" ");
  if (parts.length !== 2) {
    return false;
  }

  const [month, yearStr] = parts;
  const monthIndex = MONTH_MAP[month.toLowerCase()];
  const year = parseInt(yearStr, 10);

  return monthIndex !== undefined && !isNaN(year) && year > 1900 && year < 2200;
};

/**
 * Get the relative time description (e.g., "2 months ago", "in 3 months")
 *
 * @param {string} dateStr - Journal date string
 * @returns {string} Relative time description
 */
export const getRelativeTime = (dateStr) => {
  const date = parseJournalDate(dateStr);
  const now = new Date();

  // Set both dates to first of month for comparison
  const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const diffMonths = (date.getFullYear() - currentMonth.getFullYear()) * 12
    + (date.getMonth() - currentMonth.getMonth());

  if (diffMonths === 0) {
    return "This month";
  } else if (diffMonths === -1) {
    return "Last month";
  } else if (diffMonths === 1) {
    return "Next month";
  } else if (diffMonths < 0) {
    const absMonths = Math.abs(diffMonths);
    if (absMonths < 12) {
      return `${absMonths} months ago`;
    } else {
      const years = Math.floor(absMonths / 12);
      return years === 1 ? "1 year ago" : `${years} years ago`;
    }
  } else {
    if (diffMonths < 12) {
      return `In ${diffMonths} months`;
    } else {
      const years = Math.floor(diffMonths / 12);
      return years === 1 ? "In 1 year" : `In ${years} years`;
    }
  }
};
