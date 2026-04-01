import { useQuery } from '@tanstack/react-query';
import { getRaces } from '../../api/lookup';

interface RaceSelectorProps {
  selectedRaceId: number;
  onSelectRace: (race: number) => void;
  error?: string;
}

export function RaceSelector({ selectedRaceId, onSelectRace, error }: RaceSelectorProps) {
  const { data: races=[], isLoading, isError } = useQuery({
    queryKey: ['races'],
    queryFn: getRaces,
  });

  if (isLoading) return <div className="mb-4 text-[11px] text-[#6b5e42]">Loading races...</div>;
  if (isError) return <div className="mb-4 text-[11px] text-red-500">Failed to load races.</div>;

  return (
    <div className="mb-4">
      <div className="mb-2.5 text-[11px] uppercase tracking-[1.5px] text-[#6b5e42]">
        Choose your race
      </div>
      <div className="grid grid-cols-5 gap-1.5">
        {races.map((race) => (
          <button
            key={race.id}
            type="button"
            onClick={() => onSelectRace(Number(race.id))}
            className={`cursor-pointer rounded border-[0.5px] px-1 py-1.75 text-center text-[11px] tracking-[0.5px] transition-all duration-150 ${
              selectedRaceId === race.id
                ? 'border-[#c9a84c] bg-[#1e180e] text-[#c9a84c]'
                : 'border-[#2a2520] bg-[#0a0906] text-[#6b5e42] hover:border-[#c9a84c] hover:text-[#c9a84c]'
            }`}
          >
            {race.name}
          </button>
        ))}
      </div>
      {error && <p className="mt-1 text-[11px] text-red-500">{error}</p>}
    </div>
  );
}