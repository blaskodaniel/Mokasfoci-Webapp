import { useMemo } from "react";
import { useLocation } from "react-router-dom";

const useMenu = () => {
  const location = useLocation();

  const menuList = useMemo(
    () => [
      {
        name: "Főoldal",
        link: "/fooldal",
        isActive: location.pathname === "/fooldal",
      },
      {
        name: "Fogadásaim",
        link: "/fogadasaim",
        isActive: location.pathname === "/fogadasaim",
      },
      {
        name: "Profilom",
        link: "/profil",
        isActive: location.pathname === "/profil",
      },
    ],
    [location.pathname]
  );
  return { menuList };
};

export default useMenu;
