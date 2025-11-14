import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FilterTag from '../FilterTag';

describe('FilterTag', () => {
  const defaultProps = {
    label: 'Criminal Law',
    value: 'CRIMINAL',
    onClick: jest.fn(),
    selected: false,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the label correctly', () => {
    render(<FilterTag {...defaultProps} />);
    expect(screen.getByText('Criminal Law')).toBeInTheDocument();
  });

  it('calls onClick with the value when clicked', () => {
    render(<FilterTag {...defaultProps} />);
    const tag = screen.getByText('Criminal Law');

    fireEvent.click(tag);

    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
    expect(defaultProps.onClick).toHaveBeenCalledWith('CRIMINAL');
  });

  it('does not show X icon when not selected', () => {
    const { container } = render(<FilterTag {...defaultProps} />);
    const xIcon = container.querySelector('svg');

    expect(xIcon).not.toBeInTheDocument();
  });

  it('shows X icon when selected', () => {
    const { container } = render(<FilterTag {...defaultProps} selected={true} />);
    const xIcon = container.querySelector('svg');

    expect(xIcon).toBeInTheDocument();
  });

  it('handles multiple clicks correctly', () => {
    render(<FilterTag {...defaultProps} />);
    const tag = screen.getByText('Criminal Law');

    fireEvent.click(tag);
    fireEvent.click(tag);
    fireEvent.click(tag);

    expect(defaultProps.onClick).toHaveBeenCalledTimes(3);
    expect(defaultProps.onClick).toHaveBeenCalledWith('CRIMINAL');
  });
});
