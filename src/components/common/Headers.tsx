import { useEffect, useId, useRef, useState, type JSX, type MouseEvent as ReactMouseEvent } from "react";
import { Link, useLocation } from "react-router-dom";

type TitleProps = {
  variant?: "page" | "navbar";
};

export function Title({ variant = "page" }: TitleProps) {
  const Element: keyof JSX.IntrinsicElements = variant === "page" ? "h1" : "span";
  const className = variant === "page" ? "title" : "title title--navbar";
  return <Element className={className}>KRONOSCOPE</Element>;
}

const NAV_ITEMS = [
  { to: "/", label: "Home" },
  { to: "/milestones", label: "Milestones" },
  { to: "/timescales", label: "Timescales" },
  { to: "/settings", label: "Settings" },
  { to: "/about", label: "About" },
] as const;

const DRAWER_EXIT_MS = 360;

type NavItem = (typeof NAV_ITEMS)[number];

type NavbarProps = {
  onNavigateAttempt?: (to: NavItem["to"]) => boolean;
};

export function Navbar({ onNavigateAttempt }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const location = useLocation();
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (open) setDrawerVisible(true);
  }, [open]);

  useEffect(() => {
    if (open || !drawerVisible) return;
    if (typeof window === "undefined") {
      setDrawerVisible(false);
      return;
    }

    const timer = window.setTimeout(() => setDrawerVisible(false), DRAWER_EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [drawerVisible, open]);

  useEffect(() => {
    if (!drawerVisible) return;
    if (typeof document === "undefined") return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKey);
    };
  }, [drawerVisible]);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (typeof window.matchMedia !== "function") return;
    const query = window.matchMedia("(min-width: 960px)");
    const closeOnDesktop = () => {
      if (query.matches) setOpen(false);
    };

    closeOnDesktop();
    query.addEventListener("change", closeOnDesktop);
    return () => query.removeEventListener("change", closeOnDesktop);
  }, []);

  const closeDrawer = () => {
    setOpen(false);
    if (typeof window !== "undefined") {
      window.requestAnimationFrame(() => toggleRef.current?.focus());
    }
  };

  const toggle = () => setOpen(value => !value);
  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const handleNavClick = (item: NavItem, evt: ReactMouseEvent<HTMLAnchorElement>) => {
    if (onNavigateAttempt && !onNavigateAttempt(item.to)) {
      evt.preventDefault();
    }
    closeDrawer();
  };

  const handleBrandClick = (evt: ReactMouseEvent<HTMLAnchorElement>) => {
    if (onNavigateAttempt && !onNavigateAttempt("/")) {
      evt.preventDefault();
    }
    closeDrawer();
  };

  const renderNavLinks = (variant: "inline" | "drawer") => (
    NAV_ITEMS.map(item => (
      <Link
        key={`${variant}-${item.to}`}
        to={item.to}
        className={`app-navbar__link ${
          isActive(item.to) ? "app-navbar__link--active" : ""
        }`}
        onClick={evt => handleNavClick(item, evt)}
      >
        {item.label}
      </Link>
    ))
  );

  return (
    <>
      <header className="app-navbar">
        <Link
          to="/"
          className="app-navbar__brand"
          aria-label="Go to landing page"
          onClick={handleBrandClick}
        >
          <span className="app-navbar__brand-mark" aria-hidden="true" />
          <Title variant="navbar" />
        </Link>

        <nav className="app-navbar__inline-nav" aria-label="Primary navigation">
          {renderNavLinks("inline")}
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className="app-navbar__menu-toggle"
          onClick={toggle}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={`${menuId}-drawer`}
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        >
          <span className="app-navbar__menu-icon" aria-hidden="true" />
        </button>
      </header>

      {drawerVisible && (
        <div
          className={`app-navbar__drawer-layer ${
            open ? "app-navbar__drawer-layer--open" : "app-navbar__drawer-layer--closing"
          }`}
          aria-hidden={!open}
        >
          <button
            type="button"
            className="app-navbar__drawer-backdrop"
            aria-label="Close navigation menu"
            onClick={closeDrawer}
          />
          <div
            id={`${menuId}-drawer`}
            className="app-navbar__drawer"
            role="dialog"
            aria-modal={open}
            aria-label="Mobile navigation"
          >
            <div className="app-navbar__drawer-header">
              <span className="app-navbar__drawer-title">Navigation</span>
              <button
                type="button"
                className="app-navbar__drawer-close"
                onClick={closeDrawer}
                aria-label="Close navigation menu"
              >
                <span aria-hidden="true">x</span>
              </button>
            </div>
            <nav className="app-navbar__drawer-links" aria-label="Primary navigation">
              {renderNavLinks("drawer")}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
