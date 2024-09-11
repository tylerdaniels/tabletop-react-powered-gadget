import { useEffect } from 'react';
import { TabletopGrid } from '../services';

export interface TabletopControlsProperties {
  grid: TabletopGrid;
}

export function TabletopControls({ grid }: TabletopControlsProperties) {
  useEffect(() => {
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
  }, [grid]);
  return (
    <>
      <button onClick={() => grid.move('up')}>Up</button>
      <button onClick={() => grid.move('down')}>Down</button>
      <button onClick={() => grid.move('left')}>Left</button>
      <button onClick={() => grid.move('right')}>Right</button>
    </>
  );
}
