import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the page without blowing up (smoke-test)', () => {
  render(<App />);
  const textOnPage = screen.getByText(/save to reload/i);
  expect(textOnPage).toBeInTheDocument();
});
