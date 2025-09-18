import { useState, useEffect } from 'react';

interface CompanySettings {
  companyName: string;
  address: string;
  phone: string;
  email: string;
  logoUrl: string;
}

const STORAGE_KEY = 'company-settings';

export function useCompanySettings() {
  const [companySettings, setCompanySettings] = useState<CompanySettings | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setCompanySettings(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse company settings:', error);
      }
    }
  }, []);

  const updateCompanySettings = (settings: CompanySettings) => {
    setCompanySettings(settings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  };

  return {
    companySettings,
    updateCompanySettings
  };
}