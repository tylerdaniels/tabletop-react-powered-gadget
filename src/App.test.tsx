import { screen, render, waitFor } from '@testing-library/react';
import App from './App';

describe('App tests', () => {
  it('should render the title (after loading i18n)', async () => {
    render(<App />);

    // i18next library introduces a Suspense for lazy loading translations
    // We might need to change this if we switch to a backend-supplied translations
    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          level: 1,
        })
      ).toHaveTextContent('Toy Robot Simulator');
    });
  });
});
