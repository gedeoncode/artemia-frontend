
import { useEffect, useState } from "react";

export function useSidebarCollapse() {
    const [openMobile, setOpenMobile] = useState(false);
      const [collapsed, setCollapsed] = useState(false); // Default state that matches server render
      const [isInitialized, setIsInitialized] = useState(false); // Track initialization
    
      useEffect(() => {
        // Only run on client after mount
        const stored = localStorage.getItem("sidebar-collapsed");
        setCollapsed(stored === "true");
        setIsInitialized(true);
      }, []);
    
      useEffect(() => {
        if (isInitialized) {
          localStorage.setItem("sidebar-collapsed", String(collapsed));
        }
      }, [collapsed, isInitialized]);

  return { collapsed, setCollapsed, isInitialized, openMobile, setOpenMobile };
}
