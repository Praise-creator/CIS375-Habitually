// Minimal helpers for Calendar

/** Returns a YYYY-M-1 Date for "monthOffset" months from today */
export function getMonthDate(offset: number) {
  const d = new Date();
  d.setMonth(d.getMonth() + offset, 1);
  return d;
}

export const toKey = (d: Date) => d.toDateString();

export const startOfMonth = (y: number, m: number) => new Date(y, m, 1);
export const endOfMonth   = (y: number, m: number) => new Date(y, m + 1, 0);

export function buildMonthCells(year: number, month: number) {
  // 0=Sun..6=Sat
  const firstDay = startOfMonth(year, month).getDay();
  const daysInMonth = endOfMonth(year, month).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return { firstDay, daysInMonth, cells };
}
