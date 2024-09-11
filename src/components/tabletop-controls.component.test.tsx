import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TabletopControls } from './tabletop-controls.component';
import { TabletopGrid } from '../services';

describe('Tabletop Controls', () => {
  it('should render the controls', () => {
    render(<TabletopControls grid={new TabletopGrid()} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons, 'controls should render 4 buttons').toHaveLength(4);
  });
  it('should move "up" when "Up" is clicked', async () => {
    const user = userEvent.setup();
    let movedDirection: string | undefined = undefined;
    const grid: Pick<TabletopGrid, 'move'> = {
      move: (direction: string) => {
        movedDirection = direction;
        return { x: 0, y: 0 };
      },
    };
    render(<TabletopControls grid={grid as TabletopGrid} />);
    await user.click(screen.getByText('Up'));
    expect(movedDirection, 'no direction was moved').toBeDefined();
    expect(movedDirection, 'movement direction was incorrect').toBe('up');
  });
  it('should move "down" when "Down" is clicked', async () => {
    const user = userEvent.setup();
    let movedDirection: string | undefined = undefined;
    const grid: Pick<TabletopGrid, 'move'> = {
      move: (direction: string) => {
        movedDirection = direction;
        return { x: 0, y: 0 };
      },
    };
    render(<TabletopControls grid={grid as TabletopGrid} />);
    await user.click(screen.getByText('Down'));
    expect(movedDirection, 'no direction was moved').toBeDefined();
    expect(movedDirection, 'movement direction was incorrect').toBe('down');
  });
  it('should move "left" when "Left" is clicked', async () => {
    const user = userEvent.setup();
    let movedDirection: string | undefined = undefined;
    const grid: Pick<TabletopGrid, 'move'> = {
      move: (direction: string) => {
        movedDirection = direction;
        return { x: 0, y: 0 };
      },
    };
    render(<TabletopControls grid={grid as TabletopGrid} />);
    await user.click(screen.getByText('Left'));
    expect(movedDirection, 'no direction was moved').toBeDefined();
    expect(movedDirection, 'movement direction was incorrect').toBe('left');
  });
  it('should move "right" when "Right" is clicked', async () => {
    const user = userEvent.setup();
    let movedDirection: string | undefined = undefined;
    const grid: Pick<TabletopGrid, 'move'> = {
      move: (direction: string) => {
        movedDirection = direction;
        return { x: 0, y: 0 };
      },
    };
    render(<TabletopControls grid={grid as TabletopGrid} />);
    await user.click(screen.getByText('Right'));
    expect(movedDirection, 'no direction was moved').toBeDefined();
    expect(movedDirection, 'movement direction was incorrect').toBe('right');
  });
});
