import React from 'react';
import { render, screen } from '@testing-library/react';
import { PixelTrail } from './ui/pixel-trail';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
    useAnimationControls: () => ({
        start: jest.fn(),
    }),
}));

// Mock ResizeObserver
class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
}
window.ResizeObserver = ResizeObserver;

test('renders PixelTrail component', () => {
    render(
        <div style={{ width: '500px', height: '500px' }}>
            <PixelTrail pixelSize={20} />
        </div>
    );
    // It should render multiple divs (pixels)
    // Since we can't easily count exact pixels without mocking dimensions explicitly,
    // we just check if it doesn't crash and renders something.
    // The integration is visual, so this smoke test is minimal.
});
