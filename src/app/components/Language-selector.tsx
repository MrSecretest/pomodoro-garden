import React, { useState } from 'react';
import Flag from 'react-world-flags'; // Assuming you're using the react-world-flags package
import { useTranslations } from 'next-intl'; // Assuming you're using Next.js with next-intl

const languages = [
  { code: 'en', name: 'English', flag: 'US' },
  { code: 'es', name: 'Spanish', flag: 'ES' },
  { code: 'fr', name: 'French', flag: 'FR' },
  { code: 'de', name: 'German', flag: 'DE' },
  { code: 'it', name: 'Italian', flag: 'IT' },
  { code: 'pl', name: 'Polish', flag: 'PL' },
  { code: 'zh', name: 'Chinese', flag: 'CN' },
];

export default function LanguageSelector() {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const t = useTranslations(''); // Assuming `next-intl` for translations

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLocale = e.target.value;
    setSelectedLanguage(selectedLocale);
    // Handle your language change logic, e.g., using a context or Next.js routing
  };

  return (
    <div className="language-selector">
      <select 
        value={selectedLanguage} 
        onChange={handleLanguageChange}
        style={{

          zIndex: 10, // Ensure it is above other content
          position: 'relative', // Ensure it's not hidden by other elements
        }}
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code} style={{ display: 'flex', alignItems: 'center' }}>

            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}
