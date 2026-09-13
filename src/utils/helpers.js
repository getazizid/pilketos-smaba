/**
 * Helper utility functions
 */

export function formatIndonesianDate(dateStringOrTimestamp) {
  if (!dateStringOrTimestamp) return '-';
  try {
    let date;
    if (typeof dateStringOrTimestamp === 'object' && dateStringOrTimestamp !== null) {
      if (typeof dateStringOrTimestamp.toDate === 'function') {
        date = dateStringOrTimestamp.toDate();
      } else if (dateStringOrTimestamp.seconds) {
        date = new Date(dateStringOrTimestamp.seconds * 1000);
      } else {
        date = new Date(dateStringOrTimestamp);
      }
    } else {
      date = new Date(dateStringOrTimestamp);
    }

    if (isNaN(date.getTime())) return '-';

    const datePart = new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'Asia/Jakarta'
    }).format(date);

    const timePart = new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'Asia/Jakarta'
    }).format(date);

    return `${datePart} pukul ${timePart.replace(/:/g, '.')} WIB`;
  } catch {
    return '-';
  }
}

export function formatSimpleDate(dateString) {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'Asia/Jakarta'
    }).format(date);
  } catch {
    return '-';
  }
}

export function formatNumber(num) {
  return new Intl.NumberFormat('id-ID').format(num || 0);
}

export function calculatePercentage(part, total) {
  if (!total || total === 0) return '0.0';
  return ((part / total) * 100).toFixed(1);
}
