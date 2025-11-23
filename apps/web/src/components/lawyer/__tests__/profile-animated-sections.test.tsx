import { render } from '@testing-library/react';
import ProfileAnimatedSections from '../profile-animated-sections';

// Mock framer-motion to avoid animation complexities in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
  },
}));

describe('ProfileAnimatedSections', () => {
  it('should render children', () => {
    const { container } = render(
      <ProfileAnimatedSections>
        <div>Child 1</div>
      </ProfileAnimatedSections>
    );
    expect(container.textContent).toContain('Child 1');
  });

  it('should render multiple children', () => {
    const { container } = render(
      <ProfileAnimatedSections>
        <div>Child 1</div>
        <div>Child 2</div>
        <div>Child 3</div>
      </ProfileAnimatedSections>
    );
    expect(container.textContent).toContain('Child 1');
    expect(container.textContent).toContain('Child 2');
    expect(container.textContent).toContain('Child 3');
  });

  it('should apply max-w-6xl mx-auto classes', () => {
    const { container } = render(
      <ProfileAnimatedSections>
        <div>Content</div>
      </ProfileAnimatedSections>
    );
    const wrapper = container.querySelector('.max-w-6xl.mx-auto');
    expect(wrapper).toBeInTheDocument();
  });

  it('should wrap each child in a motion div when multiple children', () => {
    const { container } = render(
      <ProfileAnimatedSections>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
      </ProfileAnimatedSections>
    );
    // Both children should be rendered
    expect(container.querySelector('[data-testid="child-1"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="child-2"]')).toBeInTheDocument();
  });

  it('should handle single child', () => {
    const { container } = render(
      <ProfileAnimatedSections>
        <div data-testid="single-child">Single Child</div>
      </ProfileAnimatedSections>
    );
    expect(container.querySelector('[data-testid="single-child"]')).toBeInTheDocument();
  });

  it('should handle complex nested children', () => {
    const { container } = render(
      <ProfileAnimatedSections>
        <div>
          <h1>Title</h1>
          <p>Paragraph</p>
        </div>
        <div>
          <span>Span content</span>
        </div>
      </ProfileAnimatedSections>
    );
    expect(container.textContent).toContain('Title');
    expect(container.textContent).toContain('Paragraph');
    expect(container.textContent).toContain('Span content');
  });
});
