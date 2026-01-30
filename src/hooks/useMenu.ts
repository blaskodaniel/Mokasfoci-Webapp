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
        name: "Mérkőzések",
        link: "/merkozesek",
        isActive: location.pathname === "/merkozesek",
      },
      {
        name: "Ranglista",
        link: "/ranglista",
        isActive: location.pathname === "/ranglista",
      },
      {
        name: "Profilom",
        link: "/profilom",
        isActive: location.pathname === "/profilom",
      },
      {
        name: "Csoportok",
        link: "/csoportok",
        isActive: location.pathname === "/csoportok",
      },
      {
        name: "Statisztikák",
        link: "/statisztikak",
        isActive: location.pathname === "/statisztikak",
      },
    ],
    [location.pathname]
  );
  return { menuList };
};

export default useMenu;
