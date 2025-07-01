"use client";

import * as React from "react";

interface ThemeProviderProps {
  children: React.ReactNode;
  attribute?: string;
  defaultTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "light",
}: ThemeProviderProps) {
  React.useEffect(() => {
    // Set the default theme on the document
    if (attribute === "class") {
      document.documentElement.className = defaultTheme;
    } else {
      document.documentElement.setAttribute(attribute, defaultTheme);
    }
  }, [attribute, defaultTheme]);

  return <>{children}</>;
}
