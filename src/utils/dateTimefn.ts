import { format, isToday, isTomorrow } from "date-fns";
import { hu } from "date-fns/locale";

// Dátum formázás logika
export const getDateDisplay = (date: string | Date) => {
  const matchDate = new Date(date);

  if (isToday(matchDate)) {
    return "Ma";
  } else if (isTomorrow(matchDate)) {
    return "Holnap";
  } else {
    return format(matchDate, "dd.MM", { locale: hu });
  }
};
