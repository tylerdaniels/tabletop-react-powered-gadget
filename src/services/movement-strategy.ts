import { TabletopGrid } from './tabletop-grid';
import type { MoveEvent } from './tabletop.types';
import { isWithinGrid } from './tabletop.utils';

/**
 * Strategy class which can be switched out to modify the behaviour
 * of walking into walls (or any other movement).
 */
export interface MovementStrategy {
  move(event: MoveEvent, grid: TabletopGrid): MoveEvent | undefined;
}

/**
 * Wall Bahviour which behaves like Pacman, walls wrap around
 * creating a toroidal world space.
 */
export class PacmanWalls implements MovementStrategy {
  move(event: MoveEvent, grid: TabletopGrid): MoveEvent {
    if (isWithinGrid(event.to, grid.width, grid.height)) {
      // Move as normal
      return event;
    }
    let { x, y } = event.to;
    if (x < 0) {
      x = grid.width - 1;
    } else if (x >= grid.width) {
      x = 0;
    }
    if (y < 0) {
      y = grid.height - 1;
    } else if (y >= grid.height) {
      y = 0;
    }
    return {
      from: event.from,
      to: { x, y },
    };
  }
}

/**
 * Blocking walls behaves like an actual table not allowing
 * the robot to leave the valid dimensions of the grid.
 */
export class BlockingWalls implements MovementStrategy {
  move(event: MoveEvent, grid: TabletopGrid): MoveEvent | undefined {
    if (isWithinGrid(event.to, grid.width, grid.height)) {
      return event;
    }
    // Block movement outside of the grid
    return undefined;
  }
}
