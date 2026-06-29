import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ShieldAlert, Award, Star, Flame, Sparkles, AlertTriangle, Download, Share2, Info, X, Zap } from 'lucide-react';
import html2canvas from 'html2canvas';
import { generateVoiceRoast, explainAdditive } from '../utils/geminiApi';
const LOCAL_ADDITIVES = {
  "E621": {
    explanation: "Monosodium Glutamate (MSG). A highly addictive flavor enhancer that triggers your brain's pleasure centers. Can cause headaches, flushing, and sweating in sensitive individuals.",
    safetyClass: "avoid"
  },
  "E150D": {
    explanation: "Caramel IV (Sulfite ammonia caramel). A chemically synthesized dark food coloring. Linked to inflammatory gut issues and cellular damage in animal studies.",
    safetyClass: "moderate"
  },
  "E338": {
    explanation: "Phosphoric Acid. A highly acidic preservative common in sodas. Actively leaches calcium from your bones and erodes dental enamel, increasing kidney stone risk.",
    safetyClass: "avoid"
  },
  "E211": {
    explanation: "Sodium Benzoate. A chemical preservative that can react with vitamin C to form benzene, a known carcinogen. May increase hyperactivity in children.",
    safetyClass: "avoid"
  },
  "E451": {
    explanation: "Sodium Tripolyphosphate. A humectant used to retain moisture in noodles. Also used in industrial detergents. Can be tough on kidneys in high volumes.",
    safetyClass: "moderate"
  },
  "E500": {
    explanation: "Sodium Carbonate (soda ash). A raising agent used to regulate acidity and create noodle textures. Generally safe in dietary quantities.",
    safetyClass: "safe"
  },
  "E501": {
    explanation: "Potassium Carbonate. An alkaline mineral salt used to keep noodles springy. Generally safe but indicates highly processed foods.",
    safetyClass: "safe"
  },
  "E627": {
    explanation: "Disodium Guanylate. A high-potency flavor enhancer often paired with MSG to hijack taste receptors, causing intense savory cravings.",
    safetyClass: "avoid"
  },
  "E631": {
    explanation: "Disodium Inosinate. A chemical flavor enhancer that works in synergy with MSG to multiply your appetite and make snacks addictive.",
    safetyClass: "avoid"
  },
  "E551": {
    explanation: "Silicon Dioxide. An anti-caking agent to prevent seasoning from clumping. It is chemically identical to quartz or purified sand.",
    safetyClass: "safe"
  },
  "E202": {
    explanation: "Potassium Sorbate. A widely used food preservative that inhibits mold and yeast growth. Generally safe at standard intake levels.",
    safetyClass: "safe"
  },
  "E320": {
    explanation: "Butylated Hydroxyanisole (BHA). A synthetic antioxidant preservative used to prevent fats from spoiling. Listed as a potential endocrine disruptor.",
    safetyClass: "moderate"
  },
  "E321": {
    explanation: "Butylated Hydroxytoluene (BHT). A chemical preservative closely related to BHA. May cause skin reactions and is a suspected endocrine disruptor.",
    safetyClass: "moderate"
  },
  "E407": {
    explanation: "Carrageenan. A thickener extracted from red seaweed. Can cause digestive tract inflammation, bloating, and food sensitivities.",
    safetyClass: "moderate"
  },
  "E450": {
    explanation: "Diphosphates. Emulsifiers and stabilizers. High intake can disturb the calcium-phosphorus ratio in the body, potentially weakening bones.",
    safetyClass: "moderate"
  },
  "E452": {
    explanation: "Polyphosphates. Used for water binding and texture preservation. Can impact calcium absorption and bone density in high amounts.",
    safetyClass: "moderate"
  },
  "E950": {
    explanation: "Acesulfame Potassium (Ace-K). A zero-calorie artificial sweetener. Can alter gut microbiome and is associated with metabolic changes.",
    safetyClass: "avoid"
  },
  "E951": {
    explanation: "Aspartame. A highly sweet chemical sugar substitute. Linked to headaches, digestive issues, and changes in gut flora.",
    safetyClass: "avoid"
  }
};

