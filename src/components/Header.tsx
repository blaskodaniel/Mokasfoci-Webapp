import { useEffect, useState } from "react";
import { logoutAction } from "../state/authSlice";
import { useAppDispatch } from "../state/hooks";
import { HiOutlineLogout, HiOutlineMenuAlt3 } from "react-icons/hi";
import { Link } from "react-router-dom";
import useMenu from "@/hooks/useMenu";
import useResponsive from "@/hooks/useResponsive";
import { useAuth } from "@/hooks/useAuth";

const Header = ({
  isMenuOpen,
  setIsMenuOpen,
}: {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}) => {
  const { isDesktop } = useResponsive();
  const { logout } = useAuth();
  const dispatch = useAppDispatch();
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
        scrolled ? "h-10" : "h-16"
      } bg-primary shadow-md flex items-center px-6`}
    >
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

      <HiOutlineMenuAlt3
        color="white"
        size={25}
        className="sm:hidden cursor-pointer ml-auto"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      />
      {isDesktop && (
        <div
          className="text-white cursor-pointer flex items-center gap-2 ml-auto"
          onClick={() => {
            dispatch(logoutAction());
            logout();
          }}
        >
          <span>Kilépés</span>
          <HiOutlineLogout size={20} />
        </div>
      )}
    </div>
  );
};

export default Header;
