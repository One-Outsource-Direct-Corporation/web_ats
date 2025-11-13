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

export function formatDate(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("en-PH", options);
}

export function formatDateYYYYMMDD(date: string): string {
  if (!date) return "";

  const dateObj = new Date(date).toISOString();
  return dateObj.split("T")[0];
}

export function formatTime(from: string, to: string): string {
  if (!from || !to) return "";

  return from && to ? `${formatTimeAMPM(from)} - ${formatTimeAMPM(to)}` : "";
}
