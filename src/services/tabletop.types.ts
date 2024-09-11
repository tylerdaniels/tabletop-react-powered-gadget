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