export default function ResultView({ product, profile, apiKey, onBack }) {
  const [activeVoice, setActiveVoice] = useState('mom');
  const [activeLang, setActiveLang] = useState('en');
  const [expandedIngredient, setExpandedIngredient] = useState(null);
  
  // Voice roasts cache
  const [roastsCache, setRoastsCache] = useState(() => {
    const initial = {};
    if (product.roasts) {
      // Prepopulate cache with all available preset roasts
      for (const voice in product.roasts) {
        for (const lang in product.roasts[voice]) {
          initial[`${voice}_${lang}`] = product.roasts[voice][lang];
        }
      }
    } else {
      initial[activeVoice + '_' + activeLang] = product.roast || "";
    }
    return initial;
  });
  const [isRoastLoading, setIsRoastLoading] = useState(false);
  const [roastError, setRoastError] = useState(null);

  // E-number details state
  const [selectedAdditive, setSelectedAdditive] = useState(null);
  const [additiveDetails, setAdditiveDetails] = useState(null);
  const [isAdditiveLoading, setIsAdditiveLoading] = useState(false);

  const cardElementRef = useRef(null);

  // Handle Voice/Lang Change
  useEffect(() => {
    const cacheKey = `${activeVoice}_${activeLang}`;
    if (roastsCache[cacheKey]) return;

    const fetchNewRoast = async () => {
      setIsRoastLoading(true);
      setRoastError(null);
      try {
        const text = await generateVoiceRoast(
          apiKey,
          product.name,
          product.ingredients_text,
          activeVoice,
          activeLang,
          profile
        );
        setRoastsCache(prev => ({
          ...prev,
          [cacheKey]: text
        }));
      } catch (err) {
        console.error(err);
        setRoastError("AI failed to generate roast. Key active?");
      } finally {
        setIsRoastLoading(false);
      }
    };

    fetchNewRoast();
  }, [activeVoice, activeLang]);

  // Profile Specific Warning Alerts
  const getProfileWarnings = () => {
    const warnings = [];
    const n = product.nutriments || {};
    
    if (profile.diabetic) {
      if (n.sugars > 10) {
        warnings.push(`🚨 DIABETIC WARNING: High Sugar content! Contains ${n.sugars}g sugar per 100g. Sugar rushes incoming!`);
      }
    }
    if (profile.hypertensive) {
      const sodiumMg = n.sodium * 1000 || n.salt * 400 || 0;
      if (sodiumMg > 400) {
        warnings.push(`🚨 HYPERTENSIVE WARNING: Contains ${Math.round(sodiumMg)}mg sodium per 100g. Dangerous for blood pressure levels!`);
      }
    }
    if (profile.fitness) {
      if (n.fat > 15) {
        warnings.push(`🏋️ GYM BRO WARNING: Contains ${n.fat}g fat per 100g. Bypasses calorie deficits!`);
      }
    }
    if (profile.pregnant) {
      if (product.ingredients_text?.toLowerCase().includes("caffeine")) {
        warnings.push("🤰 PREGNANCY WARNING: Caffeine detected. Limit intake during pregnancy!");
      }
    }
    return warnings;
  };

  const warnings = getProfileWarnings();

  // Standardize E-number additive tags list
  const getAdditivesList = () => {
    let list = [];
    if (product.additives_tags && Array.isArray(product.additives_tags)) {
      list = product.additives_tags.map(tag => tag.replace('en:', '').toUpperCase());
    }
    if (list.length === 0) {
      const text = product.ingredients_text || "";
      const matches = text.match(/E\d{3,4}[a-z]?/gi) || [];
      list = [...new Set(matches.map(m => m.toUpperCase()))];
    }
    return list;
  };

  const additives = getAdditivesList();

  const getAdditiveSafety = (code) => {
    const cleanCode = code.split(' ')[0].toUpperCase();
    const avoid = ["E102", "E110", "E120", "E122", "E124", "E127", "E129", "E211", "E220", "E250", "E251", "E621", "E950", "E951"];
    const moderate = ["E150D", "E202", "E320", "E321", "E407", "E450", "E451", "E452"];
    
    if (avoid.includes(cleanCode)) return "danger";
    if (moderate.includes(cleanCode)) return "concerning";
    return "safe";
  };

  const handleAdditiveClick = async (code) => {
    const cleanCode = code.trim().toUpperCase().replace('EN:', '');
    setSelectedAdditive(cleanCode);
    setIsAdditiveLoading(true);
    setAdditiveDetails(null);
    
    // Check local database first
    if (LOCAL_ADDITIVES[cleanCode]) {
      setAdditiveDetails(LOCAL_ADDITIVES[cleanCode]);
      setIsAdditiveLoading(false);
      return;
    }
    
    // Fallback to API if we have an API key, otherwise show a default explanation
    if (apiKey) {
      try {
        const explain = await explainAdditive(apiKey, cleanCode, activeVoice, activeLang);
        setAdditiveDetails(explain);
      } catch (err) {
        console.error(err);
        setAdditiveDetails({
          explanation: `This is food additive ${cleanCode}, commonly used in processed foods. Avoid consuming in excess.`,
          safetyClass: getAdditiveSafety(cleanCode)
        });
      } finally {
        setIsAdditiveLoading(false);
      }
    } else {
      // Mock explanation if no API key is available
      setAdditiveDetails({
        explanation: `Additive ${cleanCode} is a processed ingredient. (Add your Gemini API Key in Settings to get deep AI breakdowns of custom additives!)`,
        safetyClass: getAdditiveSafety(cleanCode)
      });
      setIsAdditiveLoading(false);
    }
  };

  // HTML2Canvas card exporter
  const handleShare = async (action = 'download') => {
    const cardElement = cardElementRef.current;
    if (!cardElement) return;

    const originalStyle = cardElement.style.display;
    cardElement.style.display = 'flex';

    try {
      const canvas = await html2canvas(cardElement, {
        useCORS: true,
        backgroundColor: '#0B0B0F',
        scale: 2
      });

      cardElement.style.display = originalStyle;

      if (action === 'download') {
        const link = document.createElement('a');
        link.download = `foodlens_roast_${product.name.replace(/\s+/g, '_').toLowerCase()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } else if (action === 'copy') {
        canvas.toBlob(async (blob) => {
          if (!blob) return;
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            alert("Roast Card copied to clipboard! Share it in WhatsApp or Instagram.");
          } catch (err) {
            console.error("Clipboard copy error:", err);
            alert("Clipboard copy blocked. Download the card instead!");
          }
        }, 'image/png');
      }
    } catch (err) {
      console.error("html2canvas generation failed:", err);
      cardElement.style.display = originalStyle;
    }
  };

  // Color mappings
  const getNutriScoreColor = (score) => {
    if (!score) return '#555';
    const s = score.toLowerCase();
    if (s === 'a') return '#00E676';      // Green
    if (s === 'b') return '#AEEA00';      // Light Green
    if (s === 'c') return '#FFD600';      // Yellow
    if (s === 'd') return '#FF6D00';      // Orange
    if (s === 'e') return '#D50000';      // Red
    return '#555';
  };

  const getNovaBadgeInfo = (group) => {
    const val = parseInt(group);
    if (val === 1) return { color: '#00E676', label: 'Unprocessed' };
    if (val === 2) return { color: '#FFD600', label: 'Processed' };
    if (val === 3) return { color: '#FF6D00', label: 'Ultra-processed ingredients' };
    if (val === 4) return { color: '#D50000', label: 'Ultra-processed food' };
    return { color: '#555', label: 'N/A' };
  };

  const formatAllergens = (allergensString) => {
    if (!allergensString) return "";
    return allergensString
      .split(',')
      .map(item => item.replace('en:', '').trim())
      .filter(item => item)
      .map(item => item.charAt(0).toUpperCase() + item.slice(1))
      .join(', ');
  };

  const voiceInfo = {
    doctor: { label: "👨‍⚕️ Dramatic Doctor", avatar: "🏥", color: "var(--color-danger)" },
    mom: { label: "👵 Indian Mom", avatar: "👵", color: "var(--color-meh)" },
    comedian: { label: "🎤 Stand-up", avatar: "🎤", color: "var(--color-safe)" },
    professor: { label: "🤓 Professor", avatar: "🤓", color: "var(--color-accent)" },
    news: { label: "📣 News Anchor", avatar: "📣", color: "var(--color-concerning)" }
  };

  const currentRoast = roastsCache[`${activeVoice}_${activeLang}`];
  const novaInfo = getNovaBadgeInfo(product.nova_group);
  const formattedAllergens = formatAllergens(product.allergens);

  return (
    <div className="result-screen">
      <button className="result-back-btn" onClick={onBack}>
        <ChevronLeft size={16} />
        <span>Scan another snack</span>
      </button>

      {/* Danger Banner */}
      <div className={`danger-banner ${product.dangerLevel || 'concerning'}`}>
        <div className="danger-icon-container">
          {product.dangerLevel === 'safe' ? <Award size={24} /> : 
           product.dangerLevel === 'meh' ? <Star size={24} /> : 
           product.dangerLevel === 'concerning' ? <Flame size={24} /> : <ShieldAlert size={24} />}
        </div>
        <div className="danger-text-info">
          <span className="danger-label-sub">FoodLens Rating</span>
          <span className="danger-title">{product.ratingLabel || 'Concerning'}</span>
        </div>
      </div>

      {/* Profile Warnings */}
      {warnings.length > 0 && (
        <div className="profile-warnings-container">
          <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#FF8888', letterSpacing: '0.5px' }}>
            Profile Warnings
          </span>
          {warnings.map((w, index) => (
            <div className="warning-flag" key={index}>
              <AlertTriangle size={14} />
              <span>{w}</span>
            </div>
          ))}
        </div>
      )}

      {/* Product Card */}
      <div style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.04)', display: 'flex', gap: '14px', alignItems: 'center' }}>
        <div style={{ width: '80px', height: '80px', background: '#000', borderRadius: '16px', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
          {product.image ? (
            <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          ) : (
            <span style={{ fontSize: '32px' }}>📦</span>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'white' }}>{product.name}</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Brand: {product.brand}</p>
        </div>
      </div>

      {/* Nutrition Badges Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '10px', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '9px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Nutri-Score</span>
          {product.nutrition_grades ? (
            <span style={{
              background: getNutriScoreColor(product.nutrition_grades),
              color: 'var(--text-dark)',
              fontSize: '18px',
              fontWeight: 900,
              padding: '2px 14px',
              borderRadius: '8px',
              textTransform: 'uppercase'
            }}>
              {product.nutrition_grades}
            </span>
          ) : (
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>N/A</span>
          )}
        </div>

        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '10px', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '9px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>NOVA Group</span>
          {product.nova_group ? (
            <span style={{
              background: novaInfo.color,
              color: 'var(--text-dark)',
              fontSize: '14px',
              fontWeight: 900,
              padding: '4px 8px',
              borderRadius: '8px',
              textAlign: 'center',
              lineHeight: '1.2'
            }}>
              {product.nova_group}
            </span>
          ) : (
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>N/A</span>
          )}
        </div>

        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '10px', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '9px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Eco-Score</span>
          {product.ecoscore_grade ? (
            <span style={{
              background: getNutriScoreColor(product.ecoscore_grade),
              color: 'var(--text-dark)',
              fontSize: '18px',
              fontWeight: 900,
              padding: '2px 14px',
              borderRadius: '8px',
              textTransform: 'uppercase'
            }}>
              {product.ecoscore_grade}
            </span>
          ) : (
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>N/A</span>
          )}
        </div>
      </div>

      {product.nova_group && (
        <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: '12px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Processing details:</span>
          <span style={{ color: novaInfo.color, fontWeight: 800 }}>"{novaInfo.label}"</span>
        </div>
      )}

      {/* Allergens Box */}
      {formattedAllergens && (
        <div style={{ background: 'rgba(255,107,0,0.05)', border: '1px solid rgba(255,107,0,0.15)', padding: '10px 14px', borderRadius: '12px', fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ color: 'var(--color-concerning)', fontWeight: 800, textTransform: 'uppercase', fontSize: '9px' }}>⚠️ Allergen Warnings:</span>
          <span style={{ color: 'white' }}>{formattedAllergens}</span>
        </div>
      )}

      {/* Dynamic Roast bubble block */}
      <div className="roast-card-wrapper">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
            Select Voice Vibe (dynamic)
          </span>
          <div className="voice-selector-bar">
            {Object.keys(voiceInfo).map((vKey) => (
              <button 
                key={vKey} 
                className={`voice-btn ${activeVoice === vKey ? 'active' : ''}`}
                onClick={() => setActiveVoice(vKey)}
              >
                <span>{voiceInfo[vKey].avatar}</span>
                <span>{vKey.charAt(0).toUpperCase() + vKey.slice(1)}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '-4px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Speak translation:</span>
          <div className="lang-toggle-bar">
            <button className={`lang-btn ${activeLang === 'en' ? 'active' : ''}`} onClick={() => setActiveLang('en')}>English</button>
            <button className={`lang-btn ${activeLang === 'hi' ? 'active' : ''}`} onClick={() => setActiveLang('hi')}>Hinglish</button>
          </div>
        </div>

        {/* Speech Bubble */}
        <div className="roast-bubble" style={{ minHeight: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {isRoastLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '16px' }}>
              <div className="loading-spinner" style={{ width: '28px', height: '28px' }}></div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>AI is rewriting the roast...</span>
            </div>
          ) : roastError ? (
            <div style={{ color: 'var(--color-danger)', fontSize: '12px', textAlign: 'center', padding: '12px' }}>
              {roastError}
            </div>
          ) : (
            <>
              <div className="roast-avatar-info">
                <div className="roast-avatar" style={{ background: voiceInfo[activeVoice].color }}>
                  {voiceInfo[activeVoice].avatar}
                </div>
                <div className="roast-avatar-name">
                  {voiceInfo[activeVoice].label}
                </div>
              </div>
              <p className={`roast-text ${activeVoice === 'doctor' ? 'doctor-font' : ''}`}>
                "{currentRoast}"
              </p>
            </>
          )}
        </div>
      </div>

      {/* Additive Chips */}
      {additives.length > 0 && (
        <div>
          <h3 className="ingredients-section-title">Chemical Additives Exposed</h3>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>Click any E-number chip for chemical secrets:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {additives.map((add, index) => {
              const safety = getAdditiveSafety(add);
              return (
                <button
                  key={index}
                  onClick={() => handleAdditiveClick(add)}
                  style={{
                    background: safety === 'danger' ? 'rgba(255, 51, 51, 0.15)' : safety === 'concerning' ? 'rgba(255, 107, 0, 0.15)' : 'rgba(0, 255, 102, 0.15)',
                    border: `1.5px solid var(--color-${safety})`,
                    color: `var(--color-${safety})`,
                    padding: '6px 12px',
                    borderRadius: '16px',
                    fontSize: '11px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Zap size={10} />
                  {add}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Additive Explanation Modal */}
      {selectedAdditive && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(4px)',
          zIndex: 50,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '16px'
        }}>
          <div style={{
            background: 'var(--bg-card)',
            border: '2px solid var(--color-accent)',
            borderRadius: '24px',
            width: '100%',
            padding: '20px',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <button 
              onClick={() => setSelectedAdditive(null)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={18} color="var(--color-safe)" />
              <h4 style={{ fontSize: '15px', fontWeight: 900 }}>Additive Detail: {selectedAdditive}</h4>
            </div>

            {isAdditiveLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '24px' }}>
                <div className="loading-spinner"></div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Asking Gemini to decode...</span>
              </div>
            ) : additiveDetails ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <p style={{ fontSize: '13px', lineHeight: '1.4', color: 'white' }}>"{additiveDetails.explanation}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 800 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Safety:</span>
                  <span style={{ 
                    color: additiveDetails.safetyClass === 'avoid' ? 'var(--color-danger)' : additiveDetails.safetyClass === 'moderate' ? 'var(--color-concerning)' : 'var(--color-safe)',
                    background: additiveDetails.safetyClass === 'avoid' ? 'rgba(255,51,51,0.1)' : additiveDetails.safetyClass === 'moderate' ? 'rgba(255,107,0,0.1)' : 'rgba(0,255,102,0.1)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    textTransform: 'uppercase'
                  }}>
                    {additiveDetails.safetyClass}
                  </span>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Ingredient Tap-to-Explain */}
      {product.suspiciousIngredients && product.suspiciousIngredients.length > 0 && (
        <div>
          <h3 className="ingredients-section-title">Ingredients Secrets</h3>
          <div className="ingredients-list">
            {product.suspiciousIngredients.map((ing, index) => {
              const isExpanded = expandedIngredient === index;
              return (
                <div 
                  className="ingredient-row" 
                  key={index}
                  onClick={() => setExpandedIngredient(isExpanded ? null : index)}
                >
                  <div className="ingredient-row-header">
                    <span className="ingredient-name">{ing.name}</span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Info size={11} /> Explain
                    </span>
                  </div>
                  {isExpanded && (
                    <div className="ingredient-explain-content">
                      {ing.info}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Real Nutrition Values Table */}
      {product.nutriments && (
        <div>
          <h3 className="ingredients-section-title">Nutrition Facts (Per 100g)</h3>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid rgba(255,255,255,0.04)',
            borderRadius: '16px',
            overflow: 'hidden',
            fontSize: '12px'
          }}>
            {[
              { label: '🔥 Energy (Calories)', val: `${Math.round(product.nutriments.calories)} kcal` },
              { label: '🍔 Total Fat', val: `${product.nutriments.fat} g` },
              { label: '🍕 Saturated Fat', val: `${product.nutriments.saturated_fat} g` },
              { label: '🍬 Sugars', val: `${product.nutriments.sugars} g` },
              { label: '🧂 Salt', val: `${product.nutriments.salt} g` },
              { label: '💪 Protein', val: `${product.nutriments.protein} g` },
              { label: '🌾 Fiber', val: `${product.nutriments.fiber} g` },
            ].map((row, idx) => (
              <div 
                key={idx} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '10px 14px',
                  background: idx % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'none',
                  borderBottom: idx < 6 ? '1px solid rgba(255,255,255,0.04)' : 'none'
                }}
              >
                <span style={{ color: '#B3B3C2' }}>{row.label}</span>
                <span style={{ fontWeight: 800, color: 'white' }}>{row.val}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Damage Report */}
      {product.damageReport && (product.damageReport.depleted.length > 0 || product.damageReport.diseases.length > 0) && (
        <div>
          <h3 className="ingredients-section-title">Health Damage Report</h3>
          <div className="damage-report-card">
            {product.damageReport.depleted.length > 0 && (
              <div>
                <span className="damage-metric-title">Depletes these nutrients:</span>
                <div className="damage-tags-list" style={{ marginTop: '6px' }}>
                  {product.damageReport.depleted.map((dep, idx) => (
                    <span className="depleted-tag" key={idx}>{dep}</span>
                  ))}
                </div>
              </div>
            )}
            {product.damageReport.diseases.length > 0 && (
              <div>
                <span className="damage-metric-title">Associated chronic risks:</span>
                <div className="damage-tags-list" style={{ marginTop: '6px' }}>
                  {product.damageReport.diseases.map((dis, idx) => (
                    <span className="damage-tag" key={idx}>{dis}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Healthy Indian Swap */}
      {product.healthySwap && (
        <div>
          <h3 className="ingredients-section-title">Healthier Indian Swap</h3>
          <div className="swap-card">
            <span className="swap-badge">Better Option</span>
            <h4 className="swap-item-name">
              <Sparkles size={16} />
              <span>{product.healthySwap.name}</span>
            </h4>
            <p className="swap-item-desc">{product.healthySwap.description}</p>
          </div>
        </div>
      )}

      {/* Shareable Roast Card Section */}
      <div className="roast-card-generator">
        <h3 className="ingredients-section-title" style={{ alignSelf: 'flex-start', marginBottom: '4px' }}>
          Shareable Roast Card
        </h3>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', alignSelf: 'flex-start' }}>
          Generate custom styled story card to share directly:
        </p>

        {/* Dynamic element captured by html2canvas */}
        <div 
          ref={cardElementRef}
          id="roast-share-card-element"
          style={{
            display: 'none',
            flexDirection: 'column',
            width: '400px',
            padding: '30px',
            background: '#0B0B0F',
            borderRadius: '24px',
            border: `2px solid ${product.dangerLevel === 'danger' ? 'var(--color-danger)' : 'var(--color-accent)'}`,
            backgroundImage: 'radial-gradient(at 0% 0%, rgba(158, 0, 255, 0.1) 0px, transparent 50%), linear-gradient(rgba(255,255,255,0.01) 1px, transparent 1px)',
            backgroundSize: '100% 100%, 20px 20px',
            boxSizing: 'border-box',
            fontFamily: '"Plus Jakarta Sans", sans-serif'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <span style={{ fontSize: '16px', fontWeight: 900, background: 'linear-gradient(90deg, #9E00FF, #00FF66)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>🔎 FOODLENS</span>
            <span style={{
              background: getNutriScoreColor(product.nutrition_grades),
              color: 'var(--text-dark)',
              fontSize: '11px',
              fontWeight: 900,
              padding: '2px 10px',
              borderRadius: '6px',
              textTransform: 'uppercase'
            }}>
              Nutri: {product.nutrition_grades || 'C'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ width: '50px', height: '50px', background: '#000', borderRadius: '10px', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {product.image ? (
                <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              ) : (
                <span style={{ fontSize: '20px' }}>📦</span>
              )}
            </div>
            <div>
              <h4 style={{ color: 'white', fontSize: '15px', fontWeight: 800, margin: 0 }}>{product.name}</h4>
              <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{product.brand}</span>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '12px', borderLeft: `4px solid ${getNutriScoreColor(product.nutrition_grades)}`, marginBottom: '20px' }}>
            <span style={{ display: 'block', fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Toxicity Level</span>
            <span style={{ fontSize: '16px', fontWeight: 800, color: 'white' }}>{product.ratingLabel || 'Concerning'}</span>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '20px', position: 'relative' }}>
            <span style={{ fontSize: '12px', color: 'var(--color-safe)', fontWeight: 800, display: 'block', marginBottom: '8px' }}>
              {voiceInfo[activeVoice].label.toUpperCase()} Roast
            </span>
            <p style={{ fontSize: '12px', color: '#E5E5E7', margin: 0, fontStyle: activeVoice === 'doctor' ? 'italic' : 'normal', lineHeight: '1.4' }}>
              "{currentRoast}"
            </p>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Scan it. Learn it. Roast it.</span>
            <span style={{ fontSize: '10px', color: 'var(--color-accent)', fontWeight: 700 }}>#FoodLensZehar</span>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', width: '100%', gap: '10px' }}>
          <button 
            className="btn-download-card" 
            onClick={() => handleShare('download')}
            style={{ flex: 1 }}
          >
            <Download size={14} />
            <span>Download PNG</span>
          </button>
          <button 
            className="btn-download-card" 
            onClick={() => handleShare('copy')}
            style={{ flex: 1, background: 'var(--color-accent)', color: 'white' }}
          >
            <Share2 size={14} />
            <span>Copy Clipboard</span>
          </button>
        </div>
      </div>
    </div>
  );
}
