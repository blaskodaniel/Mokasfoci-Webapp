import useMenu from "@/hooks/useMenu";
import { Link } from "react-router-dom";
import { IoCloseOutline } from "react-icons/io5";
import { useAppDispatch } from "@/state/hooks";
import { logoutAction } from "@/state/authSlice";
import { HiOutlineLogout } from "react-icons/hi";
import { useAuth } from "@/hooks/useAuth";

const MobileMenu = ({
  isOpen,
  setIsMenuOpen,
}: {
  isOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}) => {
  const { logout } = useAuth();
  const { menuList } = useMenu();
  const dispatch = useAppDispatch();

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile Menu */}
      <div
        className={`fixed right-0 top-0 z-50 h-full min-w-60 bg-primary 
          shadow-lg shadow-black/20 flex flex-col items-center p-2 transform 
          transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex items-center w-full justify-center mt-3">
          <IoCloseOutline
            size={29}
            onClick={() => setIsMenuOpen(false)}
            className="text-white/70 cursor-pointer transition-transform duration-200 hover:scale-110"
          />
        </div>
        <div className="flex flex-col justify-between h-full w-full items-center mt-2 gap-8">
          <div className="mt-8 flex flex-col items-center gap-4 w-full">
            <div className="w-22 h-22 rounded-full shadow-lg mb-5">
              <img
                src={"/wm26.png"}
                alt="Avatar"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            {menuList.map((menu, index) => (
              <Link
                key={menu.link}
                to={menu.link}
                onClick={() => setIsMenuOpen(false)}
                className={`text-2xl transition-all duration-300 inline-block transform ${
                  menu.isActive ? "text-yellow-500" : "text-white"
                } font-bold cursor-pointer hover:-translate-x-2 ${
                  isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
                style={{
                  transitionDelay: isOpen ? `${index * 50}ms` : "0ms",
                }}
              >
                {menu.name}
              </Link>
            ))}
          </div>

          <div
            className="text-white font-medium cursor-pointer flex items-center justify-end 
            gap-2 border border-border rounded-md p-2  transition-colors w-full pr-4 mb-1"
            onClick={() => {
              dispatch(logoutAction());
              logout();
            }}
          >
            <span>Kilépés</span>
            <HiOutlineLogout size={20} />
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
