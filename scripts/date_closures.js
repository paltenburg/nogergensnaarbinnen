/* Date-specific closures in the JSON master. No opening times are inferred. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.NGNBDateClosures = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const DAYS = ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'];
  function parseDate(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
    const date = new Date(value + 'T12:00:00Z');
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value ? date : null;
  }
  function weekday(value) {
    const date = parseDate(value);
    return date ? DAYS[(date.getUTCDay() + 6) % 7] : null;
  }
  function isClosed(place, date) {
    if (!parseDate(date) || !Array.isArray(place?.date_closures)) return false;
    return place.date_closures.some(range =>
      parseDate(range?.start) && parseDate(range?.end) &&
      range.start <= range.end && range.start <= date && date <= range.end
    );
  }
  return { parseDate, weekday, isClosed };
});
