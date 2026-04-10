import { useEffect, useState } from "react";
import { HiOutlineLogout, HiOutlineMenuAlt3 } from "react-icons/hi";
import { Link } from "react-router-dom";
import useMenu from "@/hooks/useMenu";
import useResponsive from "@/hooks/useResponsive";
import { useAuth } from "@/hooks/useAuth";
import { formatPoints } from "@/utils/common";
import { APP_CONFIG, DEFAULT_AVATAR_URL } from "@/config";
import { NotificationDropdown } from "./NotificationDropdown";

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
        scrolled ? "h-10" : "sm:h-16 h-13"
      } bg-primary shadow-md flex items-center sm:px-6 px-4`}
    >
      {!isDesktop && (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-23 sm:h-23 rounded-full shadow-lg shrink-0">
            <img
              src={
                currentUser?.avatar
                  ? `${APP_CONFIG.SERVER_URL}${currentUser.avatar}`
                  : DEFAULT_AVATAR_URL
              }
              alt="Avatar"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <div className="text-xs">Hi, {currentUser?.name || currentUser?.username}!</div>
            <div className={`text-white rounded-full font-bold text-sm`}>
              {formatPoints(currentUser?.data.availableScore || 0)}
            </div>
          </div>
        </div>
      )}
      <div className="hidden sm:block">
        {menuList.map((menu) => (
          <Link
            key={menu.link}
            to={menu.link}
            className={`${
              scrolled ? "text-sm" : "text-lg"
            } ml-5 transition-all duration-300 inline-block mr-2 ${
              menu.isActive ? "text-yellow-500" : "text-white"
            } font-bold cursor-pointer`}
          >
            {menu.name}
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
        <div className="flex items-center gap-2 ml-auto">
          <div className="flex flex-col items-end">
            <div className="text-xs text-right px-3">{currentUser?.username}</div>
            <div className={`text-white px-3 rounded-full font-bold text-sm`}>
              💰 {formatPoints(currentUser?.data.availableScore || 0)}
            </div>
          </div>

          <NotificationDropdown />

          <div className="text-gray-400">|</div>
          <div
            className="text-white cursor-pointer flex items-center gap-1 hover:text-yellow-300 transition-colors"
            onClick={() => {
              logout();
            }}
          >
            <span></span>
            <HiOutlineLogout size={20} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
