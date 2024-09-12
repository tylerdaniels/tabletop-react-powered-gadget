/**
 * Simple cartesian grid position with the point of origin
 * being the top-left of the grid.
 */
export interface GridPosition {
  readonly x: number;
  readonly y: number;
}

/**
 * Movement event indicating the origin and destination
 */
export interface MoveEvent {
  to: GridPosition;
  from: GridPosition;
}

/**
 * Status event indicating a change has occurred
 */
export interface StatusEvent {
  type: 'position' | 'info' | 'warn' | 'error';
  message: string;
}
