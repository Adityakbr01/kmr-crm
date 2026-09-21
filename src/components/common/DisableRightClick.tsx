import React, { useEffect } from "react";
import { toast } from "sonner";

// Controlled via .env files (Vite exposes only VITE_* vars to the browser):
//   .env              -> VITE_ALLOW_DEVTOOLS=false (default: right-click + devtools blocked)
//   .env.development  -> VITE_ALLOW_DEVTOOLS=true  (dev: everything allowed)
const allowDevtools: boolean = import.meta.env.VITE_ALLOW_DEVTOOLS === "true";

const DisableRightClick: React.FC = () => {
  useEffect(() => {
    if (allowDevtools) return; // development mode: attach no blockers

    const handleRightClick = (e: MouseEvent): void => {
      e.preventDefault();
      toast.info("No Access.");
    };

    const handleKeyDown = (e: KeyboardEvent): boolean | void => {
      if (
        e.key === "F12" || // F12 - Dev Tools
        (e.ctrlKey && e.key.toLowerCase() === "u") || // Ctrl + U - View Source
        (e.ctrlKey && e.key.toLowerCase() === "s") || // Ctrl + S - Save Page
        (e.ctrlKey && e.key.toLowerCase() === "h") || // Ctrl + H - History
        // (e.ctrlKey && e.key.toLowerCase() === "a") || // Ctrl + A - Select All
        (e.ctrlKey && e.key.toLowerCase() === "p") || // Ctrl + P - Print
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "i") || // Ctrl + Shift + I - Dev Tools
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "j") || // Ctrl + Shift + J - Dev Console
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "c") || // Ctrl + Shift + C - Inspect
        (e.metaKey && e.key.toLowerCase() === "s") || // CMD + S (Mac Save Page)
        (e.metaKey && e.key.toLowerCase() === "u") // CMD + U (Mac View Source)
      ) {
        e.preventDefault();
        toast.warning("This action is disabled on this page.");
        return false;
      }
    };

    // Add event listeners
    document.addEventListener("contextmenu", handleRightClick);
    document.addEventListener("keydown", handleKeyDown);
    document.onkeydown = handleKeyDown;

    return () => {
      document.removeEventListener("contextmenu", handleRightClick);
      document.removeEventListener("keydown", handleKeyDown);
      document.onkeydown = null;
    };
  }, []);

  return null;
};

export default DisableRightClick;
