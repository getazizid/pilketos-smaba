/**
 * Helper utility functions
 */

export function formatIndonesianDate(dateStringOrTimestamp) {
  if (!dateStringOrTimestamp) return '-';
  const date = typeof dateStringOrTimestamp === 'object' && dateStringOrTimestamp.toDate 
    ? dateStringOrTimestamp.toDate() 
    : new Date(dateStringOrTimestamp);
  
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Jakarta'
  }).format(date) + ' WIB';
}

export function formatSimpleDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

export function formatNumber(num) {
  return new Intl.NumberFormat('id-ID').format(num || 0);
}

export function calculatePercentage(part, total) {
  if (!total || total === 0) return '0.0';
  return ((part / total) * 100).toFixed(1);
}
