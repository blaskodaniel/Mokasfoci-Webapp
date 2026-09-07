import { useState, useRef, useEffect, useMemo } from "react";
import { format, addDays, startOfWeek, isSameDay, differenceInCalendarDays } from "date-fns";
import { hu } from "date-fns/locale";
import { IoChevronBack, IoChevronForward, IoAppsOutline } from "react-icons/io5";
import useResponsive from "@/hooks/useResponsive";

interface CalendarProps {
  onDateSelect?: (date: Date | undefined) => void;
  selectedDate?: Date;
  minDate?: Date;
  maxDate?: Date;
}

const Calendar = ({ onDateSelect, selectedDate, minDate, maxDate }: CalendarProps) => {
  const { isMobile } = useResponsive();
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
    if (selectedDate && isSameDay(date, selectedDate)) {
      onDateSelect?.(undefined);
    } else {
      onDateSelect?.(date);
      setVisibleMonth(date);
    }
  };

  const showingAll = !selectedDate;

  return (
    <div
      className={
        isMobile
          ? "w-full py-2"
          : "mx-auto mb-3 max-w-2xl rounded-tile border border-tile-border bg-[image:var(--tile-bg-gradient)] p-2.5 shadow-tile"
      }
    >
      {/* Navigation Header */}
      <div className="mb-2 flex items-center justify-between">
        <button
          onClick={() => jumpWeeks(-1)}
          className={`rounded-full text-text-secondary transition-colors hover:bg-white/10 hover:text-white ${
            isMobile ? "border border-white/15 bg-white/5 p-2 active:bg-white/15" : "p-1"
          }`}
          aria-label="Previous week"
        >
          <IoChevronBack size={18} />
        </button>

        <div className="text-sm font-semibold capitalize text-text-secondary">
          {format(visibleMonth, "MMMM", { locale: hu })}
        </div>

        <button
          onClick={() => jumpWeeks(1)}
          className={`rounded-full text-text-secondary transition-colors hover:bg-white/10 hover:text-white ${
            isMobile ? "border border-white/15 bg-white/5 p-2 active:bg-white/15" : "p-1"
          }`}
          aria-label="Next week"
        >
          <IoChevronForward size={18} />
        </button>
      </div>

      <div className="flex items-stretch gap-1.5">
        {/* "Összes mérkőzés" – egyértelműen jelzi, ha nincs nap kiválasztva */}
        <button
          onClick={() => onDateSelect?.(undefined)}
          title="Összes mérkőzés megjelenítése"
          className={`flex shrink-0 flex-col items-center justify-center gap-1 rounded-lg px-2.5 py-1 transition-all cursor-pointer ${
            showingAll
              ? "bg-[image:var(--gradient-cta)] text-white shadow-[0_0_12px_-2px_rgba(107,75,255,0.6)]"
              : "border border-white/10 bg-white/5 text-text-secondary hover:bg-white/10 hover:text-white"
          }`}
        >
          <IoAppsOutline size={14} />
          <span className="text-[10px] font-bold uppercase tracking-wide">Mind</span>
        </button>

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
          className={`flex flex-1 overflow-x-hidden hide-scrollbar cursor-grab active:cursor-grabbing ${
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
                        ? "bg-[image:var(--gradient-cta)] text-white shadow-[0_0_12px_-2px_rgba(107,75,255,0.6)]"
                        : isToday
                          ? "bg-accent/15 text-accent-soft border border-accent/40"
                          : "bg-white/5 hover:bg-white/10 text-text-secondary border border-transparent"
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
    </div>
  );
};

export default Calendar;
