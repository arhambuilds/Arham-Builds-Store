import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as staticData from '../data';

interface DataState {
  PRODUCTS: staticData.Product[];
  HERO_DATA: typeof staticData.HERO_DATA;
  FAQ_DATA: typeof staticData.FAQ_DATA;
  NAV_LINKS: typeof staticData.NAV_LINKS;
  TESTIMONIALS: typeof staticData.TESTIMONIALS;
  PRIVACY_POLICY: typeof staticData.PRIVACY_POLICY;
  TERMS_CONDITIONS: typeof staticData.TERMS_CONDITIONS;
  CONTACT_INFO: typeof staticData.CONTACT_INFO;
  isLoading: boolean;
}

const DataContext = createContext<DataState | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DataState>({
    PRODUCTS: staticData.PRODUCTS,
    HERO_DATA: staticData.HERO_DATA,
    FAQ_DATA: staticData.FAQ_DATA,
    NAV_LINKS: staticData.NAV_LINKS,
    TESTIMONIALS: staticData.TESTIMONIALS,
    PRIVACY_POLICY: staticData.PRIVACY_POLICY,
    TERMS_CONDITIONS: staticData.TERMS_CONDITIONS,
    CONTACT_INFO: staticData.CONTACT_INFO,
    isLoading: true
  });

  useEffect(() => {
    const fetchDynamicData = async () => {
      try {
        // Try fetching the dynamic snapshot first
        const response = await fetch('/data.json?v=' + Date.now());
        if (response.ok) {
          const dynamicData = await response.json();
          setData(prev => ({
            ...prev,
            ...dynamicData,
            isLoading: false
          }));
          console.log('[DataManager] Successfully loaded dynamic data');
        } else {
          setData(prev => ({ ...prev, isLoading: false }));
        }
      } catch (err) {
        console.error('[DataManager] Failed to load dynamic data, using static fallback');
        setData(prev => ({ ...prev, isLoading: false }));
      }
    };

    fetchDynamicData();
  }, []);

  return (
    <DataContext.Provider value={data}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    // Return static data if somehow outside provider or during weird hydration
    return {
      PRODUCTS: staticData.PRODUCTS,
      HERO_DATA: staticData.HERO_DATA,
      FAQ_DATA: staticData.FAQ_DATA,
      NAV_LINKS: staticData.NAV_LINKS,
      TESTIMONIALS: staticData.TESTIMONIALS,
      PRIVACY_POLICY: staticData.PRIVACY_POLICY,
      TERMS_CONDITIONS: staticData.TERMS_CONDITIONS,
      CONTACT_INFO: staticData.CONTACT_INFO,
      isLoading: false
    };
  }
  return context;
}
