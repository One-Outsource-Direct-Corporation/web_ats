export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("en-PH", options);
}

export function formatDateYYYYMMDD(date: string): string {
  const dateObj = new Date(date).toISOString();
  return dateObj.split("T")[0];
}
