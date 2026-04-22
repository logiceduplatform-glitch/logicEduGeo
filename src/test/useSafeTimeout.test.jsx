import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act } from '@testing-library/react';
import useSafeTimeout from '../hooks/useSafeTimeout';

function TestComponent({ onFire }) {
  const { safeTimeout, clearSafeTimeout } = useSafeTimeout();

  React.useEffect(() => {
    const id = safeTimeout(() => {
      onFire?.();
    }, 1000);

    if (window.__clearId) {
      clearSafeTimeout(id);
    }
  }, [safeTimeout, clearSafeTimeout, onFire]);

  return <div>test</div>;
}

describe('useSafeTimeout', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    delete window.__clearId;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('fires callback after specified delay', () => {
    const onFire = vi.fn();
    render(<TestComponent onFire={onFire} />);

    expect(onFire).not.toHaveBeenCalled();

    act(() => { vi.advanceTimersByTime(1000); });
    expect(onFire).toHaveBeenCalledTimes(1);
  });

  it('does not fire after component unmounts', () => {
    const onFire = vi.fn();
    const { unmount } = render(<TestComponent onFire={onFire} />);

    unmount();
    act(() => { vi.advanceTimersByTime(2000); });

    expect(onFire).not.toHaveBeenCalled();
  });

  it('clearSafeTimeout prevents the callback from firing', () => {
    const onFire = vi.fn();
    window.__clearId = true;
    render(<TestComponent onFire={onFire} />);

    act(() => { vi.advanceTimersByTime(2000); });
    expect(onFire).not.toHaveBeenCalled();
  });
});
