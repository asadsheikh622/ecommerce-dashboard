import { useState, useEffect } from 'react';

export interface Breakpoints {
  isNarrowMobile: boolean; // < 375px
  isMobile: boolean;       // < 600px
  isSmallTablet: boolean;  // 600px - 767px
  isTablet: boolean;       // 768px - 1023px
  isDesktop: boolean;      // 1024px - 1279px
  isLargeDesktop: boolean; // >= 1280px
  isBelow768: boolean;     // < 768px (Mobile & Small Tablet)
  width: number;
}

export function useBreakpoint(): Breakpoints {
  const [width, setWidth] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth;
    }
    return 1280;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const handleResize = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setWidth(window.innerWidth);
      }, 50);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return {
    isNarrowMobile: width < 375,
    isMobile: width < 600,
    isSmallTablet: width >= 600 && width < 768,
    isTablet: width >= 768 && width < 1024,
    isDesktop: width >= 1024 && width < 1280,
    isLargeDesktop: width >= 1280,
    isBelow768: width < 768,
    width,
  };
}
