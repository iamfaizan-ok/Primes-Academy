/**
 * Standard IELTS Band Calculation and Rounding Rules:
 * Average = (Listening + Reading + Writing + Speaking) / 4
 * - If average fractional part < 0.25, round down to whole band (e.g. 6.125 -> 6.0)
 * - If average fractional part >= 0.25 and < 0.75, round to half band 0.5 (e.g. 6.25 -> 6.5, 6.625 -> 6.5)
 * - If average fractional part >= 0.75, round up to next whole band (e.g. 6.875 -> 7.0)
 */
export function calculateOverallBand(listening, reading, writing, speaking) {
  const l = parseFloat(listening) || 0;
  const r = parseFloat(reading) || 0;
  const w = parseFloat(writing) || 0;
  const s = parseFloat(speaking) || 0;

  const avg = (l + r + w + s) / 4;
  const intPart = Math.floor(avg);
  const frac = avg - intPart;

  let rounded;
  if (frac < 0.25) {
    rounded = intPart;
  } else if (frac < 0.75) {
    rounded = intPart + 0.5;
  } else {
    rounded = intPart + 1;
  }

  return Number(rounded.toFixed(1));
}

export const IELTS_BAND_OPTIONS = [
  '0.0', '0.5', '1.0', '1.5', '2.0', '2.5', '3.0', '3.5', '4.0', 
  '4.5', '5.0', '5.5', '6.0', '6.5', '7.0', '7.5', '8.0', '8.5', '9.0'
];

export function formatDate(dateObj = new Date()) {
  const d = new Date(dateObj);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

export function getDayName(dateObj = new Date()) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[new Date(dateObj).getDay()];
}

// Generate the rolling 4 days: 3 previous days + today
export function getRollingFourDays() {
  const result = [];
  const today = new Date();
  
  for (let i = 3; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    result.push({
      dateStr: formatDate(d),
      isoDate: d.toISOString().split('T')[0],
      dayName: getDayName(d),
      shortDay: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()],
      isToday: i === 0,
    });
  }
  return result;
}

