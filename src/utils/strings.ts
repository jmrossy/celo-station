export function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Only allows letters and numbers
const alphanumericRgex = /[^a-zA-Z0-9]/gi;
export function sanitizeString(str: string) {
  if (!str || typeof str !== 'string') return '';
  return str.replaceAll(alphanumericRgex, '').toLowerCase();
}

export function trimToLength(value: string, maxLength: number) {
  if (!value) return '';
  const trimmed = value.trim();
  return trimmed.length > maxLength ? trimmed.substring(0, maxLength) + '...' : trimmed;
}

export function errorToString(error: any, maxLength = 300) {
  if (!error) return 'Unknown Error';
  if (typeof error === 'string') return trimToLength(error, maxLength);
  if (typeof error === 'number') return `Error code: ${error}`;
  const details = error.message || error.reason || error;
  if (typeof details === 'string') return trimToLength(details, maxLength);
  return trimToLength(JSON.stringify(details), maxLength);
}
