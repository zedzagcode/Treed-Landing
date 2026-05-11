import { useEffect } from "react";
import { useLocation } from "wouter";

export default function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    // Reset standard scroll position
    window.scrollTo(0, 0);
    // Ensure document element and body are also reset
    document.documentElement.scrollTo(0, 0);
    document.body.scrollTo(0, 0);
  }, [location]);

  return null;
}
