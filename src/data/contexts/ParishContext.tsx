'use client';

import { createContext, useContext, ReactNode } from 'react';

export interface ParishWhitelabel {
  id: string;
  name: string;
  slug: string;
  phone: string;
  priest: string | null;
  themePrimaryColor: string | null;
  themeSecondaryColor: string | null;
  logoUrl: string | null;
}

const ParishContext = createContext<ParishWhitelabel | null>(null);

export function ParishProvider({
  parish,
  children,
}: {
  parish: ParishWhitelabel | null;
  children: ReactNode;
}) {
  return (
    <ParishContext.Provider value={parish}>{children}</ParishContext.Provider>
  );
}

export function useParish() {
  return useContext(ParishContext);
}