import { Observable, ReplaySubject } from 'rxjs';
import { BlockingWalls, MovementStrategy } from './movement-strategy';
import { isPositiveInteger, isWithinGrid } from './tabletop.utils';
import type { GridPosition, MoveEvent, StatusEvent } from './tabletop.types';

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

  private readonly moveSubject = new ReplaySubject<MoveEvent>();
  /**
   * Subscribe for movement events, events emitted have already
   * been sanitised by the Movement Strategy and will be the
   * accepted state of the robot's position
   */
  public readonly onMove: Observable<MoveEvent> = this.moveSubject.asObservable();

  private readonly statusSubject = new ReplaySubject<StatusEvent>();
  /**
   * Subscribe for movement events, events emitted are an indication
   * of what is happening internally with the class, this might be
   * a movement update ('position': in text form) or a reaction from the robot itself
   */
  public readonly onStatus: Observable<StatusEvent> = this.statusSubject.asObservable();

  constructor(opts?: Partial<Readonly<TabletopGridOptions>>) {
    const { width, height, initialPosition, movementStrategy } = sanitiseOptions(opts);
    this.width = width;
    this.height = height;
    this._robotPosition = initialPosition;
    this.movementStrategy = movementStrategy;
    // Subscribe to the public listener for simplicity
    this.onMove.subscribe((event) => (this._robotPosition = event.to));
    this.statusSubject.next({
      type: 'info',
      message: 'Robot ready!',
    });
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
      this.statusSubject.next({
        type: 'position',
        message: `Moved to coordinates: (${event.to.x.toString()}, ${event.to.y.toString()}); direction: ${direction}`,
      });
    } else {
      this.statusSubject.next({
        type: 'warn',
        message: 'Movement cancelled',
      });
    }
    return event?.to ?? this.robotPosition;
  }

  setPosition(x: number, y: number): boolean;
  setPosition(newPosition: GridPosition): boolean;
  setPosition(newPositionOrX: GridPosition | number, y?: number): boolean {
    if (typeof newPositionOrX === 'number') {
      if (typeof y === 'undefined') {
        throw new Error('"setPosition" called with only one coordinate, please use X and Y coordinates');
      }
      newPositionOrX = { x: newPositionOrX, y };
    }
    if (!isWithinGrid(newPositionOrX, this.width, this.height)) {
      this.statusSubject.next({
        type: 'error',
        message: 'Invalid coordinates received for position',
      });
      return false;
    }
    const event = this.movementStrategy.move({ to: newPositionOrX, from: newPositionOrX }, this);
    if (event) {
      this.moveSubject.next(event);
      this.statusSubject.next({
        type: 'position',
        message: `Moved to coordinates: (${event.to.x.toString()}, ${event.to.y.toString()})`,
      });
      return true;
    } else {
      this.statusSubject.next({
        type: 'warn',
        message: 'Explicit movement cancelled',
      });
      return false;
    }
  }
}
