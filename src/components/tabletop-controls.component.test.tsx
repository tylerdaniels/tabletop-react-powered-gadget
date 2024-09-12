import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import sinon from 'sinon';
import { TabletopControls } from './tabletop-controls.component';
import { Direction, GridPosition, TabletopGrid } from '../services';

const BUTTON_EVENTS: [RegExp, string][] = [
  [/up/i, 'up'],
  [/down/i, 'down'],
  [/left/i, 'left'],
  [/right/i, 'right'],
];

const KEYBOARD_EVENTS: string[][] = [
  ['{ArrowUp}', 'up'],
  ['{ArrowDown}', 'down'],
  ['{ArrowLeft}', 'left'],
  ['{ArrowRight}', 'right'],
  // Edge (16 and earlier) and Firefox (36 and earlier)
  // use the non-standard key names below
  ['{Up}', 'up'],
  ['{Down}', 'down'],
  ['{Left}', 'left'],
  ['{Right}', 'right'],
];

const sandbox = sinon.createSandbox();

function newTabletopMockMove(): [TabletopGrid, () => Direction | undefined] {
  const grid = new TabletopGrid({ initialPosition: { x: 2, y: 2 } });
  const spyMove = sandbox.spy(grid, 'move');
  return [grid, () => (spyMove.called ? spyMove.lastCall.args[0] : undefined)];
}

function newTabletopMockSetPosition(): [TabletopGrid, () => GridPosition | undefined] {
  const grid = new TabletopGrid({ initialPosition: { x: 2, y: 2 } });
  const spySetPosition = sandbox.spy(grid, 'setPosition');
  function extractPosition(newPositionOrX: GridPosition | number, y?: number) {
    if (typeof newPositionOrX === 'number') {
      if (typeof y === 'undefined') {
        throw new Error('"setPosition" called with only one coordinate, please use X and Y coordinates');
      }
      return { x: newPositionOrX, y };
    }
    return newPositionOrX;
  }
  return [grid, () => (spySetPosition.called ? extractPosition(...spySetPosition.lastCall.args) : undefined)];
}

describe('Tabletop Controls', () => {
  afterEach(() => {
    // Restore mocks after each test
    sandbox.restore();
  });
  it('should render the controls', () => {
    render(<TabletopControls grid={new TabletopGrid()} />);
    const buttons = screen.getAllByRole('button');
    // Explicit button checks are done in the other tests, no need to be fine-grained here
    expect(buttons.length, 'controls should render some buttons').toBeGreaterThan(0);
  });
  BUTTON_EVENTS.forEach((event) => {
    it(`should move "${event[1]}" when "${event[1]}" button is clicked`, async () => {
      const user = userEvent.setup();
      const [grid, lastDir] = newTabletopMockMove();
      render(<TabletopControls grid={grid} />);
      await user.click(screen.getByText(event[0]));
      expect(lastDir()).toBe(event[1]);
    });
  });
  KEYBOARD_EVENTS.forEach((event) => {
    it(`should move "${event[1]}" when "${event[0]}" is typed`, async () => {
      const user = userEvent.setup();
      const [grid, lastDir] = newTabletopMockMove();
      render(<TabletopControls grid={grid} keyboardEnabled />);
      await user.keyboard(event[0]);
      expect(lastDir()).toBe(event[1]);
    });
    it(`should not move "${event[1]}" when "${event[0]}" is typed without keyboard enabled`, async () => {
      const user = userEvent.setup();
      const [grid, lastDir] = newTabletopMockMove();
      render(<TabletopControls grid={grid} />);
      await user.keyboard(event[0]);
      expect(lastDir()).toBeUndefined();
    });
  });
  it(`should set robot position on explicit update`, async () => {
    const user = userEvent.setup();
    const [grid, lastPosition] = newTabletopMockSetPosition();
    render(<TabletopControls grid={grid} />);
    await user.click(screen.getByLabelText('coord-x'));
    await user.keyboard('2');
    await user.click(screen.getByLabelText('coord-y'));
    await user.keyboard('4');
    await user.click(screen.getByText('coord-set'));
    const pos = lastPosition();
    expect(pos?.x, 'no x coordinate was set').toBe(2);
    expect(pos?.y, 'no y coordinate was set').toBe(4);
  });
});
