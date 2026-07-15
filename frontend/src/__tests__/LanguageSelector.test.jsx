import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LanguageSelector from '../components/LanguageSelector';

describe('LanguageSelector', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  test('renders in full mode by default', () => {
    render(<LanguageSelector value="en" onChange={mockOnChange} />);
    expect(screen.getByText('Output Language')).toBeInTheDocument();
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('தமிழ்')).toBeInTheDocument();
  });

  test('renders in compact mode', () => {
    render(<LanguageSelector value="en" onChange={mockOnChange} compact />);
    expect(screen.queryByText('Output Language')).not.toBeInTheDocument();
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
  });

  test('calls onChange when English button clicked', () => {
    render(<LanguageSelector value="ta" onChange={mockOnChange} />);
    fireEvent.click(screen.getByText('English'));
    expect(mockOnChange).toHaveBeenCalledWith('en');
  });

  test('calls onChange when Tamil button clicked', () => {
    render(<LanguageSelector value="en" onChange={mockOnChange} />);
    const tamilButton = screen.getByText('தமிழ்').closest('button');
    fireEvent.click(tamilButton);
    expect(mockOnChange).toHaveBeenCalledWith('ta');
  });

  test('calls onChange in compact mode', () => {
    render(<LanguageSelector value="en" onChange={mockOnChange} compact />);
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'ta' } });
    expect(mockOnChange).toHaveBeenCalledWith('ta');
  });

  test('highlights selected language', () => {
    render(<LanguageSelector value="en" onChange={mockOnChange} />);
    const englishButton = screen.getByText('English').closest('button');
    expect(englishButton).toHaveClass('bg-blue-600');
  });

  test('shows both native and english labels in full mode', () => {
    render(<LanguageSelector value="en" onChange={mockOnChange} />);
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Tamil')).toBeInTheDocument();
    expect(screen.getByText('தமிழ்')).toBeInTheDocument();
  });

  test('defaults to English when value not in list', () => {
    render(<LanguageSelector value="fr" onChange={mockOnChange} />);
    const select = screen.getByRole('combobox');
    expect(select.value).toBe('en');
  });
});
