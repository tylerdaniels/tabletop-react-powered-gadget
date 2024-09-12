import { Translation, useTranslation } from 'react-i18next';
import styles from './header.module.scss';
import { useContext } from 'react';
import { Theme, ThemeContext } from '../contexts/theme';

import cnFlag from '../assets/flag-cn.png';
import usFlag from '../assets/flag-us.png';

export type HeaderProps = {
  onThemeUpdate: (newTheme: Theme) => unknown;
};

export function Header({ onThemeUpdate }: HeaderProps) {
  const theme = useContext(ThemeContext);
  const otherTheme: Theme = theme === 'light' ? 'dark' : 'light';
  const { t, i18n } = useTranslation();
  const otherLang: string = i18n.language === 'en' ? 'zh' : 'en';
  return (
    <div className={styles.header}>
      <button className={styles['lang-selector']} onClick={() => i18n.changeLanguage(otherLang)}>
        <img src={i18n.language === 'en' ? cnFlag : usFlag} alt={t('lang-select-' + otherLang)} />
      </button>
      <button className={styles['theme-selector']} onClick={() => onThemeUpdate(otherTheme)}>
        <i className="fa-solid fa-lightbulb" aria-label={t('theme-select-' + otherTheme)}></i>
      </button>
      <h1 className={styles.title}>
        <Translation>{(t) => t('title')}</Translation>
      </h1>
    </div>
  );
}
