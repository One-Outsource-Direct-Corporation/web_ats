function formatTimeAMPM(time: string) {
  if (!time) return "";
  const [hourStr, minuteStr] = time.split(":");
  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  if (hour === 0) hour = 12;
  return `${hour}:${minute.toString().padStart(2, "0")} ${ampm}`;
}

export function formatDate(dateString: string, short?: boolean): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: short ? "short" : "long",
    day: "numeric",
  };
  return date.toLocaleDateString("en-PH", options);
}

export function formatDateYYYYMMDD(date: string): string {
  if (!date) return "";

  // If already in YYYY-MM-DD format, return as is
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }

  const dateObj = new Date(date);

  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    return "";
  }

  // Use local date to avoid timezone issues
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function formatTime(from: string, to: string): string {
  if (!from || !to) return "";

  return from && to ? `${formatTimeAMPM(from)} - ${formatTimeAMPM(to)}` : "";
}
