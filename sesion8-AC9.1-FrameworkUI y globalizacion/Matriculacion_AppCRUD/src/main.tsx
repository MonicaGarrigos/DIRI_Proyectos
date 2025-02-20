import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { IntlProvider } from 'react-intl';
import React from 'react';
import { LanguageContext, LanguageProvider } from './context/LanguageContext.tsx';

const Root = () => {
  const { locale, messages } =
    React.useContext(LanguageContext);
  return (
    <IntlProvider locale={locale} messages={messages}>
      <App />
    </IntlProvider>
  );
};
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LanguageProvider>
      <Root />
    </LanguageProvider>
  </StrictMode>
);