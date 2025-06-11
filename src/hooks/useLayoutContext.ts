"use client";
import { createContext, useContext } from "react";

import { LayoutContextType } from "@/types/menu";

export const InnerLayoutContext = createContext<LayoutContextType>({
  primary: "",
  menuKey: "",
  setPrimary: () => {},
  setMenuKey: () => {},
});

export const useLayoutContext = () => {
  const context = useContext(InnerLayoutContext);
  return context;
};
