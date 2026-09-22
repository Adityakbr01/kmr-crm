import { useEffect, useState } from "react";
import type { FC } from "react";
import {
  FiCheckSquare,
  FiChevronDown,
  FiChevronRight,
  FiFolder,
  FiHome,
} from "react-icons/fi";
import type { IconType } from "react-icons";
import { IoIosNotificationsOutline } from "react-icons/io";
import { NavLink, useLocation } from "react-router-dom";

interface SubItem {
  name: string;
  path: string;
}

interface MenuItem {
  name: string;
  path?: string;
  icon: IconType;
  subitems?: SubItem[];
}

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isCollapsed: boolean;
  usertype_id: string;
}

const Sidebar: FC<SidebarProps> = ({
  isOpen,
  setIsOpen,
  isCollapsed,
  usertype_id,
}) => {
  const [openSubmenu, setOpenSubmenu] = useState<string>("");
  const location = useLocation();

  const menuItems: MenuItem[] = [
    {
      name: "Dashboard",
      path: "/home",
      icon: FiHome,
    },
    {
      name: "Master",
      icon: FiFolder,
      subitems: [
        { name: "Category", path: "/master/category" },
        { name: "SubCategory", path: "/master/subcategory" },
        { name: "Vendor", path: "/master/vendor" },
        { name: "Vendor User", path: "/master/vendor-user" },
      ],
    },
    {
      name: "App Update",
      icon: FiCheckSquare,
      subitems: [
        { name: "Live", path: "/app-update/live" },
        { name: "Rates", path: "/app-update/rates" },
        { name: "Spot", path: "/app-update/spot" },
        { name: "News", path: "/app-update/news" },
        ...(Number(usertype_id) === 4
          ? [{ name: "App Sliders", path: "/app-update/slider" }]
          : []),
      ],
    },
    {
      name: "Notification",
      path: "/notification",
      icon: IoIosNotificationsOutline,
    },
    // {
    //   name: "Website Enquiry",
    //   path: "/website-enquiry",
    //   icon: CgWebsite,
    // },
  ];
  useEffect(() => {
    const currentSubmenu = menuItems.find((item) =>
      item.subitems?.some((subitem) => subitem.path === location.pathname)
    );

    if (currentSubmenu) {
      setOpenSubmenu(currentSubmenu.name);
    }
  }, [location.pathname]);

  const handleSubmenuClick = (itemName: string): void => {
    setOpenSubmenu(openSubmenu === itemName ? "" : itemName);
  };

  const handleLinkClick = (): void => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed left-0 top-16 h-[calc(100vh-4.5rem)] bg-white border-r border-gray-200 transition-all duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        ${isCollapsed ? "lg:w-[4.5rem]" : "lg:w-64"}
        w-64 z-40 overflow-y-auto`}
      >
        <div className="p-4">
          {menuItems.map((item) => (
            <div key={item.name}>
              {item.subitems ? (
                <div
                  onClick={() => handleSubmenuClick(item.name)}
                  className="mb-1 cursor-pointer p-2 rounded-lg hover:bg-gray-100 text-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    {!isCollapsed && (
                      <div className="flex items-center justify-between flex-1">
                        <span className="text-sm font-medium">{item.name}</span>
                        {openSubmenu === item.name ? (
                          <FiChevronDown className="w-4 h-4" />
                        ) : (
                          <FiChevronRight className="w-4 h-4" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <NavLink
                  to={item.path}
                  onClick={handleLinkClick}
                  className={({ isActive }) => `
                  mb-1 flex items-center gap-3 p-2 rounded-lg transition-colors
                  ${
                    isActive
                      ? "bg-accent-50 text-accent-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }
                `}
                >
                  <item.icon className="w-5 h-5" />
                  {!isCollapsed && (
                    <span className="text-sm font-medium">{item.name}</span>
                  )}
                </NavLink>
              )}

              {!isCollapsed && item.subitems && openSubmenu === item.name && (
                <div className="ml-9 mb-2">
                  {item.subitems.map((subItem) => (
                    <NavLink
                      key={subItem.name}
                      to={subItem.path}
                      onClick={handleLinkClick}
                      className={({ isActive }) => `
                      py-2 px-3 text-sm rounded-lg block transition-colors
                      ${
                        isActive
                          ? "bg-accent-50 text-accent-600"
                          : "text-gray-600 hover:bg-gray-100"
                      }
                    `}
                    >
                      {subItem.name}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
