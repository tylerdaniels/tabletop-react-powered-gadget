import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TabletopControls } from './tabletop-controls.component';
import { GridPosition, TabletopGrid } from '../services';

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

describe('Tabletop Controls', () => {
  it('should render the controls', () => {
    render(<TabletopControls grid={new TabletopGrid()} />);
    const buttons = screen.getAllByRole('button');
    // Explicit button checks are done in the other tests, no need to be fine-grained here
    expect(buttons.length, 'controls should render some buttons').toBeGreaterThan(0);
  });
  BUTTON_EVENTS.forEach((event) => {
    it(`should move "${event[1]}" when "${event[1]}" button is clicked`, async () => {
      const user = userEvent.setup();
      let movedDirection: string | undefined = undefined;
      const grid: Pick<TabletopGrid, 'move'> = {
        move: (direction: string) => {
          movedDirection = direction;
          return { x: 0, y: 0 };
        },
      };
      render(<TabletopControls grid={grid as TabletopGrid} />);
      await user.click(screen.getByText(event[0]));
      expect(movedDirection, 'no direction was moved').toBeDefined();
      expect(movedDirection, 'movement direction was incorrect').toBe(event[1]);
    });
  });
  KEYBOARD_EVENTS.forEach((event) => {
    it(`should move "${event[1]}" when "${event[0]}" is typed`, async () => {
      const user = userEvent.setup();
      let movedDirection: string | undefined = undefined;
      const grid: Pick<TabletopGrid, 'move'> = {
        move: (direction: string) => {
          movedDirection = direction;
          return { x: 0, y: 0 };
        },
      };
      render(<TabletopControls grid={grid as TabletopGrid} keyboardEnabled />);
      await user.keyboard(event[0]);
      expect(movedDirection, 'no direction was moved').toBeDefined();
      expect(movedDirection, 'movement direction was incorrect').toBe(event[1]);
    });
    it(`should not move "${event[1]}" when "${event[0]}" is typed without keyboard enabled`, async () => {
      const user = userEvent.setup();
      let movedDirection: string | undefined = undefined;
      const grid: Pick<TabletopGrid, 'move'> = {
        move: (direction: string) => {
          movedDirection = direction;
          return { x: 0, y: 0 };
        },
      };
      render(<TabletopControls grid={grid as TabletopGrid} />);
      await user.keyboard(event[0]);
      expect(movedDirection, 'move direction was received').toBeUndefined();
    });
  });
  it(`should set robot position on explicit update`, async () => {
    const user = userEvent.setup();
    let movedX: number | undefined = undefined;
    let movedY: number | undefined = undefined;
    const grid: Pick<TabletopGrid, 'setPosition'> = {
      setPosition: (x: number | GridPosition, y?: number) => {
        if (typeof x === 'number') {
          movedX = x;
          movedY = y;
        } else {
          movedX = x.x;
          movedY = x.y;
        }
        return true;
      },
    };
    render(<TabletopControls grid={grid as TabletopGrid} />);
    await user.click(screen.getByLabelText('coord-x'));
    await user.keyboard('2');
    await user.click(screen.getByLabelText('coord-y'));
    await user.keyboard('4');
    await user.click(screen.getByText('coord-set'));
    expect(movedX, 'no x coordinate was set').toBe(2);
    expect(movedY, 'no y coordinate was set').toBe(4);
  });
});
