import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { StepPlayer } from './StepPlayer';
import type { Step } from '../types/algorithm';

const steps: Step[] = [
  { stepNumber: 0, action: 'Step zero', state: {}, highlights: [], explanation: 'First explanation' },
  { stepNumber: 1, action: 'Step one', state: {}, highlights: [], explanation: null },
  { stepNumber: 2, action: 'Step two', state: {}, highlights: [], explanation: 'Third explanation' },
];

function renderPlayer() {
  return render(<StepPlayer steps={steps} renderState={(step) => <div>state-{step.stepNumber}</div>} />);
}

describe('StepPlayer', () => {
  it('shows the first step initially, with Prev disabled', () => {
    renderPlayer();

    expect(screen.getByText('Step 1 of 3')).toBeInTheDocument();
    expect(screen.getByText('Step zero')).toBeInTheDocument();
    expect(screen.getByText('First explanation')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '← Prev' })).toBeDisabled();
  });

  it('advances to the next step and shows the fallback explanation when null', async () => {
    const user = userEvent.setup();
    renderPlayer();

    await user.click(screen.getByRole('button', { name: 'Next →' }));

    expect(screen.getByText('Step 2 of 3')).toBeInTheDocument();
    expect(screen.getByText('Step one')).toBeInTheDocument();
    expect(screen.getByText('No AI explanation available for this step.')).toBeInTheDocument();
  });

  it('goes back with Prev and disables Next on the last step', async () => {
    const user = userEvent.setup();
    renderPlayer();

    await user.click(screen.getByRole('button', { name: 'Next →' }));
    await user.click(screen.getByRole('button', { name: 'Next →' }));

    expect(screen.getByText('Step 3 of 3')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next →' })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: '← Prev' }));

    expect(screen.getByText('Step 2 of 3')).toBeInTheDocument();
  });

  it('renders the algorithm-specific state for the current step', () => {
    renderPlayer();

    expect(screen.getByText('state-0')).toBeInTheDocument();
  });
});
