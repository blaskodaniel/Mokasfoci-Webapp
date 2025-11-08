import Logo from "@/assets/img/logo3.png";
import useMenu from "@/hooks/useMenu";
import { Link, useNavigate } from "react-router-dom";
import { IoCloseOutline } from "react-icons/io5";

const MobileMenu = ({
  isOpen,
  setIsMenuOpen,
}: {
  isOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}) => {
  const navigate = useNavigate();
  const { menuList } = useMenu();

  return (
    <div
      className={`fixed left-0 z-50 h-full min-w-60 bg-primary shadow-md flex flex-col items-center p-2 ${
        isOpen ? "block" : "hidden"
      } shadow-lg shadow-black/20`}
    >
      <div className="flex items-center w-full justify-between">
        <img
          src={Logo}
          alt="Logo"
          onClick={() => navigate("/")}
          className={`h-12 transition-all duration-300 inline-block mr-2 cursor-pointer`}
        />
        <IoCloseOutline
          color="white"
          size={25}
          onClick={() => setIsMenuOpen(false)}
          className="absolute top-4 right-4 cursor-pointer"
        />
      </div>
      <div className="mt-10 flex flex-col items-start gap-4">
        {menuList.map((menu) => (
          <Link
            key={menu.link}
            to={menu.link}
            className={` text-2xl ml-5 transition-all duration-300 inline-block mr-2 ${
              menu.isActive ? "text-yellow-500" : "text-white"
            } font-bold cursor-pointer`}
          >
            {menu.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileMenu;
