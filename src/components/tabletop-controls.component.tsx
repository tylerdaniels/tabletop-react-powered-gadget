import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Direction, TabletopGrid } from '../services';

import styles from './tabletop-controls.module.scss';

export interface TabletopControlsProperties {
  grid: TabletopGrid;
  keyboardEnabled?: boolean;
  preferArrows?: boolean;
  gamerMode?: boolean;
}

export function TabletopControls({ grid, keyboardEnabled, preferArrows, gamerMode }: TabletopControlsProperties) {
  const { t } = useTranslation();
  useEffect(() => {
    if (!keyboardEnabled) {
      // Don't hook into keyboard if it's not enabled
      return;
    }
    const keyboardListener = (event: KeyboardEvent) => {
      let direction: Direction | undefined = undefined;
      switch (event.key) {
        case 'Up': // Edge (16 and earlier) and Firefox (36 and earlier)
        case 'ArrowUp':
          direction = 'up';
          break;
        case 'Down': // Edge (16 and earlier) and Firefox (36 and earlier)
        case 'ArrowDown':
          direction = 'down';
          break;
        case 'Left': // Edge (16 and earlier) and Firefox (36 and earlier)
        case 'ArrowLeft':
          direction = 'left';
          break;
        case 'Right': // Edge (16 and earlier) and Firefox (36 and earlier)
        case 'ArrowRight':
          direction = 'right';
          break;
      }
      if (direction) {
        grid.move(direction);
        event.stopPropagation(); // Don't scroll the screen
      }
    };
    window.addEventListener('keydown', keyboardListener);
    return () => {
      window.removeEventListener('keydown', keyboardListener);
    };
  }, [grid, keyboardEnabled]);
  const [xPos, setXPos] = useState(0);
  const [yPos, setYPos] = useState(0);
  return (
    <>
      <div className={styles.directionBtns + (gamerMode ? ' ' + styles.gamerMode : '')}>
        <button className={styles.dirUp} onClick={() => grid.move('up')}>
          {preferArrows ? <i className="fa-solid fa-arrow-up" aria-label={t('dir-up')}></i> : t('dir-up')}
        </button>
        <button className={styles.dirLeft} onClick={() => grid.move('left')}>
          {preferArrows ? <i className="fa-solid fa-arrow-left" aria-label={t('dir-left')}></i> : t('dir-left')}
        </button>
        <button className={styles.dirRight} onClick={() => grid.move('right')}>
          {preferArrows ? <i className="fa-solid fa-arrow-right" aria-label={t('dir-right')}></i> : t('dir-right')}
        </button>
        <button className={styles.dirDown} onClick={() => grid.move('down')}>
          {preferArrows ? <i className="fa-solid fa-arrow-down" aria-label={t('dir-down')}></i> : t('dir-down')}
        </button>
      </div>
      <div className={styles.explicitPos}>
        <label htmlFor="x-pos">{t('coord-x')}</label>
        <input
          id="x-pos"
          name="x-pos"
          type="number"
          value={xPos.toString()}
          pattern="\\d+"
          onChange={(e) => {
            setXPos(Number.parseFloat(e.target.value));
          }} // parseFloat to make fractions invalid
        />
        <label htmlFor="y-pos">{t('coord-y')}</label>
        <input
          id="y-pos"
          name="y-pos"
          type="number"
          value={yPos.toString()}
          pattern="\\d+"
          onChange={(e) => {
            setYPos(Number.parseFloat(e.target.value));
          }} // parseFloat to make fractions invalid
        />
        <button type="submit" onClick={() => grid.setPosition(xPos, yPos)}>
          {t('coord-set')}
        </button>
      </div>
    </>
  );
}
