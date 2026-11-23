import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type AuthTab = "login" | "register";

type AuthModalContextValue = {
  open: boolean;
  tab: AuthTab;
  show: (tab?: AuthTab) => void;
  hide: () => void;
  setTab: (tab: AuthTab) => void;
};

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<AuthTab>("login");

  const value = useMemo(
    () => ({
      open,
      tab,
      show: (next: AuthTab = "login") => {
        setTab(next);
        setOpen(true);
      },
      hide: () => setOpen(false),
      setTab,
    }),
    [open, tab],
  );

  return (
    <AuthModalContext.Provider value={value}>{children}</AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error("useAuthModal");
  return ctx;
}
