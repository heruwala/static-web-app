import { render, screen } from '@testing-library/react';
import App from './App';

test('renders under construction hero content', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /we are building/i })).toBeInTheDocument();
  expect(screen.getByText(/under construction/i)).toBeInTheDocument();
  expect(screen.getAllByText(/Q1 2027/i).length).toBeGreaterThan(0);
});