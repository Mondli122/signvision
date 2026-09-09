import React, { useState } from 'react';

export default function DialectSelector({ currentProvince, onSelectProvince }) {
  const [isOpen, setIsOpen] = useState(false);

  const provinces = [
    { name: 'Gauteng', flag: '🏛️', notes: 'Urban SASL standard, rapid 2-hand signs' },
    { name: 'Western Cape', flag: '🏔️', notes: 'Coastal SASL expressions & greeting variants' },
    { name: 'KwaZulu-Natal', flag: '🌊', notes: 'KZN regional cultural signs & family markers' },
    { name: 'Eastern Cape', flag: '🌾', notes: 'Traditional regional fingerspelling & community signs' },
    { name: 'Free State', flag: '🌻', notes: 'Spatial direction markers & agricultural signs' }
  ];

  const handleSelect = async (provinceName) => {
    onSelectProvince(provinceName);
    setIsOpen(false);
    try {
      await fetch('/api/sasl-dialect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ province: provinceName })
      });
    } catch (err) {
      console.error('Dialect error:', err);
    }
  };

  const selectedObj = provinces.find(p => p.name === currentProvince) || provinces[0];

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(0, 245, 155, 0.4)',
          borderRadius: '10px',
          color: '#f8fafc',
          padding: '8px 14px',
          fontSize: '0.88rem',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <span>🇿🇦 SASL Dialect:</span>
        <span style={{ color: '#00F59B' }}>{selectedObj.flag} {selectedObj.name}</span>
        <span style={{ fontSize: '0.7rem' }}>▼</span>
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '110%',
          right: 0,
          background: '#0b0f19',
          border: '1px solid rgba(0, 245, 155, 0.3)',
          borderRadius: '12px',
          padding: '8px',
          minWidth: '280px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          zIndex: 100
        }}>
          <div style={{ padding: '6px 10px', fontSize: '0.75rem', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            Select Regional SASL Provincial Corpus
          </div>
          {provinces.map((prov) => (
            <div
              key={prov.name}
              onClick={() => handleSelect(prov.name)}
              style={{
                padding: '10px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                background: currentProvince === prov.name ? 'rgba(0, 245, 155, 0.15)' : 'transparent',
                borderLeft: currentProvince === prov.name ? '3px solid #00F59B' : '3px solid transparent',
                marginTop: '4px',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', color: currentProvince === prov.name ? '#00F59B' : '#f8fafc', fontWeight: 'bold' }}>
                <span>{prov.flag} {prov.name}</span>
                {currentProvince === prov.name && <span style={{ fontSize: '0.8rem' }}>✓ Active</span>}
              </div>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginTop: '2px' }}>
                {prov.notes}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
