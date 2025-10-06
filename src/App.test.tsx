import { render, screen } from '@testing-library/react';
import App from './App';

test('renders homepage header', () => {
  render(<App />);
  const headerElement = screen.getByText(/Welcome to My Homepage/i);
  expect(headerElement).toBeInTheDocument();
});