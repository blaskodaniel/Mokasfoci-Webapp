import type { FC } from "react";

interface UnknownFlagProps {
  size?: number;
}

const UnknownFlag: FC<UnknownFlagProps> = ({ size = 4 }) => {
  return (
    <div
      className={`rounded-full bg-white/60 w-${size} h-${size} text-black flex items-center justify-center text-xs pt-0.5`}
    >
      ?
    </div>
  );
};

export default UnknownFlag;
