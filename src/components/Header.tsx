import { useEffect, useState } from "react";
import { logoutAction } from "../state/authSlice";
import { useAppDispatch } from "../state/hooks";
import Logo from "@/assets/img/logo3.png";
import { HiOutlineLogout } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import useMenu from "@/hooks/useMenu";
import { RiMenu2Fill } from "react-icons/ri";

const Header = ({
  isMenuOpen,
  setIsMenuOpen,
}: {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}) => {
  const navigate = useNavigate();
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
      <RiMenu2Fill
        color="white"
        size={25}
        className="sm:hidden cursor-pointer mr-4"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      />
      <div className="rounded-full">
        <img
          src={Logo}
          alt="Logo"
          onClick={() => navigate("/")}
          className={`${
            scrolled ? "h-8" : "h-12"
          } transition-all duration-300 inline-block mr-2 cursor-pointer`}
        />
      </div>
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
      <div
        className="ml-auto text-white cursor-pointer flex items-center gap-2"
        onClick={() => dispatch(logoutAction())}
      >
        <p>Kilépés</p>
        <HiOutlineLogout size={20} />
      </div>
    </div>
  );
};

export default Header;
