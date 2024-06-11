import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Create User subtitle', () => {
  render(<App />);
  const createUserTitle = screen.getByText(/Create User:/i);
  expect(createUserTitle).toBeInTheDocument();
});
