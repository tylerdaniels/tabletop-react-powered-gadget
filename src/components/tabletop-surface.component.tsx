import React, { useEffect, useRef, useState } from 'react';
import { GridPosition, TabletopGrid } from '../services';
import { Subscription } from 'rxjs';

function isCurrentPosition(pos: GridPosition, x: number, y: number): boolean {
  return pos.x === x && pos.y === y;
}

export interface TabletopSurfaceProperties {
  grid: TabletopGrid;
}

export function TabletopSurface({ grid }: TabletopSurfaceProperties) {
  const subscription = useRef(Subscription.EMPTY);
  const [position, setPosition] = useState(grid.robotPosition);
  const [rows, setRows] = useState([] as React.JSX.Element[]);
  // Update "position" state object when the robot moves
  useEffect(() => {
    const sub = grid.onMove.subscribe((event) => {
      setPosition(event.to);
    });
    subscription.current = sub;
    return () => {
      sub.unsubscribe();
    };
  }, [grid]);
  // Rerender the rows when the position changes
  useEffect(() => {
    const newRows: React.JSX.Element[] = [];
    for (let y = 0; y < grid.height; y++) {
      const row: React.JSX.Element[] = [];
      for (let x = 0; x < grid.width; x++) {
        if (isCurrentPosition(position, x, y)) {
          row.push(
            <td>
              <strong>X</strong>
            </td>
          );
        } else {
          row.push(<td>-</td>);
        }
      }
      newRows.push(<tr>{...row}</tr>);
    }
    setRows(newRows);
  }, [position, grid.height, grid.width]);

  return (
    <>
      <table>
        <tbody>{...rows}</tbody>
      </table>
    </>
  );
}
