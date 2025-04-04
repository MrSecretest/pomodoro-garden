import {defineRouting} from 'next-intl/routing';
 
export const routing = defineRouting({
  locales: ['en', 'de', 'uk', 'pl', 'cz', 'it', 'fr', 'es', 'tr', 'zh-CN'],
 
  defaultLocale: 'en'
});