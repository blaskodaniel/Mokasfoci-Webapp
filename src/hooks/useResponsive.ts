import { breakPoints } from "@/utils/breakpoints";
import { useEffect, useState } from "react";

const useResponsive = () => {
  const getWidth = () => (typeof window !== "undefined" ? window.innerWidth : breakPoints.sm);
  const [width, setWidth] = useState<number>(getWidth);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isMobile = width < breakPoints.sm;
  const isDesktop = width >= breakPoints.sm;

  return { isMobile, isDesktop };
};

export default useResponsive;
