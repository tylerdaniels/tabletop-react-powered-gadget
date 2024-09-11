import { Observable, Subject } from 'rxjs';

/**
 * Simple cartesian grid position with the point of origin
 * being the top-left of the grid.
 */
export interface GridPosition {
  readonly x: number;
  readonly y: number;
}

export interface WallBehaviour {
  move(event: MoveEvent): MoveEvent | undefined;
}

/**
 * Wall Bahviour which behaves like Pacman, walls wrap around
 * creating a toroidal world space.
 */
export class PacmanWalls implements WallBehaviour {
  move(event: MoveEvent): MoveEvent {
    return event;
  }
}

/**
 * Blocking walls behaves like an actual table not allowing
 * the robot to leave the valid dimensions of the grid.
 */
export class BlockingWalls implements WallBehaviour {
  move(event: MoveEvent): MoveEvent {
    return event;
  }
}

export interface MoveEvent {
  to: GridPosition;
  from: GridPosition;
}

export interface TabletopGridOptions {
  width: number;
  height: number;
  initialPosition: GridPosition;
  wallBehaviour: WallBehaviour;
}

export type Direction = 'up' | 'down' | 'left' | 'right';

function isPositiveInteger(n: number): boolean {
  return n >= 0 && Number.isInteger(n);
}

function isWithinGrid(position: GridPosition, width: number, height: number): boolean {
  // Is position positive integers?
  if (!isPositiveInteger(position.x) || !isPositiveInteger(position.y)) {
    return false;
  }
  // Is position within the grid dimensions?
  if (position.x >= width || position.y >= height) {
    return false;
  }
  return true;
}

function sanitiseOptions(opts?: Partial<Readonly<TabletopGridOptions>>): TabletopGridOptions {
  let { width, height, initialPosition, wallBehaviour } = opts ?? {};
  // Sane defaults for demonstration purposes
  width ??= 5;
  height ??= 5;
  initialPosition ??= { x: 0, y: 0 };
  wallBehaviour ??= new BlockingWalls();
  if (!isPositiveInteger(width) || !isPositiveInteger(height)) {
    throw new Error(`Invalid Grid Dimensions (${width.toString()}x${height.toString()}); please use positive integers`);
  }
  if (!isWithinGrid(initialPosition, width, height)) {
    throw new Error(
      `Invalid Initial Position (X: ${initialPosition.x.toString()}, Y: ${initialPosition.y.toString()}) ` +
        `is not within a ${width.toString()}x${height.toString()} grid; please use a valid position`
    );
  }
  return {
    width,
    height,
    initialPosition,
    wallBehaviour,
  };
}

export class TabletopGrid {
  public readonly width: number;
  public readonly height: number;
  private readonly wallBehaviour: WallBehaviour;

  private _robotPosition: GridPosition;
  public get robotPosition(): GridPosition {
    return this._robotPosition;
  }

  private readonly moveSubject = new Subject<MoveEvent>();
  public readonly onMove: Observable<MoveEvent> = this.moveSubject.asObservable();

  constructor(opts?: Partial<Readonly<TabletopGridOptions>>) {
    const { width, height, initialPosition, wallBehaviour } = sanitiseOptions(opts);
    this.width = width;
    this.height = height;
    this._robotPosition = initialPosition;
    this.wallBehaviour = wallBehaviour;
    // Subscribe to the public listener for simplicity
    this.onMove.subscribe((event) => (this._robotPosition = event.to));
  }

  move(direction: Direction): GridPosition {
    let { x, y } = this.robotPosition;
    switch (direction) {
      case 'up':
        y--;
        break;
      case 'down':
        y++;
        break;
      case 'left':
        x--;
        break;
      case 'right':
        x++;
        break;
    }
    const newPosition = { x, y };
    const event = this.wallBehaviour.move({ to: newPosition, from: this.robotPosition });
    if (event) {
      this.moveSubject.next(event);
    }
    return event?.to ?? this.robotPosition;
  }
}
