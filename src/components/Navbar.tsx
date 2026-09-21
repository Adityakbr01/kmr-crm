import { useState } from "react";
import type { FC } from "react";
import {
  FaBars,
  FaTimes,
  FaExpand,
  FaCompress,
  FaChevronRight,
  FaChevronLeft,
  FaUserCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Slide,
} from "@mui/material";
import kmrLogo from "@/assets/kmrlive.png";
import { ButtonCancel, ButtonCss } from "@/components/common/ButtonCss";

const Transition: any = (props: any) => <Slide direction="up" {...props} />;

interface NavbarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
  toggleCollapse: () => void;
  isCollapsed: boolean;
}

const Navbar: FC<NavbarProps> = ({
  toggleSidebar,
  isSidebarOpen,
  toggleCollapse,
  isCollapsed,
}) => {
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogout = (): void => {
    localStorage.clear();
    navigate("/");
    toast.success("Logged out successfully");
  };

  const toggleFullscreen = (): void => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e: any) => {
        console.log(`Error attempting to enable fullscreen: ${e.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full top-0 z-50">
      <div className="px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={kmrLogo} alt="KMR Logo" className="h-8" />
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors block lg:hidden"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
          <button
            onClick={toggleCollapse}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors hidden lg:inline-block"
            aria-label="Collapse sidebar"
          >
            {isCollapsed ? (
              <FaChevronRight size={20} />
            ) : (
              <FaChevronLeft size={20} />
            )}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleFullscreen}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors hidden lg:block"
            aria-label="Toggle fullscreen"
          >
            {isFullscreen ? <FaCompress size={20} /> : <FaExpand size={20} />}
          </button>
          <div className="relative lg:hidden">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle dropdown"
            >
              <FaUserCircle className="text-blue-700" size={20} />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                <button
                  className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                  onClick={() => navigate("/profile")}
                >
                  Profile
                </button>
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsLogoutDialogOpen(true);
                  }}
                  className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => navigate("/profile")}
              className={ButtonCancel}
            >
              Profile
            </button>
            <button
              onClick={() => setIsLogoutDialogOpen(true)}
              className={ButtonCss}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      <Dialog
        open={isLogoutDialogOpen}
        fullWidth
        maxWidth="sm"
        TransitionComponent={Slide}
        transitionDuration={500}
        sx={{
          backdropFilter: "blur(4px)",
        }}
        keepMounted
        onClose={() => setIsLogoutDialogOpen(false)}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
      >
        <DialogTitle
          id="logout-dialog-title"
          sx={{ fontWeight: 600, fontSize: "1.5rem" }}
        >
          {" "}
          Confirm Logout
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="logout-dialog-description">
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <button
            onClick={() => setIsLogoutDialogOpen(false)}
            className={ButtonCancel}
          >
            Cancel
          </button>
          <button onClick={handleLogout} className={ButtonCss}>
            Logout
          </button>
        </DialogActions>
      </Dialog>
    </nav>
  );
};

export default Navbar;
