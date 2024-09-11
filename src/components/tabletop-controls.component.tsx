import { TabletopGrid } from '../services';

export interface TabletopControlsProperties {
  grid: TabletopGrid;
}

export function TabletopControls({ grid }: TabletopControlsProperties) {
  return (
    <>
      <button onClick={() => grid.move('up')}>Up</button>
      <button onClick={() => grid.move('down')}>Down</button>
      <button onClick={() => grid.move('left')}>Left</button>
      <button onClick={() => grid.move('right')}>Right</button>
    </>
  );
}
