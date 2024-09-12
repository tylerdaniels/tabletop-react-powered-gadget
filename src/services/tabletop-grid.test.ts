import { TabletopGrid } from './tabletop-grid';

describe('TabletopGrid', () => {
  it('should create a grid with default options', () => {
    const grid = new TabletopGrid();
    expect(grid, 'No TabletopGrid created').toBeDefined();
    expect(grid.width, 'grid width undefined').toBeDefined();
    expect(grid.height, 'grid height undefined').toBeDefined();
    expect(grid.robotPosition, 'grid position undefined').toBeDefined();
    expect(grid.robotPosition.x, 'grid position.x undefined').toBeDefined();
    expect(grid.robotPosition.y, 'grid position.y undefined').toBeDefined();
  });
  it('should create a grid with empty options', () => {
    const grid = new TabletopGrid({});
    expect(grid, 'No TabletopGrid created').toBeDefined();
    expect(grid.width, 'grid width undefined').toBeDefined();
    expect(grid.height, 'grid height undefined').toBeDefined();
    expect(grid.robotPosition, 'grid position undefined').toBeDefined();
    expect(grid.robotPosition.x, 'grid position.x undefined').toBeDefined();
    expect(grid.robotPosition.y, 'grid position.y undefined').toBeDefined();
  });
  it('should create a grid with partial options', () => {
    const expectedWidth = 13;
    const expectedHeight = 7;
    const grid = new TabletopGrid({ width: expectedWidth, height: expectedHeight });
    expect(grid, 'No TabletopGrid created').toBeDefined();
    expect(grid.width, 'grid width incorrect').toBe(expectedWidth);
    expect(grid.height, 'grid height incorrect').toBe(expectedHeight);
    expect(grid.robotPosition, 'grid position undefined').toBeDefined();
    expect(grid.robotPosition.x, 'grid position.x undefined').toBeDefined();
    expect(grid.robotPosition.y, 'grid position.y undefined').toBeDefined();
  });
  it('should throw with invalid width', () => {
    expect(() => new TabletopGrid({ width: -1 })).toThrowError();
  });
  it('should throw with invalid height', () => {
    expect(() => new TabletopGrid({ height: 2.5 })).toThrowError();
  });
  it('should throw with invalid position', () => {
    expect(() => new TabletopGrid({ height: 5, initialPosition: { x: 0, y: 25 } })).toThrowError();
  });
  it('should move robot "up"', () => {
    const width = 5;
    const height = 5;
    const initialPosition = { x: 2, y: 2 };
    const grid = new TabletopGrid({ width, height, initialPosition });
    expect(grid.robotPosition, 'Incorrect initial position').toEqual(initialPosition);
    grid.move('up');
    const expectedPosition = { x: 2, y: 1 };
    expect(grid.robotPosition, 'updated position incorrect').toEqual(expectedPosition);
  });
  it('should move robot "down"', () => {
    const width = 5;
    const height = 5;
    const initialPosition = { x: 2, y: 2 };
    const grid = new TabletopGrid({ width, height, initialPosition });
    expect(grid.robotPosition, 'Incorrect initial position').toEqual(initialPosition);
    grid.move('down');
    const expectedPosition = { x: 2, y: 3 };
    expect(grid.robotPosition, 'updated position incorrect').toEqual(expectedPosition);
  });
  it('should move robot "left"', () => {
    const width = 5;
    const height = 5;
    const initialPosition = { x: 2, y: 2 };
    const grid = new TabletopGrid({ width, height, initialPosition });
    expect(grid.robotPosition, 'Incorrect initial position').toEqual(initialPosition);
    grid.move('left');
    const expectedPosition = { x: 1, y: 2 };
    expect(grid.robotPosition, 'updated position incorrect').toEqual(expectedPosition);
  });
  it('should move robot "right"', () => {
    const width = 5;
    const height = 5;
    const initialPosition = { x: 2, y: 2 };
    const grid = new TabletopGrid({ width, height, initialPosition });
    expect(grid.robotPosition, 'Incorrect initial position').toEqual(initialPosition);
    grid.move('right');
    const expectedPosition = { x: 3, y: 2 };
    expect(grid.robotPosition, 'updated position incorrect').toEqual(expectedPosition);
  });
  it('should not set robot position outside grid', () => {
    const width = 5;
    const height = 5;
    const initialPosition = { x: 2, y: 2 };
    const grid = new TabletopGrid({ width, height, initialPosition });
    expect(grid.robotPosition, 'Incorrect initial position').toEqual(initialPosition);
    const newPosition = { x: 10, y: 10 };
    const updated = grid.setPosition(newPosition);
    expect(updated, 'position should not have been upgraderd').toBeFalsy();
    expect(grid.robotPosition, 'robot was moved').toEqual(initialPosition);
  });
  it('should set robot position inside grid', () => {
    const width = 5;
    const height = 5;
    const initialPosition = { x: 2, y: 2 };
    const grid = new TabletopGrid({ width, height, initialPosition });
    expect(grid.robotPosition, 'Incorrect initial position').toEqual(initialPosition);
    const newPosition = { x: 4, y: 4 };
    const updated = grid.setPosition(newPosition);
    expect(updated, 'position should have been upgraderd').toBeTruthy();
    expect(grid.robotPosition, 'robot was not moved').toEqual(newPosition);
  });
});
