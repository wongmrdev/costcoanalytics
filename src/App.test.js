import { render, screen } from '@testing-library/react';
import App from './App';
import Canvas from './components/Canvas';
test('renders canvas', () => {
  render(<App />);
  const linkElement = screen.getByText(/Costco Analytics/i);
  expect(linkElement).toBeInTheDocument();
});
