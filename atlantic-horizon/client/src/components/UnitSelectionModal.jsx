import React, { useState, useEffect } from 'react';
import { COLORS } from '../colors';

export default function UnitSelectionModal({ isOpen, onClose, roomType, department, onComplete }) {
  const [physicalRooms, setPhysicalRooms] = useState([]);
  const [selectedUnits, setSelectedUnits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/physical-rooms');
        const data = await res.json();
        const filtered = data.filter(r => r.department === department);
        setPhysicalRooms(filtered);
        // Pre-select rooms already assigned to this roomType
        const preSelected = filtered
          .filter(r => r.roomType === roomType)
          .map(r => r.roomName);
        setSelectedUnits(preSelected);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [isOpen, department, roomType]);

  const toggleUnit = (roomName) => {
    setSelectedUnits(prev =>
      prev.includes(roomName)
        ? prev.filter(u => u !== roomName)
        : [...prev, roomName]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/physical-rooms/assign', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomType, unitNames: selectedUnits }),
      });
      const data = await res.json();
      if (res.ok) {
        onComplete && onComplete(data.message);
        onClose();
      } else {
        alert(data.message || 'Assignment failed');
      }
    } catch (e) {
      alert('Server error');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div
        className="w-full max-w-lg p-8 border shadow-2xl relative"
        style={{ backgroundColor: COLORS.bgSurface, borderColor: COLORS.border }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white text-xl transition-colors"
        >
          ✕
        </button>

        <p className="text-amber-500 uppercase tracking-[0.4em] text-[9px] font-black mb-1">Unit Assignment</p>
        <h2 className="text-2xl font-serif italic mb-1">{roomType}</h2>
        <p className="text-white/30 text-xs uppercase tracking-widest mb-6">{department}</p>

        {loading ? (
          <p className="text-white/40 text-xs uppercase tracking-widest animate-pulse">Loading units...</p>
        ) : physicalRooms.length === 0 ? (
          <p className="text-white/30 text-xs italic text-center py-8 border border-dashed" style={{ borderColor: COLORS.border }}>
            No physical units in this department yet.
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-3 max-h-64 overflow-y-auto pr-1 mb-6">
            {physicalRooms.map(unit => {
              const isSelected = selectedUnits.includes(unit.roomName);
              return (
                <button
                  key={unit._id}
                  onClick={() => toggleUnit(unit.roomName)}
                  className={`p-3 border text-left transition-all text-xs uppercase tracking-widest font-black ${
                    isSelected
                      ? 'border-amber-500 text-amber-500 bg-amber-500/10'
                      : 'border-white/10 text-white/50 hover:border-white/30 hover:text-white/70'
                  }`}
                >
                  {unit.roomName}
                  {unit.roomType && unit.roomType !== roomType && (
                    <span className="block text-[8px] text-red-400/60 mt-1 normal-case font-normal">
                      {unit.roomType}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-amber-600 hover:bg-amber-500 text-white font-black text-[10px] uppercase tracking-[0.2em] py-3 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : `Assign ${selectedUnits.length} Unit(s)`}
          </button>
          <button
            onClick={onClose}
            className="px-6 border text-white/50 hover:text-white text-[10px] uppercase tracking-[0.2em] font-black transition-colors"
            style={{ borderColor: COLORS.border }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
