import { useState, useEffect } from "react";
import type { FC, ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { decryptData } from "@/components/common/EncryptionDecryption";

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const usertype_descryption: string | null = localStorage.getItem("user_type");

  const usertype_id: string = decryptData(usertype_descryption);
  useEffect(() => {
    const handleResize = (): void => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = (): void => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleCollapse = (): void => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
        toggleCollapse={toggleCollapse}
        isCollapsed={isCollapsed}
      />
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        isCollapsed={isCollapsed}
        usertype_id={usertype_id}
      />
      <main
        className={`transition-all duration-300 pt-16 ${
          isCollapsed ? "lg:ml-16" : "lg:ml-64"
        }`}
      >
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 lg:hidden z-20"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        <div className="p-3 relative md:mx-1">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
