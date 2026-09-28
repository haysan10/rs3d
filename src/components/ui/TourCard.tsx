// src/components/ui/TourCard.tsx
import { useAppStore } from '../../store/useAppStore';
import { getTourRooms, deviceIcons } from '../../data/rooms';

export function TourCard() {
  const { tourStep, setTourStep, setWalkthroughMode, tourPlaying, setTourPlaying, activeFloor } = useAppStore();
  const floorNumber = activeFloor === 1 ? 1 : 2;
  const tourRooms = getTourRooms(floorNumber);
  const room = tourRooms[tourStep];

  if (!room) return null;

  function handleNext() {
    if (tourStep < tourRooms.length - 1) {
      setTourStep(tourStep + 1);
    } else {
      setWalkthroughMode('none');
    }
  }

  function handleSkip() {
    setWalkthroughMode('none');
  }

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-40 fade-in-up">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/50 overflow-hidden">
        {/* Progress bar */}
        <div className="h-1 bg-gray-100">
          <div
            className="h-full bg-gradient-to-r from-[#1A6FB4] to-[#0EA5E9] transition-all duration-700"
            style={{ width: `${((tourStep + 1) / tourRooms.length) * 100}%` }}
          />
        </div>

        <div className="p-4">
          {/* Step indicator */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 font-semibold">
              Lantai {room.floor} • Ruang {tourStep + 1} dari {tourRooms.length}
            </span>
            {room.vlan && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                VLAN {room.vlan.id} • {room.vlan.name}
              </span>
            )}
          </div>

          {/* Room name */}
          <h3 className="text-lg font-bold text-gray-800 mb-1">{room.name}</h3>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">{room.description}</p>

          {/* Devices preview */}
          {room.devices.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {room.devices.map((dev) => (
                <span
                  key={dev.id}
                  className="flex items-center gap-1 text-xs bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1 font-medium text-slate-700"
                >
                  <span>{deviceIcons[dev.type]}</span>
                  <span>{dev.label}{dev.qty && dev.qty > 1 ? ` ×${dev.qty}` : ''}</span>
                </span>
              ))}
            </div>
          )}

          {/* Controls */}
          <div className="flex gap-2">
            <button
              onClick={handleSkip}
              className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Tutup Tur
            </button>
            <div className="flex-1" />
            <button
              onClick={() => setTourPlaying(!tourPlaying)}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium cursor-pointer"
            >
              {tourPlaying ? '⏸ Jeda' : '▶ Lanjutkan'}
            </button>
            <button
              onClick={handleNext}
              className="px-4 py-2 text-sm bg-[#1A6FB4] hover:bg-[#135A96] text-white rounded-lg transition-colors font-semibold cursor-pointer shadow-md"
            >
              {tourStep < tourRooms.length - 1 ? 'Lanjut →' : 'Selesai ✓'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
