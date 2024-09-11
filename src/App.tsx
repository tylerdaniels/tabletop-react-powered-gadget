import { Suspense, useRef, useState } from 'react';
import { I18nextProvider, Translation } from 'react-i18next';
import { loadInternationalisation } from './services';
import { Tabletop } from './components/tabletop.component';

import './App.css';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';

function App() {
  const i18nRef = useRef(loadInternationalisation());
  const [count, setCount] = useState(0);
  const onClick = () => {
    setCount((count) => count + 1);
  };
  return (
    <>
      <Suspense key={'i18n-load'} fallback={<h1>Loading</h1>}>
        <I18nextProvider i18n={i18nRef.current} defaultNS={'ttrpg'}>
          <div>
            <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
              <img src={viteLogo} className="logo" alt="Vite logo" />
            </a>
            <a href="https://react.dev" target="_blank" rel="noreferrer">
              <img src={reactLogo} className="logo react" alt="React logo" />
            </a>
          </div>
          <h1>
            <Translation>{(t) => t('title')}</Translation>
          </h1>
          <Tabletop />
          <div className="card">
            <button onClick={onClick}>count is {count}</button>
            <p>
              Edit <code>src/App.tsx</code> and save to test HMR
            </p>
          </div>
          <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
        </I18nextProvider>
      </Suspense>
    </>
  );
}

export default App;
