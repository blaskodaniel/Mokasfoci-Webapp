import { breakPoints } from "@/utils/breakpoints";
import { useMediaQuery } from "react-responsive";

const useResponsive = () => {
  const isMobile = useMediaQuery({ maxWidth: breakPoints.sm - 1 });
  const isDesktop = useMediaQuery({
    minWidth: breakPoints.sm,
  });

  return { isMobile, isDesktop };
};

export default useResponsive;
