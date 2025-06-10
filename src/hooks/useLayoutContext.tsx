"use client";
import React, { createContext, useContext, useMemo, useState } from "react";

import { LayoutContextType } from "@/types/menu";

export const LayoutContext = createContext<LayoutContextType>({
  primary: "",
  menuKey: "",
  setPrimary: () => {},
  setMenuKey: () => {},
});

export const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
  const [primary, setPrimary] = useState("#1677ff");
  const [menuKey, setMenuKey] = useState("0");

  const contextValue = useMemo(
    () => ({ primary, setPrimary, menuKey, setMenuKey }),
    [primary, menuKey],
  );

  return (
    <LayoutContext.Provider value={contextValue}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayoutContext = () => {
  const context = useContext(LayoutContext);
  return context;
};
