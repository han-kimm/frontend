"use client";

import { useCallback, useEffect, useState } from "react";

function useGetWindowWidth() {
  const [isPc, setIsPc] = useState(false);
  const [innerWidth, setInnerWidth] = useState(0);

  const resizeListener = useCallback(() => {
    const newWidth = window.innerWidth;
    setInnerWidth(newWidth);
    setIsPc(newWidth > 1200);
  }, []);

  useEffect(() => {
    if (!innerWidth) {
      setInnerWidth(window.innerWidth);
    }

    window.addEventListener("resize", resizeListener);

    return () => {
      window.removeEventListener("resize", resizeListener);
    };
  }, []);

  return { innerWidth, isPc };
}

export default useGetWindowWidth;
