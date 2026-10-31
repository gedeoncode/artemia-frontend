export type CategoryMenuController = {
  isMobile: boolean;
  isOpen: boolean;
  openDesktopMenu: () => void;
  closeDesktopMenu: () => void;
  menuRef: React.RefObject<HTMLDivElement | null>;
};
