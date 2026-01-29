import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import MobileMenu from "@/components/MobileMenu";
import useResponsive from "./hooks/useResponsive";
import { NotificationContainer } from "./components/Notification";

const Layout = () => {
  const { isMobile } = useResponsive();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [version, setVersion] = useState("1.0.0");
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  useEffect(() => {
    fetch("/version.json")
      .then((res) => res.json())
      .then((data) => setVersion(data.version))
      .catch(() => setVersion("1.0.0"));
  }, []);

  return (
    <div className="flex flex-col min-h-screen overflow-y-auto bg-secondary">
      {/* Header */}
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      {isMobile && <MobileMenu isOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />}

      {/* Main Content */}
      <div className="md:flex md:justify-center mt-12 sm:mt-15 px-1">
        <div className="flex-1 max-w-7xl">
          {/* Tab Content */}
          <div className="flex-1 mt-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                // exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Modals */}
          <NotificationContainer />
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto py-4 text-center text-xs text-gray-500 border-t border-gray-700">
        <div>© 2026 Mokasfoci | v{version}</div>
      </footer>
    </div>
  );
};

export default Layout;
