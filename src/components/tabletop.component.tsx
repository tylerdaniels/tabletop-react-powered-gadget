import { useRef } from 'react';
import { TabletopGrid } from '../services';
import { TabletopSurface } from './tabletop-surface.component';
import { TabletopControls } from './tabletop-controls.component';
import { TabletopStatus } from './tabletop-status.component';

import styles from './tabletop.module.scss';

export function Tabletop() {
  const grid = useRef(new TabletopGrid());
  return (
    <>
      <div className={styles.tabletop}>
        <div className={styles.left}>
          <TabletopSurface grid={grid.current} />
        </div>
        <div className={styles.right}>
          <TabletopStatus grid={grid.current} />
          <TabletopControls grid={grid.current} keyboardEnabled />
        </div>
      </div>
    </>
  );
}
