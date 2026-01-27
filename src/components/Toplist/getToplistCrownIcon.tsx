import { FaCrown } from "react-icons/fa";

export function getToplistCrownIcon(position: number, iconSize: number = 18) {
  if (position === 0) return <FaCrown size={iconSize} color="#FFD700" />;
  if (position === 1) return <FaCrown size={iconSize} color="#C0C0C0" />;
  if (position === 2) return <FaCrown size={iconSize} color="#CD7F32" />;
  return `#${position + 1}`;
}
