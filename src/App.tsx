import { Suspense, useEffect, useRef, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import { loadInternationalisation } from './services';
import { Theme, ThemeContext } from './contexts/theme';
import { Tabletop } from './components/tabletop.component';
import { Header } from './components/header.component';

import './App.scss';
import styles from './App.module.scss';
import robotLogo from './assets/robot.png';

function App() {
  const [theme, setTheme] = useState<Theme>('light');
  useEffect(() => {
    const currentTheme = theme;
    document.body.classList.add(currentTheme);
    return () => {
      document.body.classList.remove(currentTheme);
    };
  }, [theme]);
  const i18nRef = useRef(loadInternationalisation());
  return (
    <>
      <Suspense key={'i18n-load'} fallback={<h1>Loading</h1>}>
        <I18nextProvider i18n={i18nRef.current} defaultNS={'ttrpg'}>
          <ThemeContext.Provider value={theme}>
            <Header onThemeUpdate={setTheme} />
            <div className={styles.app + ' ' + styles[theme]}>
              <img className={styles.logo} src={robotLogo} alt="Robot" />
              <Tabletop />
            </div>
          </ThemeContext.Provider>
        </I18nextProvider>
      </Suspense>
    </>
  );
}

export default App;
