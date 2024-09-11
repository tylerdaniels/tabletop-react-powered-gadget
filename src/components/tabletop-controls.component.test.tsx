import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TabletopControls } from './tabletop-controls.component';
import { TabletopGrid } from '../services';

const BUTTON_EVENTS: string[][] = [
  ['Up', 'up'],
  ['Down', 'down'],
  ['Left', 'left'],
  ['Right', 'right'],
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
    expect(buttons, 'controls should render 4 buttons').toHaveLength(4);
  });
  BUTTON_EVENTS.forEach((event) => {
    it(`should move "${event[1]}" when "${event[0]}" is clicked`, async () => {
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
      render(<TabletopControls grid={grid as TabletopGrid} />);
      await user.keyboard(event[0]);
      expect(movedDirection, 'no direction was moved').toBeDefined();
      expect(movedDirection, 'movement direction was incorrect').toBe(event[1]);
    });
  });
});
