import { Observable, Subject } from 'rxjs';
import { BlockingWalls, MovementStrategy } from './movement-strategy';
import { isPositiveInteger, isWithinGrid } from './tabletop.utils';
import type { GridPosition, MoveEvent } from './tabletop.types';

export interface TabletopGridOptions {
  width: number;
  height: number;
  initialPosition: GridPosition;
  movementStrategy: MovementStrategy;
}

export type Direction = 'up' | 'down' | 'left' | 'right';

function sanitiseOptions(opts?: Partial<Readonly<TabletopGridOptions>>): TabletopGridOptions {
  let { width, height, initialPosition, movementStrategy } = opts ?? {};
  // Sane defaults for demonstration purposes
  width ??= 5;
  height ??= 5;
  initialPosition ??= { x: 0, y: 0 };
  movementStrategy ??= new BlockingWalls();
  if (!isPositiveInteger(width) || !isPositiveInteger(height)) {
    throw new Error(`Invalid Grid Dimensions (${width.toString()}x${height.toString()}); please use positive integers`);
  }
  if (!isWithinGrid(initialPosition, width, height)) {
    throw new Error(
      `Invalid Initial Position: (X: ${initialPosition.x.toString()}, Y: ${initialPosition.y.toString()}) ` +
        `is not within a ${width.toString()}x${height.toString()} grid; please use a valid position`
    );
  }
  return {
    width,
    height,
    initialPosition,
    movementStrategy: movementStrategy,
  };
}

export class TabletopGrid {
  public readonly width: number;
  public readonly height: number;
  private readonly movementStrategy: MovementStrategy;

  private _robotPosition: GridPosition;
  public get robotPosition(): GridPosition {
    return this._robotPosition;
  }

  private readonly moveSubject = new Subject<MoveEvent>();
  /**
   * Subscribe for movement events, events emitted have already
   * been sanitised by the Movement Strategy and will be the
   * accepted state of the robot's position
   */
  public readonly onMove: Observable<MoveEvent> = this.moveSubject.asObservable();

  constructor(opts?: Partial<Readonly<TabletopGridOptions>>) {
    const { width, height, initialPosition, movementStrategy } = sanitiseOptions(opts);
    this.width = width;
    this.height = height;
    this._robotPosition = initialPosition;
    this.movementStrategy = movementStrategy;
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
    const event = this.movementStrategy.move({ to: newPosition, from: this.robotPosition }, this);
    if (event) {
      this.moveSubject.next(event);
    }
    return event?.to ?? this.robotPosition;
  }
}
