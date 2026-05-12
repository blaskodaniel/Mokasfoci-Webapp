import { useState, useRef, useEffect, useMemo } from "react";
import { format, addDays, startOfWeek, isSameDay, differenceInCalendarDays } from "date-fns";
import { hu } from "date-fns/locale";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

interface CalendarProps {
  onDateSelect?: (date: Date) => void;
  selectedDate?: Date;
  minDate?: Date;
  maxDate?: Date;
}

const Calendar = ({ onDateSelect, selectedDate, minDate, maxDate }: CalendarProps) => {
  const sliderRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const days = useMemo(() => {
    const defaultStart = addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), -30);
    const start = minDate ?? defaultStart;
    const length = minDate && maxDate ? differenceInCalendarDays(maxDate, start) + 1 : 90;
    return Array.from({ length: Math.max(length, 1) }, (_, i) => addDays(start, i));
  }, [minDate, maxDate]);

  const [today] = useState(() => new Date());
  const [visibleMonth, setVisibleMonth] = useState(today);

  // Fix szélességet biztosítunk (7 nap egy lapon)
  const itemsPerView = 7;
  const gap = 4; // flex gap (1rem = 16px, de mi gap-1 = 4px)

  // Pozicionálás a kiválasztott/mai napra, mindig a layout után (rAF)
  // Csak akkor fut újra, ha a days tömb változik (config betöltés)
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (!sliderRef.current) return;
      const targetDate = selectedDate || today;
      const index = days.findIndex((d) => isSameDay(d, targetDate));
      const containerWidth = sliderRef.current.clientWidth;
      const itemWidth = (containerWidth + gap) / itemsPerView;
      if (index === -1) {
        sliderRef.current.scrollLeft = 0;
        if (days[0]) setVisibleMonth(days[0]);
      } else {
        sliderRef.current.scrollLeft = Math.max(
          0,
          index * itemWidth - containerWidth / 2 + itemWidth / 2
        );
        setVisibleMonth(days[index]);
      }
    });
    return () => cancelAnimationFrame(frame);
    // selectedDate szándékosan nem szerepel a dep-ben: csak days változásakor (config load) scroll vissza
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days]);

  // Akárhányszor görgetjük (húzással vagy nyilakkal), frissüljön a hónap a fejlécen
  const handleScroll = () => {
    if (!sliderRef.current) return;
    const containerWidth = sliderRef.current.clientWidth;
    const itemWidth = (containerWidth + gap) / itemsPerView;
    const centerIndex = Math.round((sliderRef.current.scrollLeft + containerWidth / 2) / itemWidth);

    if (days[centerIndex]) {
      setVisibleMonth(days[centerIndex]);
    }
  };

  const jumpWeeks = (direction: number) => {
    if (!sliderRef.current) return;
    const containerWidth = sliderRef.current.clientWidth;
    const itemWidth = (containerWidth + gap) / itemsPerView;
    sliderRef.current.scrollBy({ left: direction * 7 * itemWidth, behavior: "smooth" });
  };

  // ----- Érintés / Egér Dragging Logic (Ugyanúgy mint a Slider komponensben!) -----
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!sliderRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Gyorsítószint
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !sliderRef.current) return;
    const x = e.touches[0].pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleDragEnd = () => {
    if (!isDragging || !sliderRef.current) return;
    setIsDragging(false);

    // Kiszámoljuk a legközelebbi nap indexét, és oda pattintjuk (snap) a naptárat
    const containerWidth = sliderRef.current.clientWidth;
    const itemWidth = (containerWidth + gap) / itemsPerView;
    const currentScroll = sliderRef.current.scrollLeft;

    // Nem hagyjuk hogy a végtelenségig scrollozzon, fix elemhez igazítjuk
    const newIndex = Math.round(currentScroll / itemWidth);

    sliderRef.current.scrollTo({
      left: newIndex * itemWidth,
      behavior: "smooth",
    });
  };

  const handleDateClick = (date: Date) => {
    onDateSelect?.(date);
    setVisibleMonth(date);
  };

  return (
    <div className="bg-panel-bg border border-primary/20 rounded-lg p-1 max-w-lg mx-auto mb-3">
      {/* Navigation Header */}
      <div></div>
      <div className="flex items-center justify-between mb-1">
        <button
          onClick={() => jumpWeeks(-1)}
          className="p-1 hover:bg-surface-hover rounded-lg transition-colors"
          aria-label="Previous week"
        >
          <IoChevronBack className="text-white" size={20} />
        </button>

        <div className="text-sm text-gray-400 hover:text-white transition-colors capitalize font-medium">
          {format(visibleMonth, "MMMM", { locale: hu })}
        </div>

        <button
          onClick={() => jumpWeeks(1)}
          className="p-1 hover:bg-surface-hover rounded-lg transition-colors"
          aria-label="Next week"
        >
          <IoChevronForward className="text-white" size={20} />
        </button>
      </div>

      {/* Slider container (Continuous scroll) */}
      <div
        ref={sliderRef}
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleDragEnd}
        className={`flex overflow-x-hidden hide-scrollbar cursor-grab active:cursor-grabbing ${
          isDragging ? "select-none" : ""
        }`}
        style={{ gap: `${gap}px` }}
      >
        {days.map((day) => {
          const isToday = isSameDay(day, today);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const dayName = format(day, "EEE", { locale: hu }).toUpperCase();
          const dayNumber = format(day, "d");

          return (
            <div
              key={day.toISOString()}
              className="shrink-0"
              style={{ width: `calc((100% - ${gap * (itemsPerView - 1)}px) / ${itemsPerView})` }}
            >
              <button
                onClick={() => handleDateClick(day)}
                className={`
                  w-full flex flex-col items-center justify-center py-1 rounded-lg
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
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
