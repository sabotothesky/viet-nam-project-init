
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
  status: 'registration_open' as const,
  tournament_start: '2024-12-01T00:00:00Z',
  tournament_end: '2024-12-02T00:00:00Z',
  registration_start: '2024-11-01T00:00:00Z',
  registration_end: '2024-11-30T00:00:00Z',
  tournament_type: 'single_elimination' as const,
  game_format: 'standard' as const,
  entry_fee: 100000,
  first_prize: 500000,
  second_prize: 300000,
  third_prize: 200000,
  venue_name: 'Test Venue',
  venue_address: 'Test Address',
  rules: 'Test rules',
  organizer_id: 'org-1',
  club_id: 'club-1',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
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
      <TournamentCard tournament={mockTournament} onRegister={mockOnJoin} />
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
