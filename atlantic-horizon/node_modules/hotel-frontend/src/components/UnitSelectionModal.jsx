import React, { useState, useEffect } from 'react';
import { COLORS } from '../colors';

export default function UnitSelectionModal({ isOpen, onClose, roomType, department, onComplete }) {
  const [availableUnits, setAvailableUnits] = useState([]);
  const [selectedUnits, setSelectedUnits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchAllUnits = async () => {
      setFetching(true);
      setError(null);
      try {
        const res = await fetch('http://localhost:5000/api/physical-rooms');
        const data = await res.json();
        
        // Filter to only this department
        // Also: units are available if they are unassigned OR already assigned to THIS package
        const relevantUnits = data.filter(u => u.department === department);
        setAvailableUnits(relevantUnits);
        
        // Pre-select units already linked to this package
        const currentLinks = relevantUnits.filter(u => u.roomType === roomType).map(u => u.roomName);
        setSelectedUnits(currentLinks);
      } catch (err) {
        setError('Failed to fetch pool of units');
      } finally {
        setFetching(false);
      }
    };

    fetchAllUnits();
  }, [isOpen, department, roomType]);

  if (!isOpen) return null;

  const toggleUnit = (name) => {
    setSelectedUnits(prev => 
      prev.includes(name) ? prev.filter(u => u !== name) : [...prev, name]
    );
  };

  const handleAssign = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('http://localhost:5000/api/physical-rooms/assign', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomType,
          unitNames: selectedUnits
        })
      });

      const data = await res.json();
      if (res.ok) {
        onComplete(data.message);
        onClose();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Assignment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div 
        className="w-full max-w-xl border shadow-2xl relative overflow-hidden flex flex-col max-h-[85vh]" 
        style={{ backgroundColor: COLORS.bgSurface, borderColor: COLORS.border }}
      >
        <div className="h-1 bg-amber-600 w-full"></div>

        <div className="p-8 pb-4">
          <div className="mb-6">
            <p className="text-amber-500 text-[10px] uppercase tracking-[0.4em] font-black mb-1">Unit Selection & Mapping</p>
            <h2 className="text-2xl font-serif">Assign Units to {roomType}</h2>
            <p className="text-white/40 text-[10px] uppercase tracking-widest mt-1">
              Select which physical rooms represent this package in {department}
            </p>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-500/50 text-red-200 text-[11px] p-3 mb-6 uppercase tracking-tight font-medium">
              Aiya! {error}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-2">
          {fetching ? (
            <p className="text-xs text-white/30 animate-pulse uppercase tracking-widest">Scanning wing for available units...</p>
          ) : availableUnits.length === 0 ? (
            <div className="py-12 border border-dashed border-white/5 text-center px-4">
              <p className="text-white/30 text-sm italic mb-4">No unassigned units found in {department}.</p>
              <p className="text-[10px] text-white/20 uppercase tracking-widest leading-loose">
                Please go to <span className="text-amber-500 font-bold">Physical Room Units</span> page first <br/> 
                to create new generic identifiers for this wing.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pb-8">
              {availableUnits.map(unit => (
                <div 
                  key={unit._id}
                  onClick={() => toggleUnit(unit.roomName)}
                  className={`p-4 border transition-all cursor-pointer relative group ${selectedUnits.includes(unit.roomName) ? 'border-amber-500 bg-amber-500/5' : 'border-white/5 bg-white/5 hover:border-white/20'}`}
                >
                  <div className={`absolute top-2 right-2 w-3 h-3 border rounded-sm transition-colors ${selectedUnits.includes(unit.roomName) ? 'bg-amber-500 border-amber-500' : 'border-white/20'}`}>
                    {selectedUnits.includes(unit.roomName) && (
                      <svg viewBox="0 0 24 24" className="w-full h-full text-white fill-current"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                    )}
                  </div>
                  <p className={`text-lg font-mono ${selectedUnits.includes(unit.roomName) ? 'text-amber-500' : 'text-white/60'}`}>{unit.roomName}</p>
                  <p className="text-[8px] uppercase tracking-tighter mt-1 truncate">
                    {unit.roomType === roomType ? (
                      <span className="text-amber-500/60 font-medium">Currently Linked</span>
                    ) : unit.roomType ? (
                      <span className="text-white/20 italic">Mapped to: {unit.roomType}</span>
                    ) : (
                      <span className="text-white/10 italic">Unassigned Unit</span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-8 pt-4 border-t border-white/5 flex gap-4 bg-black/20">
          <button 
            type="button" 
            onClick={onClose}
            className="flex-1 py-3 border border-white/10 text-white/40 hover:text-white uppercase text-[10px] font-black tracking-[0.2em] transition-all"
          >
            Cancel
          </button>
          <button 
            type="button" 
            onClick={handleAssign}
            disabled={loading || fetching}
            className="flex-[2] py-3 bg-amber-600 hover:bg-amber-500 text-white uppercase text-[10px] font-black tracking-[0.2em] shadow-lg shadow-amber-900/20 transition-all disabled:opacity-50"
          >
            {loading ? 'Mapping Units...' : `Link ${selectedUnits.length} Selected Units`}
          </button>
        </div>
      </div>
    </div>
  );
}
