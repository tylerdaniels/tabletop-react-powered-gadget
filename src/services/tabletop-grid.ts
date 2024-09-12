import { filter, Observable, ReplaySubject } from 'rxjs';
import { BlockingWalls, MovementStrategy } from './movement-strategy';
import { isPositiveInteger, isWithinGrid } from './tabletop.utils';
import type { Direction, GridPosition, MoveEvent, StatusEvent } from './tabletop.types';

export interface TabletopGridOptions {
  width: number;
  height: number;
  initialPosition?: GridPosition;
  movementStrategy: MovementStrategy;
}

function sanitiseOptions(opts?: Partial<Readonly<TabletopGridOptions>>): TabletopGridOptions {
  const { initialPosition } = opts ?? {};
  let { width, height, movementStrategy } = opts ?? {};
  // Sane defaults for demonstration purposes
  width ??= 5;
  height ??= 5;
  movementStrategy ??= new BlockingWalls();
  if (!isPositiveInteger(width) || !isPositiveInteger(height)) {
    throw new Error(`Invalid Grid Dimensions (${width.toString()}x${height.toString()}); please use positive integers`);
  }
  if (initialPosition && !isWithinGrid(initialPosition, width, height)) {
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

  private _robotPosition: GridPosition | undefined;
  public get robotPosition(): GridPosition | undefined {
    return this._robotPosition;
  }

  private readonly statusSubject = new ReplaySubject<StatusEvent>();
  /**
   * Subscribe for position events or logging events; those emitted are an indication
   * of what is happening internally with the class, this might be
   * a movement update ('position') or a reaction from the robot itself
   */
  public readonly onStatus: Observable<StatusEvent> = this.statusSubject.asObservable();

  constructor(opts?: Partial<Readonly<TabletopGridOptions>>) {
    const { width, height, initialPosition, movementStrategy } = sanitiseOptions(opts);
    this.width = width;
    this.height = height;
    this.movementStrategy = movementStrategy;
    // Subscribe to the public listener for simplicity
    this.onStatus.pipe(filter((e) => e.type === 'position')).subscribe((event) => {
      if (!this.robotPosition) {
        this.statusSubject.next({
          type: 'info',
          message: 'Robot ready!',
          translationKey: 'status-ready',
        });
      }
      this._robotPosition = event.to;
    });
    if (initialPosition) {
      this.setPosition(initialPosition);
    }
  }

  move(direction: Direction): GridPosition | undefined {
    if (!this.robotPosition) {
      this.statusSubject.next({
        type: 'error',
        message: 'No Robot!',
        translationKey: 'status-not-ready',
      });
      return;
    }
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
    const moveRequest = this.movementStrategy.move({ to: newPosition, from: this.robotPosition }, this);
    if (moveRequest) {
      const event: MoveEvent = {
        type: 'position',
        from: moveRequest.from,
        to: moveRequest.to,
        direction,
      };
      this.statusSubject.next(event);
    } else {
      this.statusSubject.next({
        type: 'warn',
        message: 'Movement cancelled',
        translationKey: 'status-movement-cancelled',
      });
    }
    return moveRequest?.to ?? this.robotPosition;
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
        translationKey: 'status-movement-invalid',
      });
      return false;
    }
    const moveRequest = this.movementStrategy.move({ to: newPositionOrX, from: newPositionOrX }, this);
    if (moveRequest) {
      const event: MoveEvent = {
        type: 'position',
        from: moveRequest.from,
        to: moveRequest.to,
      };
      this.statusSubject.next(event);
      return true;
    } else {
      this.statusSubject.next({
        type: 'warn',
        message: 'Explicit movement cancelled',
        translationKey: 'status-movement-cancelled',
      });
      return false;
    }
  }
}
