import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { StepPlayer } from './StepPlayer';
import type { Step } from '../types/algorithm';

const steps: Step[] = [
  {
    stepNumber: 0,
    action: 'Step zero',
    state: {},
    highlights: [],
    sourceLineStart: 1,
    sourceLineEnd: 1,
    explanation: 'First explanation',
  },
  {
    stepNumber: 1,
    action: 'Step one',
    state: {},
    highlights: [],
    sourceLineStart: 2,
    sourceLineEnd: 2,
    explanation: null,
  },
  {
    stepNumber: 2,
    action: 'Step two',
    state: {},
    highlights: [],
    sourceLineStart: 3,
    sourceLineEnd: 3,
    explanation: 'Third explanation',
  },
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

  it('renders the code panel alongside the state view when renderCode is provided', () => {
    render(
      <StepPlayer
        steps={steps}
        renderState={(step) => <div>state-{step.stepNumber}</div>}
        renderCode={(step) => <div>code-{step.sourceLineStart}</div>}
      />,
    );

    expect(screen.getByText('state-0')).toBeInTheDocument();
    expect(screen.getByText('code-1')).toBeInTheDocument();
  });
});
