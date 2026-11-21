const DAYS_OF_WEEK = ['일', '월', '화', '수', '목', '금', '토'];

export interface DeliveryDateOption {
  label: string;
  value: string;
}

function formatDate(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function createDeliveryDateOptions(
  now: Date,
  days: number,
  tomorrowCutoffHour: number,
): DeliveryDateOption[] {
  const baseDate = new Date(now);
  if (now.getHours() >= tomorrowCutoffHour) {
    baseDate.setDate(baseDate.getDate() + 1);
  }

  return Array.from({ length: days + 1 }, (_, index) => {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + index);
    const value = formatDate(date);
    return { label: `${value} (${DAYS_OF_WEEK[date.getDay()]})`, value };
  });
}
