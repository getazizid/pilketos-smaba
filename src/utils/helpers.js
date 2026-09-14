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

export function formatTimeWIB(dateStringOrTimestamp) {
  if (!dateStringOrTimestamp) return '-';
  try {
    let date;
    if (typeof dateStringOrTimestamp === 'object' && dateStringOrTimestamp !== null) {
      if (typeof dateStringOrTimestamp.toDate === 'function') {
        date = dateStringOrTimestamp.toDate();
      } else if (dateStringOrTimestamp.seconds !== undefined) {
        date = new Date(dateStringOrTimestamp.seconds * 1000);
      } else if (dateStringOrTimestamp._seconds !== undefined) {
        date = new Date(dateStringOrTimestamp._seconds * 1000);
      } else {
        date = new Date(dateStringOrTimestamp);
      }
    } else {
      date = new Date(dateStringOrTimestamp);
    }

    if (isNaN(date.getTime())) return '-';

    const timeStr = new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'Asia/Jakarta'
    }).format(date);

    return `${timeStr.replace(/:/g, '.')} WIB`;
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

/**
 * Mendapatkan kunci pemilahan (sort key) untuk nama kelas reguler (XII, XI, X)
 */
export function getClassSortKey(cls) {
  if (!cls) return { levelWeight: 99, num: 999, original: '' };
  const upper = cls.toString().trim().toUpperCase();
  let levelWeight = 99;
  let num = 999;
  const match = upper.match(/^(XII|XI|X)[-\s]?(\d+)?/);
  if (match) {
    const lvl = match[1];
    if (lvl === 'X') levelWeight = 10;
    else if (lvl === 'XI') levelWeight = 11;
    else if (lvl === 'XII') levelWeight = 12;
    num = match[2] ? parseInt(match[2], 10) : 0;
  }
  return { levelWeight, num, original: cls };
}

/**
 * Natural sort untuk daftar nama kelas sekolah (X-1 s/d X-12, XI-1 s/d XI-12, XII-1 s/d XII-12, dll)
 */
export function sortClassNames(classList) {
  return [...classList].sort((a, b) => {
    const ka = getClassSortKey(a);
    const kb = getClassSortKey(b);
    if (ka.levelWeight !== kb.levelWeight) return ka.levelWeight - kb.levelWeight;
    if (ka.num !== kb.num) return ka.num - kb.num;
    return (a || '').localeCompare(b || '', undefined, { numeric: true, sensitivity: 'base' });
  });
}

/**
 * Menghasilkan daftar 36 kelas reguler standar SMAN 1 Batu (X-1 s/d X-12, XI-1 s/d XI-12, XII-1 s/d XII-12)
 */
export function getStandardSchoolClasses() {
  const x = Array.from({ length: 12 }, (_, i) => `X-${i + 1}`);
  const xi = Array.from({ length: 12 }, (_, i) => `XI-${i + 1}`);
  const xii = Array.from({ length: 12 }, (_, i) => `XII-${i + 1}`);
  return { x, xi, xii, all: [...x, ...xi, ...xii] };
}
