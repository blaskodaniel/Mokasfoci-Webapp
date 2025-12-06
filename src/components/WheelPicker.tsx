import { useRef, useEffect, useState, useCallback, useMemo } from "react";

// Timeout típus deklaráció
declare global {
  interface Window {
    wheelTimeout?: number;
  }
}

interface WheelPickerProps {
  values: number[];
  onValueChange: (value: number) => void;
  className?: string;
  defaultValue?: number;
}

const WheelPicker = ({
  values,
  onValueChange,
  className,
  defaultValue = 1000,
}: WheelPickerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startScroll, setStartScroll] = useState(0);
  const itemHeight = 40; // Magasság egy elemnek
  const visibleItems = 5; // Hány elem látható egyszerre

  const currentValue = useMemo(() => defaultValue, [defaultValue]);
  const selectedIndex = values.findIndex((v) => v === currentValue);

  const scrollToIndex = (index: number) => {
    if (containerRef.current) {
      const targetScroll = index * itemHeight;
      containerRef.current.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    if (!containerRef.current || isDragging) return;

    const scrollTop = containerRef.current.scrollTop;
    const index = Math.round(scrollTop / itemHeight);
    const clampedIndex = Math.max(0, Math.min(index, values.length - 1));

    if (defaultValue !== undefined) {
      onValueChange(defaultValue);
      return;
    }

    if (values[clampedIndex] !== currentValue) {
      console.log("handleScroll:", values[clampedIndex], currentValue);
      onValueChange(values[clampedIndex]);
    }
  };

  const snapToNearestItem = useCallback(() => {
    if (!containerRef.current) return;

    const scrollTop = containerRef.current.scrollTop;
    const index = Math.round(scrollTop / itemHeight);
    const clampedIndex = Math.max(0, Math.min(index, values.length - 1));

    const newValue = values[clampedIndex];

    scrollToIndex(clampedIndex);

    // Csak akkor hívjuk meg az onValueChange-t, ha tényleg változott az érték
    if (newValue !== currentValue) {
      onValueChange(newValue);
    }
  }, [values, onValueChange, itemHeight, currentValue]);

  // Touch események
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    setStartScroll(containerRef.current?.scrollTop || 0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return;

    const currentY = e.touches[0].clientY;
    const deltaY = startY - currentY;
    const newScrollTop = startScroll + deltaY;

    containerRef.current.scrollTop = newScrollTop;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setTimeout(snapToNearestItem, 50);
  };

  // Mouse események
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); // Szöveg kijelölés megakadályozása
    setIsDragging(true);
    setStartY(e.clientY);
    setStartScroll(containerRef.current?.scrollTop || 0);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      e.preventDefault();
      const currentY = e.clientY;
      const deltaY = startY - currentY;
      const newScrollTop = startScroll + deltaY;

      containerRef.current.scrollTop = Math.max(0, newScrollTop);
    },
    [isDragging, startY, startScroll]
  );

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      setTimeout(() => {
        snapToNearestItem();
      }, 50);
    }
  }, [isDragging, snapToNearestItem]);

  // Mouse event listeners global kezelése
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("mouseleave", handleMouseUp); // Ablakból kimenet kezelése

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("mouseleave", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheelPassive = () => {
      // Debounced snap - a görgetés után röviddel
      clearTimeout(window.wheelTimeout);
      window.wheelTimeout = setTimeout(() => {
        const scrollTop = container.scrollTop;
        const index = Math.round(scrollTop / itemHeight);
        const clampedIndex = Math.max(0, Math.min(index, values.length - 1));

        const newValue = values[clampedIndex];

        // Snap to nearest item
        scrollToIndex(clampedIndex);

        // Csak akkor hívjuk meg az onValueChange-t, ha tényleg változott az érték
        if (newValue !== currentValue) {
          onValueChange(newValue);
        }
      }, 100);
    };

    // Normál event listener wheel eseményhez
    container.addEventListener("wheel", handleWheelPassive);

    return () => {
      container.removeEventListener("wheel", handleWheelPassive);
      if (window.wheelTimeout) {
        clearTimeout(window.wheelTimeout);
      }
    };
  }, [values, onValueChange, itemHeight, currentValue]);

  useEffect(() => {
    if (selectedIndex >= 0) {
      scrollToIndex(selectedIndex);
    }
  }, [currentValue, selectedIndex]);

  // Kezdeti pozicionálás - komponens mount-oláskor vagy selectedIndex változásakor
  useEffect(() => {
    if (defaultValue !== undefined) {
      onValueChange(defaultValue);
      return;
    }
    if (selectedIndex >= 0) {
      // Rögtön az első render után pozicionálunk
      setTimeout(() => {
        scrollToIndex(selectedIndex);
      }, 0);
    }
  }, [selectedIndex, defaultValue, onValueChange]);

  return (
    <div className={`relative ${className}`}>
      {/* Highlight overlay */}
      <div
        className="absolute left-0 right-0 bg-primary/20 border border-primary/50 rounded-md z-10 pointer-events-none"
        style={{
          top: `${((visibleItems - 1) / 2) * itemHeight}px`,
          height: `${itemHeight}px`,
        }}
      />

      {/* Scrollable container */}
      <div
        ref={containerRef}
        className={`h-49 overflow-y-scroll scrollbar-hide relative select-none ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        onScroll={handleScroll}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        style={{
          scrollSnapType: "y mandatory",
          paddingTop: `${((visibleItems - 1) / 2) * itemHeight}px`,
          paddingBottom: `${((visibleItems - 1) / 2) * itemHeight}px`,
        }}
      >
        {values.map((value, index) => {
          const isSelected = value === currentValue;
          const distanceFromCenter = Math.abs(index - selectedIndex);
          const opacity = Math.max(0.3, 1 - distanceFromCenter * 0.2);

          return (
            <div
              key={value}
              className={`flex items-center justify-center text-center transition-all duration-200 cursor-pointer ${
                isSelected ? "text-white font-semibold" : "text-gray-400"
              }`}
              style={{
                height: `${itemHeight}px`,
                scrollSnapAlign: "center",
                opacity,
                transform: `scale(${isSelected ? 1.3 : 0.9})`,
              }}
              onClick={() => onValueChange(value)}
            >
              {value}
            </div>
          );
        })}
      </div>

      {/* Fade gradients */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-linear-to-b from-quaternary to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-quaternary to-transparent pointer-events-none" />
    </div>
  );
};

export default WheelPicker;
