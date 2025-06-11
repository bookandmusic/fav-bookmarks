"use client";
import { SessionProvider } from "next-auth/react";
import React, { useMemo, useState } from "react";

import { InnerLayoutContext } from "@/hooks/useLayoutContext";

export const InnerLayoutProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [primary, setPrimary] = useState("#1677ff");
  const [menuKey, setMenuKey] = useState("0");

  const contextValue = useMemo(
    () => ({ primary, setPrimary, menuKey, setMenuKey }),
    [primary, menuKey],
  );

  return (
    <InnerLayoutContext.Provider value={contextValue}>
      {children}
    </InnerLayoutContext.Provider>
  );
};

export function ProvidreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SessionProvider>
        <InnerLayoutProvider>{children}</InnerLayoutProvider>
      </SessionProvider>
    </>
  );
}
