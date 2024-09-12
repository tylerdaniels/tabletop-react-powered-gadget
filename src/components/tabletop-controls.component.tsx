import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TabletopGrid } from '../services';

export interface TabletopControlsProperties {
  grid: TabletopGrid;
  keyboardEnabled?: boolean;
}

export function TabletopControls({ grid, keyboardEnabled }: TabletopControlsProperties) {
  const { t } = useTranslation();
  useEffect(() => {
    if (!keyboardEnabled) {
      // Don't hook into keyboard if it's not enabled
      return;
    }
    const keyboardListener = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Up': // Edge (16 and earlier) and Firefox (36 and earlier)
        case 'ArrowUp':
          grid.move('up');
          break;
        case 'Down': // Edge (16 and earlier) and Firefox (36 and earlier)
        case 'ArrowDown':
          grid.move('down');
          break;
        case 'Left': // Edge (16 and earlier) and Firefox (36 and earlier)
        case 'ArrowLeft':
          grid.move('left');
          break;
        case 'Right': // Edge (16 and earlier) and Firefox (36 and earlier)
        case 'ArrowRight':
          grid.move('right');
          break;
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
      <div>
        <button onClick={() => grid.move('up')}>{t('dir-up')}</button>
        <button onClick={() => grid.move('down')}>{t('dir-down')}</button>
        <button onClick={() => grid.move('left')}>{t('dir-left')}</button>
        <button onClick={() => grid.move('right')}>{t('dir-right')}</button>
      </div>
      <div>
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
