export function localDateKey(date = new Date())
{
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function calendarDaysBetween(from, to)
{
  if (!from || !to) return NaN;
  const toUtcDay = (key) =>
  {
    const [year, month, day] = key.split('-').map(Number);
    return Date.UTC(year, month - 1, day) / 86400000;
  };
  return toUtcDay(to) - toUtcDay(from);
}
