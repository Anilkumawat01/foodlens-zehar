import React from 'react';
import { Trash2, AlertTriangle, Inbox, Zap, ShieldAlert, Award } from 'lucide-react';

export default function HistoryView({ history, onSelectProduct, onDeleteItem, onClearAll }) {
  
  // Calculate toxic load score (0 to 100)
  const calculateToxicScore = () => {
    let score = 0;
    history.forEach(item => {
      if (item.dangerLevel === 'danger') score += 25;
      else if (item.dangerLevel === 'concerning') score += 15;
      else if (item.dangerLevel === 'meh') score += 8;
      else if (item.dangerLevel === 'safe') score -= 10;
    });
    return Math.max(0, Math.min(100, score));
  };

  const toxicScore = calculateToxicScore();

  // Dynamic advice
  const getWeeklyAdvice = (score) => {
    if (score === 0) return "Clean, green, and pristine. Ramesh's mother is nodding in approval.";
    if (score <= 30) return "A few slip-ups. Your cells are calm and kidneys are happy. Keep it clean!";
    if (score <= 60) return "Refined flour is clogging the gears. Drop the Parle-G and eat some fruit.";
    if (score <= 85) return "Veins begging for fresh food. Touch grass, drink water, and avoid palmolein oil!";
    return "CRITICAL: You are running on chemical energy and sodium. Drink green tea immediately!";
  };

  // Real Additives Counter
  const countTotalAdditives = () => {
    let total = 0;
    history.forEach(item => {
      const text = item.ingredients_text || "";
      const matches = text.match(/E\d{3,4}[a-z]?/gi) || [];
      const list = [...new Set(matches.map(m => m.toUpperCase()))];
      
      const lowercaseText = text.toLowerCase();
      const customMatches = ["monosodium glutamate", "msg", "tartrazine", "sunset yellow", "sodium benzoate", "potassium sorbate"];
      let customCount = 0;
      customMatches.forEach(cm => {
        if (lowercaseText.includes(cm)) customCount++;
      });
      total += Math.max(list.length, customCount);
    });
    return total;
  };

  // Average Nutri-Score Grade
  const getAverageNutriScore = () => {
    if (history.length === 0) return null;
    let sum = 0;
    let count = 0;
    history.forEach(item => {
      const grade = item.nutrition_grades;
      if (grade) {
        const val = { a: 1, b: 2, c: 3, d: 4, e: 5 }[grade.toLowerCase()];
        if (val) {
          sum += val;
          count++;
        }
      }
    });
    if (count === 0) return null;
    const avg = Math.round(sum / count);
    return { 1: 'A', 2: 'B', 3: 'C', 4: 'D', 5: 'E' }[avg] || 'C';
  };

  // Funniest Roast Highlight Quote
  const getFunniestQuote = () => {
    if (history.length === 0) return null;
    // Get latest scanned item with roast
    const itemWithRoast = history.find(item => item.roast);
    return itemWithRoast ? itemWithRoast.roast : null;
  };

  const totalAdditives = countTotalAdditives();
  const avgNutriScore = getAverageNutriScore();
  const funniestQuote = getFunniestQuote();

  const formatDate = (isoString) => {
    if (!isoString) return "Scanned";
    const date = new Date(isoString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="history-screen">
      <div>
        <h2 className="scanner-title">Your Toxic Ledger</h2>
        <p className="scanner-tagline">Track your weekly dietary sins</p>
      </div>

      {/* Weekly Damage Dashboard Panel */}
      {history.length > 0 && (
        <div className="dashboard-panel">
          <div className="weekly-report-header">
            <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Weekly Toxic Load
            </span>
            <div className="dashboard-score-box">
              <span className="dashboard-score-number" style={{ 
                color: toxicScore > 60 ? 'var(--color-danger)' : 
                       toxicScore > 30 ? 'var(--color-concerning)' : 'var(--color-safe)'
              }}>
                {toxicScore}
              </span>
              <span className="dashboard-score-max">/100</span>
            </div>
          </div>

          <div className="toxic-bar-wrapper">
            <div 
              className="toxic-bar-fill" 
              style={{ 
                width: `${toxicScore}%`,
                background: toxicScore > 60 ? 'var(--color-danger)' : 
                            toxicScore > 30 ? 'var(--color-concerning)' : 'var(--color-safe)'
              }}
            />
          </div>

          {/* Stats Summary Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginTop: '4px' }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontSize: '9px', display: 'block', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Additives Scanned</span>
              <span style={{ fontSize: '18px', fontWeight: 900, color: 'var(--color-concerning)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                <Zap size={14} /> {totalAdditives}
              </span>
            </div>
            
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontSize: '9px', display: 'block', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Avg Nutri-Score</span>
              <span style={{ 
                fontSize: '18px', 
                fontWeight: 900, 
                color: avgNutriScore === 'A' || avgNutriScore === 'B' ? 'var(--color-safe)' : avgNutriScore === 'C' ? 'var(--color-meh)' : 'var(--color-danger)', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px',
                marginTop: '2px'
              }}>
                <Award size={14} /> {avgNutriScore || 'N/A'}
              </span>
            </div>
          </div>

          {/* Highlight Roast Quote Box */}
          {funniestQuote && (
            <div style={{ background: 'rgba(158, 0, 255, 0.03)', border: '1px solid rgba(158, 0, 255, 0.12)', padding: '10px 12px', borderRadius: '12px', fontSize: '11px', color: '#D9D9E0' }}>
              <span style={{ display: 'block', fontSize: '9px', fontWeight: 800, color: 'var(--color-safe)', textTransform: 'uppercase', marginBottom: '2px' }}>Funniest Roast Quote:</span>
              <span style={{ fontStyle: 'italic' }}>"{funniestQuote.length > 95 ? funniestQuote.slice(0, 95) + "..." : funniestQuote}"</span>
            </div>
          )}

          {/* Advice note */}
          <div className="weekly-advice-box">
            <AlertTriangle size={14} style={{ color: 'var(--color-meh)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
              <span style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '9px', color: 'var(--text-muted)' }}>Advice:</span>
              <span>{getWeeklyAdvice(toxicScore)}</span>
            </div>
          </div>
        </div>
      )}

      {/* History List */}
      <div className="history-list-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-primary)' }}>
            Weekly Logs ({history.length})
          </span>
          {history.length > 0 && (
            <button 
              onClick={onClearAll}
              style={{ background: 'none', border: 'none', color: 'var(--color-danger)', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
            >
              Clear Ledger
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="no-history-state">
            <Inbox size={48} strokeWidth={1} />
            <p style={{ fontWeight: 700, color: 'white' }}>Ledger is Empty</p>
            <p style={{ fontSize: '11px', marginTop: '2px' }}>Scan barcode or search name to record health sins.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {history.map((item) => (
              <div 
                className="history-item" 
                key={item.id || item.barcode}
                onClick={() => onSelectProduct(item)}
              >
                <div className="history-item-left">
                  <span className="history-item-name">{item.name}</span>
                  <span className="history-item-brand-date">
                    {item.brand} • {formatDate(item.scannedAt)}
                  </span>
                </div>
                <div className="history-item-right" onClick={(e) => e.stopPropagation()}>
                  <span className={`preset-badge ${item.dangerLevel === 'danger' ? 'danger' : item.dangerLevel === 'concerning' ? 'concerning' : item.dangerLevel === 'safe' ? 'safe' : 'meh'}`} style={{ position: 'static' }}>
                    {item.ratingLabel || 'Concerning'}
                  </span>
                  <button 
                    className="btn-delete-history"
                    onClick={() => onDeleteItem(item.id || item.barcode)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
