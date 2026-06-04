"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { LoaderCircle } from "lucide-react";

type NavigationContextValue = {
  startNavigation: () => void;
};

const NavigationContext = createContext<NavigationContextValue | null>(null);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [navigating, setNavigating] = useState(false);
  const startedAt = useRef(0);
  const previousPathname = useRef(pathname);
  const stopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startNavigation = useCallback(() => {
    if (stopTimer.current) clearTimeout(stopTimer.current);
    startedAt.current = Date.now();
    setNavigating(true);
  }, []);

  useEffect(() => {
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;
    if (!navigating) return;
    const minimumVisibleTime = 300;
    const remaining = Math.max(0, minimumVisibleTime - (Date.now() - startedAt.current));
    stopTimer.current = setTimeout(() => setNavigating(false), remaining);
    return () => {
      if (stopTimer.current) clearTimeout(stopTimer.current);
    };
  }, [pathname, navigating]);

  useEffect(() => {
    function handleInternalLinkClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest("a");
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;
      const destination = new URL(link.href, window.location.href);
      if (destination.origin !== window.location.origin) return;
      if (`${destination.pathname}${destination.search}` === `${window.location.pathname}${window.location.search}`) return;
      startNavigation();
    }

    document.addEventListener("click", handleInternalLinkClick, true);
    return () => document.removeEventListener("click", handleInternalLinkClick, true);
  }, [startNavigation]);

  return (
    <NavigationContext.Provider value={{ startNavigation }}>
      {children}
      {navigating && (
        <div className="navigation-loader" role="status" aria-live="polite">
          <span className="navigation-progress" />
          <span className="navigation-loader-label"><LoaderCircle className="spin" size={15} />Loading...</span>
        </div>
      )}
    </NavigationContext.Provider>
  );
}

export function useNavigationLoader() {
  const context = useContext(NavigationContext);
  if (!context) throw new Error("NavigationProvider is required.");
  return context;
}
