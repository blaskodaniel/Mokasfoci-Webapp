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
        name: "Toplista",
        link: "/toplista",
        isActive: location.pathname === "/toplista",
      },
      {
        name: "Profilom",
        link: "/profilom",
        isActive: location.pathname === "/profilom",
      },
    ],
    [location.pathname]
  );
  return { menuList };
};

export default useMenu;
