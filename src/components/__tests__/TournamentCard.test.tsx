import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import TournamentCard from '../TournamentCard';

const mockTournament = {
  id: 'tournament-1',
  name: 'Test Tournament',
  description: 'Test tournament description',
  prize_pool: 1000000,
  max_participants: 32,
  current_participants: 16,
  status: 'registration_open',
  start_date: '2024-12-01T00:00:00Z',
};

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('TournamentCard', () => {
  test('renders tournament information correctly', () => {
    renderWithRouter(<TournamentCard tournament={mockTournament} />);

    expect(screen.getByText('Test Tournament')).toBeInTheDocument();
    expect(screen.getByText('Test tournament description')).toBeInTheDocument();
    expect(screen.getByText('1,000,000 VND')).toBeInTheDocument();
    expect(screen.getByText('16/32 participants')).toBeInTheDocument();
  });

  test('shows registration open status', () => {
    renderWithRouter(<TournamentCard tournament={mockTournament} />);

    expect(screen.getByText('Registration Open')).toBeInTheDocument();
  });

  test('handles join tournament click', () => {
    const mockOnJoin = jest.fn();
    renderWithRouter(
      <TournamentCard tournament={mockTournament} onJoin={mockOnJoin} />
    );

    const joinButton = screen.getByText('Join Tournament');
    fireEvent.click(joinButton);

    expect(mockOnJoin).toHaveBeenCalledWith('tournament-1');
  });

  test('displays correct date format', () => {
    renderWithRouter(<TournamentCard tournament={mockTournament} />);

    expect(screen.getByText(/Dec 1, 2024/)).toBeInTheDocument();
  });
}); 