import { useState } from "react";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import { hu } from "date-fns/locale";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

interface CalendarProps {
  onDateSelect?: (date: Date) => void;
  selectedDate?: Date;
}

const Calendar = ({ onDateSelect, selectedDate }: CalendarProps) => {
  const [currentWeekStart, setCurrentWeekStart] = useState(
    () => startOfWeek(new Date(), { weekStartsOn: 1 }) // 1 = Monday
  );

  const goToPreviousWeek = () => {
    setCurrentWeekStart((prev) => addDays(prev, -7));
  };

  const goToNextWeek = () => {
    setCurrentWeekStart((prev) => addDays(prev, 7));
  };

  const handleDateClick = (date: Date) => {
    onDateSelect?.(date);
  };

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));
  const today = new Date();

  return (
    <div className="bg-panel-bg border border-primary/20 rounded-lg p-1 max-w-lg mx-auto mb-3">
      {/* Navigation */}
      <div className="flex items-center justify-between mb-1">
        <button
          onClick={goToPreviousWeek}
          className="p-1 hover:bg-surface-hover rounded-lg transition-colors"
          aria-label="Previous week"
        >
          <IoChevronBack className="text-white" size={20} />
        </button>

        <div className="text-sm text-gray-400 hover:text-white transition-colors font-medium">
          {format(currentWeekStart || today, "MMMM", { locale: hu })}
        </div>

        <button
          onClick={goToNextWeek}
          className="p-1 hover:bg-surface-hover rounded-lg transition-colors"
          aria-label="Next week"
        >
          <IoChevronForward className="text-white" size={20} />
        </button>
      </div>

      {/* Week Days */}
      <div className="flex gap-1">
        {weekDays.map((day) => {
          const isToday = isSameDay(day, today);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const dayName = format(day, "EEE", { locale: hu }).toUpperCase();
          const dayNumber = format(day, "d");

          return (
            <button
              key={day.toISOString()}
              onClick={() => handleDateClick(day)}
              className={`
                flex-1 flex flex-col items-center justify-center py-1 rounded-lg
                transition-all cursor-pointer
                ${
                  isSelected
                    ? "bg-accent text-white"
                    : isToday
                      ? "bg-accent/20 text-accent-soft border border-accent/40"
                      : "bg-surface hover:bg-surface-hover text-gray-400"
                }
              `}
            >
              <span className="text-xs font-medium mb-1">{dayName}</span>
              <span className={`text-sm font-bold ${isSelected || isToday ? "text-white" : ""}`}>
                {dayNumber}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
