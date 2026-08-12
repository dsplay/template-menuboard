import {
  describe, it, afterEach,
} from 'vitest';
import { render, cleanup } from '@testing-library/react';
import App from '.';

afterEach(cleanup);

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
  });
});
