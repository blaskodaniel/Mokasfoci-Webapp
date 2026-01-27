import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface LottieWrapperProps {
  src: string; // Lehet távoli URL vagy importált .lottie fájl útvonala
  autoplay?: boolean;
  loop?: boolean;
  className?: string;
  speed?: number;
  style?: React.CSSProperties;
}

const LottieAnimation: React.FC<LottieWrapperProps> = ({
  src,
  autoplay = true,
  loop = true,
  className,
  speed = 1,
  style = { height: "300px", width: "300px" },
}) => {
  return (
    <div className={`lottie-container ${className}`}>
      <DotLottieReact src={src} autoplay={autoplay} loop={loop} speed={speed} style={style}>
        {/* Itt további vezérlőket is hozzáadhatnál, ha kellene */}
      </DotLottieReact>
    </div>
  );
};

export default LottieAnimation;
