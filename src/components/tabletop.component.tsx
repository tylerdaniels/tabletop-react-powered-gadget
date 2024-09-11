import { useRef } from 'react';
import { TabletopGrid } from '../services';
import { TabletopSurface } from './tabletop-surface.component';
import { TabletopControls } from './tabletop-controls.component';

export function Tabletop() {
  const grid = useRef(new TabletopGrid());
  return (
    <>
      <TabletopSurface grid={grid.current} />
      <TabletopControls grid={grid.current} />
    </>
  );
}
