"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

let isFirstLoad = true;

export function LoadingScreen() {
  const container = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const textWrapperRef = useRef<HTMLDivElement>(null);
  const textFillRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [isDone, setIsDone] = useState(false);
  const [customText, setCustomText] = useState<string | null>(null);

  // Capture whether this is the initial site load
  const isInitialAnimation = useRef(isFirstLoad);

  useEffect(() => {
    // Force scroll to top on mount
    if (typeof window !== 'undefined') {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }

      if (isFirstLoad) {
        isFirstLoad = false;
        // Strip the hash on hard reload so we don't jump to sections
        if (window.location.hash) {
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }
        window.scrollTo(0, 0);
      } else if (!window.location.hash) {
        // On client-side navigation, scroll to top if no hash
        window.scrollTo(0, 0);
      }
    }

    // Check initial hash for cross-page hash navigations (only matters if we didn't just strip it)
    if (typeof window !== 'undefined' && window.location.hash === '#contact') {
      setCustomText('GET IN TOUCH');
    }

    const handleTrigger = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setCustomText(customEvent.detail);
      }
      setIsDone(false);
    };

    window.addEventListener('trigger-loading', handleTrigger);
    return () => window.removeEventListener('trigger-loading', handleTrigger);
  }, []);

  useEffect(() => {
    // Prevent scrolling while loading
    document.body.style.overflow = "hidden";

    // Hide the header logo instantly if it exists (for page transitions)
    const headerLogo = document.getElementById("header-logo");
    if (headerLogo) {
      gsap.set(headerLogo, { opacity: 0 });
    }

    const isMobileTablet = window.innerWidth < 1024;
    const initialLogoSize = isMobileTablet ? "70px" : "120px";
    const targetScale = isMobileTablet ? 2.0 : 2.5;

    // Set initial position using GSAP to avoid conflict with CSS
    gsap.set(logoRef.current, { 
      xPercent: -50, 
      yPercent: -50, 
      top: "50%", 
      left: "50%",
      width: initialLogoSize,
      height: initialLogoSize,
      scale: 1,
      opacity: 1
    });

    let fallbackTimeout: ReturnType<typeof setTimeout>;

    const tl = gsap.timeline({
      onComplete: () => {
        clearTimeout(fallbackTimeout);
        setIsDone(true);
        document.body.style.overflow = "";
        
        // Ensure we scroll to the hash if it exists
        if (window.location.hash) {
          const el = document.querySelector(window.location.hash);
          if (el) {
            // Use setTimeout to allow DOM to update overflow before scrolling
            setTimeout(() => el.scrollIntoView({ behavior: 'auto' }), 10);
          }
        }

        // Show the actual header logo instantly so there is no flash when the animated one unmounts
        const headerLogo = document.getElementById("header-logo");
        if (headerLogo) {
          gsap.set(headerLogo, { opacity: 1 });
        }
        
        // Dispatch event to tell Header to expand now that logo has arrived
        window.dispatchEvent(new CustomEvent("logo-arrived"));
      },
    });

    // 1. Make it bigger and bigger
    tl.to(logoRef.current, {
      scale: targetScale,
      duration: 1.0,
      ease: "power2.inOut",
    });

    if (isInitialAnimation.current) {
      // 2. Fill the letters (acts as loading bar, keeping user waiting)
      // Overlap completely with the logo animation
      tl.fromTo(textFillRef.current, 
        { clipPath: "inset(0% 100% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.0, ease: "power1.out" },
        "<"
      );

      // 3. Rest (pause briefly after filling)
      tl.to({}, { duration: 0.2 });
    } else {
      // For page transitions, fill letters concurrently with logo expanding to save time
      tl.fromTo(textFillRef.current, 
        { clipPath: "inset(0% 100% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.0, ease: "power1.out" },
        "<" // Start at the exact same time as the logo expansion
      );

      // Brief rest
      tl.to({}, { duration: 0.1 });
    }

    // 5. Fade out text before moving logo
    tl.to(textWrapperRef.current, {
      opacity: 0,
      duration: 0.2,
    });

    // 6. Animate to the header
    // Use a small timeout to ensure layout is ready to measure
    tl.add(() => {
      // Dispatch app-loaded so HeroSection animates WHILE logo is moving
      window.dispatchEvent(new CustomEvent("app-loaded"));

      const headerLogo = document.getElementById("header-logo");
      if (headerLogo) {
        const targetRect = headerLogo.getBoundingClientRect();
        
        // Animate the background fading out
        gsap.to(container.current, {
          backgroundColor: "rgba(255, 255, 255, 0)", // white fade out
          duration: 1,
          ease: "power3.inOut",
        });

        // Animate the logo to the exact position and size of the header logo
        gsap.to(logoRef.current, {
          top: targetRect.top + targetRect.height / 2,
          left: targetRect.left + targetRect.width / 2,
          width: targetRect.width,
          height: targetRect.height,
          scale: 1,
          duration: 1,
          ease: "power3.inOut",
        });
      }
    }, "+=0.1");

    // Hold the timeline for the duration of the movement animation
    tl.to({}, { duration: 1.1 });

    // Fallback: Force complete loading after 6 seconds to ensure the site is never stuck
    fallbackTimeout = setTimeout(() => {
      console.warn("Loading screen stuck, executing fallback timeout");
      document.body.style.overflow = "";
      
      if (window.location.hash) {
        const el = document.querySelector(window.location.hash);
        if (el) setTimeout(() => el.scrollIntoView({ behavior: 'auto' }), 10);
      }

      const headerLogo = document.getElementById("header-logo");
      if (headerLogo) {
        gsap.set(headerLogo, { opacity: 1 });
      }
      
      window.dispatchEvent(new CustomEvent("app-loaded"));
      window.dispatchEvent(new CustomEvent("logo-arrived"));
      setIsDone(true);
    }, 6000);

    return () => {
      clearTimeout(fallbackTimeout);
    };
  }, []);

  const getLoadingText = (path: string) => {
    if (customText) return customText;
    return 'DOLLYVA';
  };

  if (isDone) return null;

  return (
    <div
      ref={container}
      className="fixed inset-0 z-[100] bg-white pointer-events-none"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={logoRef}
        src="/logo.jpg"
        alt="Logo Loading"
        className="fixed object-contain z-[101] w-[70px] h-[70px] lg:w-[120px] lg:h-[120px]"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%) scale(1)",
        }}
      />

      {/* Text Loading Bar */}
      <div
        ref={textWrapperRef}
        className="fixed left-1/2 -translate-x-1/2 z-[101] top-[calc(50%+110px)] lg:top-[calc(50%+180px)]"
      >
        <div
          ref={textFillRef}
          className="text-xl sm:text-2xl lg:text-5xl font-black tracking-[0.4em] text-zinc-900 whitespace-nowrap"
          style={{ clipPath: "inset(0% 100% 0% 0%)" }}
        >
          {getLoadingText(pathname)}
        </div>
      </div>
    </div>
  );
}
