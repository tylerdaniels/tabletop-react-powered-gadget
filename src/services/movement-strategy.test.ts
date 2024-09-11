import { BlockingWalls, PacmanWalls } from './movement-strategy';
import { TabletopGrid } from './tabletop-grid';
import { MoveEvent } from './tabletop.types';

interface DisallowedMovements {
  description: string;
  event: MoveEvent;
}

// All on a 5x5 grid
const DISALLOWED_MOVEMENTS: DisallowedMovements[] = [
  {
    description: 'Move up through the top of the grid',
    event: { from: { x: 0, y: 0 }, to: { x: 0, y: -1 } },
  },
  {
    description: 'Move left through the side of the grid',
    event: { from: { x: 0, y: 3 }, to: { x: -1, y: 3 } },
  },
  {
    description: 'Move down through the bottom of the grid',
    event: { from: { x: 1, y: 4 }, to: { x: 1, y: 5 } },
  },
  {
    description: 'Move right through the far side of the grid',
    event: { from: { x: 4, y: 4 }, to: { x: 5, y: 4 } },
  },
];

describe('BlockingWalls', () => {
  it('should pass through an event not next to the walls', () => {
    const grid = new TabletopGrid({ width: 5, height: 5 });
    const event: MoveEvent = {
      from: { x: 2, y: 2 },
      to: { x: 2, y: 3 },
    };
    const updatedEvent = new BlockingWalls().move(event, grid);
    expect(updatedEvent, 'movement was modified unexpectedly').toBe(event);
  });
  DISALLOWED_MOVEMENTS.forEach((test) => {
    it('should block disallowed movement: ' + test.description, () => {
      const grid = new TabletopGrid({ width: 5, height: 5 });
      const strategy = new BlockingWalls();
      const updatedEvent = strategy.move(test.event, grid);
      expect(updatedEvent, 'movement was not cancelled').toBeUndefined();
    });
  });
});

interface ModifiedMovements {
  description: string;
  event: MoveEvent;
  expectedEvent: MoveEvent;
}

// All on a 5x5 grid
const MODIFIED_MOVEMENTS: ModifiedMovements[] = [
  {
    description: 'Move up through the top of the grid',
    event: { from: { x: 0, y: 0 }, to: { x: 0, y: -1 } },
    expectedEvent: { from: { x: 0, y: 0 }, to: { x: 0, y: 4 } },
  },
  {
    description: 'Move left through the side of the grid',
    event: { from: { x: 0, y: 3 }, to: { x: -1, y: 3 } },
    expectedEvent: { from: { x: 0, y: 3 }, to: { x: 4, y: 3 } },
  },
  {
    description: 'Move down through the bottom of the grid',
    event: { from: { x: 1, y: 4 }, to: { x: 1, y: 5 } },
    expectedEvent: { from: { x: 1, y: 4 }, to: { x: 1, y: 0 } },
  },
  {
    description: 'Move right through the far side of the grid',
    event: { from: { x: 4, y: 4 }, to: { x: 5, y: 4 } },
    expectedEvent: { from: { x: 4, y: 4 }, to: { x: 0, y: 4 } },
  },
];

describe('PacmanWalls', () => {
  it('should pass through an event not next to the walls', () => {
    const grid = new TabletopGrid({ width: 5, height: 5 });
    const event: MoveEvent = {
      from: { x: 2, y: 2 },
      to: { x: 2, y: 3 },
    };
    const updatedEvent = new PacmanWalls().move(event, grid);
    expect(updatedEvent, 'movement was modified unexpectedly').toBe(event);
  });
  MODIFIED_MOVEMENTS.forEach((test) => {
    it('should modify movement: ' + test.description, () => {
      const grid = new TabletopGrid({ width: 5, height: 5 });
      const strategy = new PacmanWalls();
      const updatedEvent = strategy.move(test.event, grid);
      expect(updatedEvent, 'movement was unexpectedly cancelled').toBeDefined();
      expect(updatedEvent, 'movement was modified incorrectly').toEqual(test.expectedEvent);
    });
  });
});
