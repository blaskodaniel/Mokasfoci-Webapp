import { useRef, useState, type ReactNode, useEffect, Children } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

interface SliderProps {
  children: ReactNode;
  itemsPerView?: number;
  gap?: number;
  className?: string;
}

const Slider = ({ children, itemsPerView = 1, gap = 16, className = "" }: SliderProps) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const childrenArray = Children.toArray(children);
  const totalItems = childrenArray.length;
  const maxIndex = Math.max(0, totalItems - itemsPerView);

  useEffect(() => {
    if (sliderRef.current && !isDragging) {
      const containerWidth = sliderRef.current.clientWidth;
      const itemWidth = (containerWidth + gap) / itemsPerView;
      sliderRef.current.scrollTo({
        left: currentIndex * itemWidth,
        behavior: "smooth",
      });
    }
  }, [currentIndex, itemsPerView, gap, isDragging]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  // Touch/Mouse events for dragging
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
    const walk = (x - startX) * 2;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !sliderRef.current) return;
    const x = e.touches[0].pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleDragEnd = () => {
    if (!sliderRef.current || !isDragging) return;
    setIsDragging(false);

    // Snap to nearest item
    const containerWidth = sliderRef.current.clientWidth;
    const itemWidth = (containerWidth + gap) / itemsPerView;
    const currentScroll = sliderRef.current.scrollLeft;
    const newIndex = Math.round(currentScroll / itemWidth);
    setCurrentIndex(Math.max(0, Math.min(maxIndex, newIndex)));
  };

  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < maxIndex;

  return (
    <div className={`relative ${className}`}>
      {/* Previous button */}
      {canGoPrevious && (
        <button
          onClick={handlePrevious}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-panel-bg/90 hover:bg-panel-bg border border-primary/20 p-2 rounded-full shadow-lg transition-all"
          aria-label="Previous"
        >
          <IoChevronBack className="text-white" size={24} />
        </button>
      )}

      {/* Slider container */}
      <div
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleDragEnd}
        className={`flex overflow-x-hidden cursor-grab active:cursor-grabbing ${isDragging ? "select-none" : ""}`}
        style={{ gap: `${gap}px` }}
      >
        {childrenArray.map((child, index) => (
          <div
            key={index}
            className="shrink-0"
            style={{ width: `calc((100% - ${gap * (itemsPerView - 1)}px) / ${itemsPerView})` }}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Next button */}
      {canGoNext && (
        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-panel-bg/90 hover:bg-panel-bg border border-primary/20 p-2 rounded-full shadow-lg transition-all"
          aria-label="Next"
        >
          <IoChevronForward className="text-white" size={24} />
        </button>
      )}

      {/* Dots indicator */}
      {totalItems > itemsPerView && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? "bg-accent w-6" : "bg-gray-600"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Slider;
