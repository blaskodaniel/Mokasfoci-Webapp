import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import MobileMenu from "@/components/MobileMenu";
import useResponsive from "./hooks/useResponsive";
import { NotificationContainer } from "./components/Notification";

const Layout = () => {
  const { isMobile } = useResponsive();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <div className="flex flex-col min-h-screen overflow-y-auto bg-secondary">
      {/* Header */}
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      {isMobile && (
        <MobileMenu isOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      )}

      {/* Main Content */}
      <div className="md:flex md:justify-center mt-15">
        <div className="flex-1 max-w-7xl">
          {/* Tab Content */}
          <div className="flex-1 mt-5">
            <Outlet />
          </div>

          {/* Modals */}
          <NotificationContainer />
        </div>
      </div>

      {/* Footer */}
      {/* <Footer /> */}
    </div>
  );
};

export default Layout;
