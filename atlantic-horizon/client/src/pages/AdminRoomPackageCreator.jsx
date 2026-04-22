import React, { useState, useEffect } from 'react';

// --- Data Constants (Aligning with Backend Enums) ---
const DEPARTMENTS = ['Private Lodge', 'Private Residences & Villas', 'Ultimate Exclusivity'];
const BED_TYPES = ['Single', 'Twin', 'Double', 'Queen', 'King', 'Residence Bed'];
const LAYOUTS = ['Studio-style', 'Linked House', 'Standalone Villa', 'Water Villa'];
const AVAILABLE_SERVICES = [
  '24/7 Private Butler', 'Helicopter Transfer', 'Water Entertainment Access',
  'Private Chef', 'Spa Access', 'Chauffeur Service'
];

export default function AdminRoomPackageCreator({ onPackageCreated, editData, onCancel }) {
  //  State Management 
  const [formData, setFormData] = useState({
    department: DEPARTMENTS[0],
    name: '',
    description: '',
    bedType: BED_TYPES[0],
    layout: LAYOUTS[0],
    services: [], // Array for checkboxes
    pricePerNight: 0,
    maxGuests: 2
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Update form if editData changes
  useEffect(() => {
    if (editData) {
      setFormData({
        department: editData.department || DEPARTMENTS[0],
        name: editData.name || '',
        description: editData.description || '',
        bedType: editData.bedType || BED_TYPES[0],
        layout: editData.layout || LAYOUTS[0],
        services: editData.services || [],
        pricePerNight: editData.pricePerNight || 0,
        maxGuests: editData.maxGuests || 2
      });
    }
  }, [editData]);

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceToggle = (service) => {
    setFormData(prev => {
      const isSelected = prev.services.includes(service);
      if (isSelected) {
        return { ...prev, services: prev.services.filter(s => s !== service) };
      } else {
        return { ...prev, services: [...prev.services, service] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const url = editData 
      ? `/api/rooms/${editData._id}`
      : `/api/rooms`;
    
    const method = editData ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`Success: ${data.message || 'Operation successful'}`);
        if (onPackageCreated) onPackageCreated();
      } else {
        setMessage(`Error: ${data.message} | System says: ${data.error || 'Check backend logs'}`);
      }
    } catch (error) {
      setMessage('Failed to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  // Render 
  return (
    <div className="p-6 bg-gray-800 text-white rounded-lg shadow-lg border border-white/10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-amber-500">
          {editData ? 'Update Luxury Package' : 'Create Luxury Package'}
        </h2>
        {editData && (
          <button 
            type="button" 
            onClick={onCancel}
            className="text-xs text-white/50 hover:text-white uppercase tracking-widest font-black"
          >
            Cancel Edit [✕]
          </button>
        )}
      </div>

      {message && (
        <div className={`p-4 mb-4 rounded ${message.startsWith('Success') ? 'bg-green-600' : 'bg-red-600'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Foundation & Identity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1 text-white/60">Department</label>
            <select name="department" value={formData.department} onChange={handleChange} className="w-full p-2 bg-gray-700 rounded border border-white/10 outline-none focus:border-amber-500">
              {DEPARTMENTS.map(dep => <option key={dep} value={dep}>{dep}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1 text-white/60">Package Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="e.g., The Ocean View Helipad Residence" className="w-full p-2 bg-gray-700 rounded border border-white/10 outline-none focus:border-amber-500" />
          </div>
        </div>
        
        <div>
          <label className="block text-sm mb-1 text-white/60">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required placeholder="Describe the luxury package..." className="w-full p-2 bg-gray-700 rounded h-24 border border-white/10 outline-none focus:border-amber-500"></textarea>
        </div>

        {/* Step 2: Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1 text-white/60">Bed Type</label>
            <select name="bedType" value={formData.bedType} onChange={handleChange} className="w-full p-2 bg-gray-700 rounded border border-white/10 outline-none focus:border-amber-500">
              {BED_TYPES.map(bed => <option key={bed} value={bed}>{bed}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1 text-white/60">House Layout</label>
            <select name="layout" value={formData.layout} onChange={handleChange} className="w-full p-2 bg-gray-700 rounded border border-white/10 outline-none focus:border-amber-500">
              {LAYOUTS.map(layout => <option key={layout} value={layout}>{layout}</option>)}
            </select>
          </div>
        </div>

        {/* Step 3: The "Wow" Factor (Services Checkboxes) */}
        <div>
          <label className="block text-sm mb-2 text-white/60">Included Services</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {AVAILABLE_SERVICES.map(service => (
              <label key={service} className={`flex items-center space-x-2 p-2 rounded cursor-pointer transition-colors ${formData.services.includes(service) ? 'bg-amber-600/30 border border-amber-500/50' : 'bg-gray-700 border border-transparent hover:bg-gray-600'}`}>
                <input 
                  type="checkbox" 
                  checked={formData.services.includes(service)}
                  onChange={() => handleServiceToggle(service)}
                  className="rounded text-amber-500 focus:ring-amber-500"
                />
                <span className="text-xs">{service}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Step 4: Pricing & Limits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-600 pt-4">
          <div>
            <label className="block text-sm mb-1 text-white/60">Price Per Night (€)</label>
            <input type="number" name="pricePerNight" value={formData.pricePerNight} onChange={handleChange} required min="0" className="w-full p-2 bg-gray-700 rounded border border-white/10 outline-none focus:border-amber-500" />
          </div>
          <div>
            <label className="block text-sm mb-1 text-white/60">Max Guests (Per House)</label>
            <input type="number" name="maxGuests" value={formData.maxGuests} onChange={handleChange} required min="1" className="w-full p-2 bg-gray-700 rounded border border-white/10 outline-none focus:border-amber-500" />
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-4 px-4 rounded transition duration-200 uppercase tracking-widest text-xs">
          {loading 
            ? (editData ? 'Updating...' : 'Creating...') 
            : (editData ? 'Update Luxury Package 📦' : 'Create Luxury Package ✨')}
        </button>
      </form>
    </div>
  );
}