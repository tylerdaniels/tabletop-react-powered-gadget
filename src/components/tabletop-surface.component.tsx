import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import { Direction, GridPosition, TabletopGrid } from '../services';
import { filter, Subscription } from 'rxjs';

import styles from './tabletop-surface.module.scss';

function isCurrentPosition(pos: GridPosition, x: number, y: number): boolean {
  return pos.x === x && pos.y === y;
}

export interface TabletopSurfaceProperties {
  grid: TabletopGrid;
}

export function TabletopSurface({ grid }: TabletopSurfaceProperties) {
  const subscription = useRef(Subscription.EMPTY);
  const [direction, setDirection] = useState<Direction>('up');
  const [position, setPosition] = useState(grid.robotPosition);
  const [gridStyles, setGridStyles] = useState({} as CSSProperties);
  const [rows, setRows] = useState([] as React.JSX.Element[]);
  // Update "position" and "styles" state objects when the grid changes
  useEffect(() => {
    const sub = grid.onStatus.pipe(filter((e) => e.type === 'position')).subscribe((event) => {
      setPosition(event.to);
      if (event.direction) {
        setDirection(event.direction);
      }
    });
    subscription.current = sub;
    const styles = {} as CSSProperties;
    styles.gridTemplateColumns = `repeat(${grid.width.toString()}, 1fr)`;
    styles.gridTemplateRows = `repeat(${grid.height.toString()}, 1fr)`;
    setGridStyles(styles);
    return () => {
      sub.unsubscribe();
    };
  }, [grid]);
  // Rerender the rows when the position changes
  useEffect(() => {
    function calculateStyles(isCurrent: boolean) {
      if (!isCurrent) {
        return styles.gridItem;
      }
      return [styles.gridItem, styles.current, styles['dir-' + direction]].join(' ');
    }
    const newRows: React.JSX.Element[] = [];
    for (let y = 0; y < grid.height; y++) {
      for (let x = 0; x < grid.width; x++) {
        const key = x.toString() + ',' + y.toString();
        const gridStyles = calculateStyles(isCurrentPosition(position, x, y));
        newRows.push(
          <div key={key} className={gridStyles}>
            &nbsp;
          </div>
        );
      }
    }
    setRows(newRows);
  }, [position, grid.height, grid.width]);

  return (
    <>
      <div className={styles.surface}>
        <div className={styles.grid} style={gridStyles}>
          {...rows}
        </div>
      </div>
    </>
  );
}
