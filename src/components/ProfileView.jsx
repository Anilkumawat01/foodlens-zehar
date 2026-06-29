import React from 'react';
import { User, Check, Clock, Award, ShieldAlert } from 'lucide-react';

export default function ProfileView({ profile, onUpdateProfile, history = [], onSelectProduct }) {
  
  const toggleFlag = (flagKey) => {
    onUpdateProfile({
      ...profile,
      [flagKey]: !profile[flagKey]
    });
  };

  const modes = [
    {
      key: 'diabetic',
      emoji: '🍬',
      title: 'Diabetic Mode',
      subtitle: 'Decodes sugars and starches',
      desc: 'Triggers critical alerts for sugars, invert syrup, and maltodextrin that spike insulin.'
    },
    {
      key: 'hypertensive',
      emoji: '🩸',
      title: 'Hypertensive Mode',
      subtitle: 'Flags high sodium & preservative salts',
      desc: 'Triggers warnings if sodium content is above 400mg per 100g to safeguard blood pressure.'
    },
    {
      key: 'fitness',
      emoji: '💪',
      title: 'Gym Bro / Fitness Goals',
      subtitle: 'Flags high fats & empty carbs',
      desc: 'Flags high palmolein oil, saturated fat, and lack of protein to preserve muscle macros.'
    },
    {
      key: 'pregnant',
      emoji: '🤰',
      title: 'Pregnant Mode',
      subtitle: 'Flags caffeine, high sodium & colors',
      desc: 'Warns about caffeine, additives, and high salt that affect hydration or pressure.'
    },
    {
      key: 'kid',
      emoji: '👶',
      title: 'Child Mode (Kid)',
      subtitle: 'Flags MSG, colors & sweeteners',
      desc: 'Detects artificial coloring, Monosodium Glutamate (MSG), and chemical preservatives.'
    }
  ];

  const formatDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get last 10 scans
  const lastTenScans = history.slice(0, 10);

  return (
    <div className="profile-screen" style={{ paddingBottom: '32px' }}>
      <div>
        <h2 className="scanner-title">Your Risk Profile</h2>
        <p className="scanner-tagline">Set filters to trigger custom warning flags</p>
      </div>

      {/* Profile Toggles Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {modes.map((mode) => {
          const isActive = profile[mode.key];
          return (
            <div 
              key={mode.key}
              className={`profile-option-card ${isActive ? 'active' : ''}`}
              style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', textAlign: 'left', gap: '14px', padding: '12px' }}
              onClick={() => toggleFlag(mode.key)}
            >
              <span className="profile-icon" style={{ fontSize: '24px', marginTop: '2px' }}>{mode.emoji}</span>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span className="profile-title-text" style={{ fontSize: '13px', fontWeight: 800, color: isActive ? 'var(--color-safe)' : 'white' }}>{mode.title}</span>
                <p style={{ fontSize: '11px', color: '#B3B3C2', lineHeight: '1.3' }}>{mode.desc}</p>
              </div>
              <div style={{ 
                width: '18px', 
                height: '18px', 
                borderRadius: '50%', 
                border: '1.5px solid rgba(255,255,255,0.15)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: isActive ? 'var(--color-accent)' : 'none',
                borderColor: isActive ? 'var(--color-accent)' : 'rgba(255,255,255,0.15)',
                flexShrink: 0
              }}>
                {isActive && <Check size={10} color="white" strokeWidth={3} />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Last 10 Scans Ledger */}
      <div style={{ marginTop: '16px' }}>
        <h3 className="ingredients-section-title" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
          <Clock size={14} />
          <span>Last 10 Scans Ledger</span>
        </h3>
        
        {lastTenScans.length === 0 ? (
          <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '16px', textStyle: 'italic', textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
            No recent scans in history ledger.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {lastTenScans.map((item, idx) => (
              <div 
                key={idx}
                onClick={() => onSelectProduct(item)}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid rgba(255,255,255,0.03)',
                  padding: '10px 14px',
                  borderRadius: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'var(--transition-smooth)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.03)'}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0, flex: 1, paddingRight: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.productName || item.name}</span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    Code: {item.barcode} • {formatDate(item.timestamp || item.scannedAt)}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {item.nutriScore && (
                    <span style={{
                      background: item.nutriScore.toLowerCase() === 'a' ? '#00E676' : item.nutriScore.toLowerCase() === 'b' ? '#AEEA00' : item.nutriScore.toLowerCase() === 'c' ? '#FFD600' : item.nutriScore.toLowerCase() === 'd' ? '#FF6D00' : '#D50000',
                      color: 'var(--text-dark)',
                      fontSize: '9px',
                      fontWeight: 900,
                      padding: '1px 6px',
                      borderRadius: '4px',
                      textTransform: 'uppercase'
                    }}>
                      {item.nutriScore}
                    </span>
                  )}
                  <span style={{
                    fontSize: '9px',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: item.dangerLevel === 'safe' ? 'rgba(0,255,102,0.1)' : item.dangerLevel === 'meh' ? 'rgba(255,214,0,0.1)' : 'rgba(255,51,51,0.1)',
                    color: item.dangerLevel === 'safe' ? 'var(--color-safe)' : item.dangerLevel === 'meh' ? 'var(--color-meh)' : 'var(--color-danger)'
                  }}>
                    {item.dangerLevel?.toUpperCase() || 'MEH'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
