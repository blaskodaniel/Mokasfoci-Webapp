import { useEffect, useState } from "react";
import { HiOutlineLogout, HiOutlineMenuAlt3 } from "react-icons/hi";
import {
  IoHomeOutline,
  IoTicketOutline,
  IoFootball,
  IoTrophyOutline,
  IoPersonOutline,
  IoPeopleOutline,
  IoStatsChartOutline,
  IoGitNetworkOutline,
  IoRibbonOutline,
} from "react-icons/io5";
import { GiTwoCoins } from "react-icons/gi";
import { Link } from "react-router-dom";
import useMenu from "@/hooks/useMenu";
import useResponsive from "@/hooks/useResponsive";
import { useAuth } from "@/hooks/useAuth";
import { formatPoints } from "@/utils/common";
import { APP_CONFIG, DEFAULT_AVATAR_URL } from "@/config";
import { NotificationDropdown } from "./NotificationDropdown";

const MENU_ICONS: Record<string, React.ReactNode> = {
  "/fooldal": <IoHomeOutline />,
  "/fogadasaim": <IoTicketOutline />,
  "/merkozesek": <IoFootball />,
  "/ranglista": <IoTrophyOutline />,
  "/profilom": <IoPersonOutline />,
  "/csoportok": <IoPeopleOutline />,
  "/statisztikak": <IoStatsChartOutline />,
  "/kieseses": <IoGitNetworkOutline />,
  "/mybadges": <IoRibbonOutline />,
};

const Header = ({
  isMenuOpen,
  setIsMenuOpen,
}: {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}) => {
  const { isDesktop } = useResponsive();
  const { logout, user: currentUser } = useAuth();
  const { menuList } = useMenu();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "py-1.5" : "py-2.5 sm:py-3"
      } bg-primary/95 backdrop-blur-sm border-b border-white/5 shadow-[0_1px_0_0_rgba(139,107,255,0.25)] flex items-center sm:px-6 px-4`}
    >
      {!isDesktop && (
        <div className="flex items-center gap-3">
          <Link
            to="/fooldal"
            className="w-8 h-8 sm:w-23 sm:h-23 rounded-full shadow-lg shrink-0 ring-2 ring-accent/40"
          >
            <img
              src={
                currentUser?.avatar
                  ? `${APP_CONFIG.SERVER_URL}${currentUser.avatar}`
                  : DEFAULT_AVATAR_URL
              }
              alt="Avatar"
              className="w-full h-full rounded-full object-cover"
            />
          </Link>
          <div className="flex flex-col gap-1">
            <Link to="/profilom" className="text-xs text-text-secondary">
              Hi, {currentUser?.name || currentUser?.username}!
            </Link>
            <div className="inline-flex w-fit items-center gap-1 rounded-full border border-badge-amber-border bg-badge-amber-bg px-2 py-0.5 text-badge-amber font-bold text-xs">
              <GiTwoCoins size={12} /> {formatPoints(currentUser?.data.availableScore || 0)}
            </div>
          </div>
        </div>
      )}
      <div className="hidden sm:flex items-center gap-1 overflow-x-auto scrollbar-hide min-w-0">
        {menuList.map((menu) => (
          <Link
            key={menu.link}
            to={menu.link}
            title={menu.name}
            className={`flex items-center gap-1.5 rounded-full ml-1 shrink-0 whitespace-nowrap transition-all duration-200 ${
              scrolled ? "px-2.5 py-1 text-xs" : "px-2.5 py-1.5 nav:px-3 text-sm"
            } font-bold cursor-pointer ${
              menu.isActive
                ? "bg-accent/15 text-white border border-accent/40 shadow-[0_0_16px_-4px_rgba(107,75,255,0.6)]"
                : "text-text-secondary border border-transparent hover:text-white hover:bg-white/5"
            }`}
          >
            <span className={menu.isActive ? "text-accent-soft" : "opacity-70"}>
              {MENU_ICONS[menu.link]}
            </span>
            <span className="hidden nav:inline">{menu.name}</span>
          </Link>
        ))}
      </div>

      <div className="sm:hidden ml-auto flex items-center gap-3">
        <NotificationDropdown />
        <HiOutlineMenuAlt3
          color="white"
          size={25}
          className="cursor-pointer"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        />
      </div>
      {isDesktop && (
        <div className="flex items-center gap-3 ml-auto">
          <Link
            to="/profilom"
            className="group flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 py-1 pl-1 pr-3.5 transition-colors hover:border-accent/40 hover:bg-white/10"
          >
            <img
              src={
                currentUser?.avatar
                  ? `${APP_CONFIG.SERVER_URL}${currentUser.avatar}`
                  : DEFAULT_AVATAR_URL
              }
              alt="Avatar"
              className="h-7 w-7 shrink-0 rounded-full object-cover ring-2 ring-accent/30 transition-all group-hover:ring-accent/60"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-xs font-semibold text-white">{currentUser?.username}</span>
              <span className="flex items-center gap-1 text-xs font-bold text-badge-amber">
                <GiTwoCoins size={12} />
                {formatPoints(currentUser?.data.availableScore || 0)}
              </span>
            </div>
          </Link>

          <NotificationDropdown />

          <div className="h-6 w-px bg-white/10" />
          <div
            className="text-text-secondary cursor-pointer flex items-center gap-1 hover:text-highlight transition-colors"
            onClick={() => {
              logout();
            }}
          >
            <HiOutlineLogout size={20} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
