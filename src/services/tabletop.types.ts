/**
 * Simple cartesian grid position with the point of origin
 * being the top-left of the grid.
 */
export interface GridPosition {
  readonly x: number;
  readonly y: number;
}

export interface MoveRequest {
  to: GridPosition;
  from: GridPosition;
  direction?: Direction;
}

/**
 * Status event indicating a change has occurred
 */
export type StatusEvent = LoggingEvent | MoveEvent;

/**
 * Logging event describing what change has occurred
 */
export interface LoggingEvent {
  type: 'info' | 'warn' | 'error';
  message: string;
  translationKey?: string;
}

export type Direction = 'up' | 'down' | 'left' | 'right';

/**
 * Movement event indicating the origin and destination, and possibly the direction
 */
export interface MoveEvent {
  type: 'position';
  to: GridPosition;
  from: GridPosition;
  direction?: Direction;
}
