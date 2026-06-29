import React, { useState, useEffect, useRef } from 'react';
import { Camera, Search, Barcode, HelpCircle, AlertCircle, Sparkles, Send } from 'lucide-react';
import Quagga from '@ericblade/quagga2';
import { searchProducts } from '../utils/openFoodFacts';
import { mockProducts } from '../utils/mockData';

export default function Scanner({ onScanStart, onScanComplete, onScanError }) {
  const [activeMode, setActiveMode] = useState('scan'); // 'scan' | 'search' | 'manual'
  const [isQuaggaActive, setIsQuaggaActive] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [scannerError, setScannerError] = useState(null);
  const [searchError, setSearchError] = useState(null);
  
  const viewportRef = useRef(null);

  useEffect(() => {
    return () => {
      if (isQuaggaActive) {
        stopQuagga();
      }
    };
  }, [isQuaggaActive]);

  const startQuagga = () => {
    setScannerError(null);
    setIsQuaggaActive(true);
    
    setTimeout(() => {
      try {
        Quagga.init({
          inputStream: {
            name: "Live",
            type: "LiveStream",
            target: viewportRef.current,
            constraints: {
              width: { min: 640 },
              height: { min: 480 },
              facingMode: "environment"
            },
          },
          locator: {
            patchSize: "medium",
            halfSample: true
          },
          numOfWorkers: 2,
          decoder: {
            readers: [
              "ean_reader",
              "ean_8_reader",
              "upc_reader",
              "upc_e_reader",
              "code_128_reader"
            ]
          },
          locate: true
        }, (err) => {
          if (err) {
            console.error("Quagga initialization failed:", err);
            setScannerError("Camera scanning is not supported on this browser/device. Try manual barcode input!");
            setIsQuaggaActive(false);
            return;
          }
          Quagga.start();
        });

        Quagga.onDetected(handleDetected);
      } catch (e) {
        console.error("Camera startup error:", e);
        setScannerError("Camera permissions denied or unavailable. Fallback to input fields.");
        setIsQuaggaActive(false);
      }
    }, 100);
  };

  const stopQuagga = () => {
    try {
      Quagga.offDetected(handleDetected);
      Quagga.stop();
    } catch (e) {
      console.error("Quagga stop error:", e);
    }
    setIsQuaggaActive(false);
  };

  const handleDetected = (data) => {
    if (!data?.codeResult?.code) return;
    const barcode = data.codeResult.code;
    stopQuagga();
    onBarcodeSubmit(barcode);
  };

  const onBarcodeSubmit = (barcode) => {
    if (!barcode) return;
    onScanStart();
    onScanComplete({
      type: 'barcode',
      value: barcode
    });
  };

  const handleSearchSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchError(null);
    setSearchResults([]);

    try {
      const query = searchQuery.toLowerCase().trim();
      const localMatches = [];
      
      // Look up in mockProducts locally
      for (const key in mockProducts) {
        const prod = mockProducts[key];
        if (
          prod.name.toLowerCase().includes(query) ||
          prod.brand.toLowerCase().includes(query) ||
          (prod.description && prod.description.toLowerCase().includes(query))
        ) {
          // Format like searchProducts output
          localMatches.push({
            barcode: key === 'maggi' ? '8901058851829' :
                     key === 'parleg' ? '8901719110016' :
                     key === 'lays' ? '8901491500053' :
                     key === 'haldirams' ? '8901063000018' :
                     key === 'coke' ? '8901063100015' :
                     key === 'oreo' ? '7622210825072' : '1111111111111',
            name: prod.name,
            brand: prod.brand,
            image: prod.image || "",
            ingredients_text: prod.ingredients ? prod.ingredients.map(i => i.name).join(", ") : "",
            nutrition_grades: prod.nutrition_grades || "C",
            nova_group: prod.nova_group || 3,
            ecoscore_grade: prod.ecoscore_grade || "C",
            allergens: prod.allergens || "",
            additives_tags: prod.additives_tags || [],
            nutriments: prod.nutriments || {
              calories: 0, fat: 0, saturated_fat: 0, sugars: 0, salt: 0, sodium: 0, protein: 0, fiber: 0
            },
            isMock: true,
            mockKey: key
          });
        }
      }

      let apiResults = [];
      try {
        apiResults = await searchProducts(searchQuery);
      } catch (err) {
        console.warn("API Search failed, using local search fallback:", err);
      }

      // Combine local and API results, avoiding duplicates by barcode
      const combined = [...localMatches];
      for (const apiProd of apiResults) {
        if (!combined.some(item => item.barcode === apiProd.barcode || item.name.toLowerCase() === apiProd.name.toLowerCase())) {
          combined.push(apiProd);
        }
      }

      setSearchResults(combined);
      if (combined.length === 0) {
        setSearchError("Product not found in database. Paste ingredients below!");
      }
    } catch (err) {
      console.error("Search error:", err);
      setSearchError("Could not search products.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleManualIngredients = (ingredientsText) => {
    if (!ingredientsText.trim()) return;
    onScanStart();
    onScanComplete({
      type: 'manual',
      value: {
        name: "Manual Product Input",
        brand: "Custom Entry",
        ingredients_text: ingredientsText,
        nutrition_grades: "D",
        nova_group: 3,
        ecoscore_grade: "D",
        additives_tags: [],
        nutriments: {
          calories: 0,
          fat: 0,
          saturated_fat: 0,
          sugars: 0,
          salt: 0,
          sodium: 0,
          protein: 0,
          fiber: 0
        }
      }
    });
  };

  // Kaggle Demo Presets
  const demoProducts = [
    { name: "Maggi Masala Noodles", barcode: "8901058851829", emoji: "🍜" },
    { name: "Parle-G Biscuit", barcode: "8901719110016", emoji: "🍪" },
    { name: "Lay's Magic Masala", barcode: "8901491500053", emoji: "🍿" },
    { name: "Haldiram's Bhujia Sev", barcode: "8901063000018", emoji: "🥯" },
    { name: "Coca-Cola Soft Drink", barcode: "8901063100015", emoji: "🥤" },
    { name: "Oreo Sandwich Biscuits", barcode: "7622210825072", emoji: "🍪" },
    { name: "Fresh Coconut Water", barcode: "1111111111111", emoji: "🥥" }
  ];

  return (
    <div className="scanner-screen">
      <div>
        <h2 className="scanner-title">FoodLens Zehar</h2>
        <p className="scanner-tagline">"Scan it. Learn it. Roast it."</p>
      </div>

      {/* Toggles */}
      <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
        <button 
          style={{ flex: 1, background: activeMode === 'scan' ? 'var(--color-accent)' : 'none', border: 'none', color: 'white', padding: '8px', borderRadius: '8px', fontSize: '11px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          onClick={() => { setActiveMode('scan'); setSearchResults([]); setSearchQuery(""); }}
        >
          <Barcode size={14} /> Barcode
        </button>
        <button 
          style={{ flex: 1, background: activeMode === 'search' ? 'var(--color-accent)' : 'none', border: 'none', color: 'white', padding: '8px', borderRadius: '8px', fontSize: '11px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          onClick={() => { setActiveMode('search'); stopQuagga(); }}
        >
          <Search size={14} /> Search Name
        </button>
        <button 
          style={{ flex: 1, background: activeMode === 'manual' ? 'var(--color-accent)' : 'none', border: 'none', color: 'white', padding: '8px', borderRadius: '8px', fontSize: '11px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          onClick={() => { setActiveMode('manual'); stopQuagga(); }}
        >
          <Send size={14} /> Ingredients
        </button>
      </div>

      {/* SCAN VIEW */}
      {activeMode === 'scan' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {isQuaggaActive ? (
            <div 
              ref={viewportRef} 
              id="barcode-viewport"
              style={{
                position: 'relative',
                width: '100%',
                height: '240px',
                background: '#000',
                borderRadius: '24px',
                overflow: 'hidden',
                border: '2px solid var(--color-accent)'
              }}
            >
              <div className="scanner-laser"></div>
              <button 
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(255,51,51,0.85)',
                  border: 'none',
                  color: 'white',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  zIndex: 20
                }}
                onClick={stopQuagga}
              >
                STOP CAMERA
              </button>
            </div>
          ) : (
            <div 
              className="camera-container"
              onClick={startQuagga}
            >
              <Camera size={44} strokeWidth={1.5} />
              <div>
                <p style={{ fontWeight: 700, color: 'white', marginBottom: '4px' }}>Click to Start Barcode Scanner</p>
                <p style={{ fontSize: '11px' }}>Point your camera at a snack's barcode</p>
              </div>
            </div>
          )}

          {scannerError && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-danger)', fontSize: '11px', background: 'rgba(255,51,51,0.08)', padding: '8px', borderRadius: '8px' }}>
              <AlertCircle size={14} />
              <span>{scannerError}</span>
            </div>
          )}

          {/* Barcode input fallback */}
          <div style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
              Or Enter Barcode Manually
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="text" 
                className="settings-input" 
                placeholder="E.g., 8901058851829" 
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                style={{ flex: 1, padding: '8px 12px' }}
              />
              <button 
                onClick={() => onBarcodeSubmit(barcodeInput)}
                disabled={!barcodeInput.trim()}
                style={{ 
                  background: 'var(--color-safe)', 
                  color: 'var(--text-dark)', 
                  border: 'none', 
                  borderRadius: '12px', 
                  padding: '8px 16px', 
                  fontSize: '11px', 
                  fontWeight: 800,
                  cursor: 'pointer',
                  opacity: barcodeInput.trim() ? 1 : 0.5
                }}
              >
                GO
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SEARCH VIEW */}
      {activeMode === 'search' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="text"
              className="settings-input"
              placeholder="Search product (e.g. Marie Gold, Kurkure)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1, padding: '10px 12px' }}
            />
            <button 
              type="submit"
              style={{
                background: 'var(--color-safe)',
                border: 'none',
                borderRadius: '12px',
                padding: '10px',
                color: 'var(--text-dark)',
                cursor: 'pointer'
              }}
            >
              <Search size={16} />
            </button>
          </form>

          {isSearching && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '24px' }}>
              <div className="loading-spinner"></div>
            </div>
          )}

          {searchError && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-danger)', fontSize: '11px', background: 'rgba(255,51,51,0.08)', padding: '10px', borderRadius: '8px' }}>
              <AlertCircle size={14} />
              <span>{searchError}</span>
            </div>
          )}

          {/* Cards */}
          {searchResults.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '250px', overflowY: 'auto', paddingRight: '4px' }}>
              {searchResults.map((p, idx) => (
                <div 
                  key={idx} 
                  onClick={() => onScanComplete({ type: 'direct', value: p })}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid rgba(255,255,255,0.04)',
                    padding: '8px 12px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    transition: 'var(--transition-smooth)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-accent)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)'}
                >
                  <div style={{ width: '40px', height: '40px', background: '#000', borderRadius: '8px', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                    {p.image ? (
                      <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    ) : (
                      <span style={{ fontSize: '16px' }}>📦</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: '12px', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'white' }}>{p.name}</span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{p.brand}</span>
                  </div>
                  {p.nutrition_grades && (
                    <span style={{
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: 900,
                      background: p.nutrition_grades.toLowerCase() === 'a' ? '#00b0ff' : p.nutrition_grades.toLowerCase() === 'b' ? 'var(--color-safe)' : p.nutrition_grades.toLowerCase() === 'c' ? 'var(--color-meh)' : 'var(--color-danger)',
                      color: 'var(--text-dark)',
                      textTransform: 'uppercase'
                    }}>
                      {p.nutrition_grades}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MANUAL INGREDIENTS FALLBACK */}
      {activeMode === 'manual' && (
        <div className="text-input-section" style={{ border: 'none', background: 'none', padding: 0 }}>
          <textarea 
            className="textarea-ingredients"
            placeholder="Paste ingredients list (e.g. Palm oil, sugar, sodium benzoate, tartrazine...)"
            style={{ height: '120px' }}
            id="manual-ingredients-text"
          />
          <button 
            className="btn-analyze"
            onClick={() => {
              const text = document.getElementById("manual-ingredients-text")?.value;
              handleManualIngredients(text);
            }}
          >
            Expose Ingredients
          </button>
        </div>
      )}

      {/* Try these real products (Kaggle presets) */}
      <div className="presets-section">
        <label className="section-label" style={{ marginBottom: '4px' }}>
          <Sparkles size={14} style={{ color: 'var(--color-meh)' }} />
          <span>Try these products (Direct API Lookup)</span>
        </label>
        <div className="presets-grid" style={{ gridTemplateColumns: 'repeat(1, 1fr)' }}>
          {demoProducts.map((demo, idx) => (
            <div 
              className="preset-card" 
              key={idx}
              onClick={() => onBarcodeSubmit(demo.barcode)}
              style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '20px' }}>{demo.emoji}</span>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span className="preset-name">{demo.name}</span>
                  <span className="preset-brand" style={{ fontSize: '9px' }}>Barcode: {demo.barcode}</span>
                </div>
              </div>
              <span className="preset-badge" style={{ position: 'static', background: 'rgba(0,255,102,0.1)', color: 'var(--color-safe)' }}>
                Direct Scan
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
