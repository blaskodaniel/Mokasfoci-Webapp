import { useMemo } from "react";
import { useLocation } from "react-router-dom";

const useMenu = () => {
  const location = useLocation();

  const menuList = useMemo(
    () => [
      {
        name: "Szavazó",
        link: "/fooldal",
        isActive: location.pathname === "/fooldal",
      },
      {
        name: "Ajánló",
        link: "/ajanlo",
        isActive: location.pathname === "/ajanlo",
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
