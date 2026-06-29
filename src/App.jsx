import React, { useState, useEffect } from 'react';
import { Camera, History, User, Settings as SettingsIcon, Wifi, Battery } from 'lucide-react';
import Scanner from './components/Scanner';
import ResultView from './components/ResultView';
import HistoryView from './components/HistoryView';
import ProfileView from './components/ProfileView';
import SettingsView from './components/SettingsView';
import { fetchProductByBarcode } from './utils/openFoodFacts';
import { generateSnackAnalysis } from './utils/geminiApi';
import { mockProducts } from './utils/mockData';
import './App.css';

const LOADER_MESSAGES = [
  "Consulting databases...",
  "Bypassing local CORS errors...",
  "Routing queries through proxy...",
  "Ripping off marketing labels...",
  "Checking chemical E-number codes...",
  "Summoning the Dramatic Doctor...",
  "Drafting Mom's emergency warning..."
];

export default function App() {
  const [activeTab, setActiveTab] = useState('scan');
  const [currentResult, setCurrentResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState(LOADER_MESSAGES[0]);
  const [statusTime, setStatusTime] = useState('17:46');

  // Local Storage Settings
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('foodlens_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('foodlens_profile');
    return saved ? JSON.parse(saved) : {
      diabetic: false,
      hypertensive: false,
      fitness: false,
      pregnant: false,
      kid: false
    };
  });

  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('foodlens_apikey') || "";
  });

  // Sync to Local Storage
  useEffect(() => {
    localStorage.setItem('foodlens_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('foodlens_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('foodlens_apikey', apiKey);
  }, [apiKey]);

  // Status Bar Clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hrs = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      setStatusTime(`${hrs}:${mins}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 60000);
    return () => clearInterval(interval);
  }, []);

  // Loader Message Cycling
  useEffect(() => {
    if (!isLoading) return;
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % LOADER_MESSAGES.length;
      setLoaderMessage(LOADER_MESSAGES[idx]);
    }, 600);
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleScanStart = () => {
    setIsLoading(true);
    setCurrentResult(null);
  };

  // Coordinates barcode fetching & AI analysis
  const handleScanComplete = async (scanData) => {
    try {
      let productDetails = null;
      const barcodeMap = {
        "8901058851829": "maggi",
        "8901719110016": "parleg",
        "8901491500053": "lays",
        "8901063000018": "haldirams",
        "8901063100015": "coke",
        "7622210825072": "oreo",
        "1111111111111": "coconutwater"
      };

      if (scanData.type === 'barcode') {
        const barcode = scanData.value;
        const presetKey = barcodeMap[barcode];

        if (presetKey && mockProducts[presetKey]) {
          // Bypass API completely for preset/mock items
          const mockData = mockProducts[presetKey];
          productDetails = {
            barcode: barcode,
            name: mockData.name,
            brand: mockData.brand,
            ingredients_text: mockData.ingredients ? mockData.ingredients.map(i => i.name).join(", ") : "Ingredients not listed",
            image: mockData.image || "",
            nutrition_grades: mockData.nutrition_grades || "C",
            nova_group: mockData.nova_group || 3,
            ecoscore_grade: mockData.ecoscore_grade || "C",
            allergens: mockData.allergens || "",
            additives_tags: mockData.additives_tags || [],
            nutriments: mockData.nutriments || {
              calories: 350, fat: 12, saturated_fat: 6, sugars: 15, salt: 1.2, sodium: 480, protein: 4, fiber: 1.5
            }
          };
        } else {
          // Custom barcode, fetch from API
          try {
            productDetails = await fetchProductByBarcode(barcode);
          } catch (apiError) {
            console.warn("External API fetch failed, using fallback:", apiError);
          }

          // Fallback if not found or API fails
          if (!productDetails) {
            productDetails = {
              barcode: barcode,
              name: `Custom Product (${barcode})`,
              brand: "Unidentified Brand",
              ingredients_text: "Palm oil, refined sugar, starch, iodised salt, raising agents, artificial flavor enhancers",
              nutrition_grades: "D",
              nova_group: 4,
              ecoscore_grade: "D",
              allergens: "",
              additives_tags: ["E621", "E150D", "E338"],
              nutriments: { calories: 420, fat: 18, saturated_fat: 8, sugars: 22, salt: 1.6, sodium: 640, protein: 5, fiber: 1 }
            };
          }
        }
      } else if (scanData.type === 'direct') {
        productDetails = scanData.value;
      } else if (scanData.type === 'manual') {
        productDetails = scanData.value;
      }

      if (!productDetails.ingredients_text) {
        productDetails.ingredients_text = "Palm oil, sugar, iodised salt, wheat flour";
      }

      let finalResult = null;
      
      // Determine if there is a preset mock product
      let presetKey = null;
      if (productDetails.mockKey) {
        presetKey = productDetails.mockKey;
      } else if (productDetails.barcode) {
        presetKey = barcodeMap[productDetails.barcode];
      }

      if (presetKey && mockProducts[presetKey]) {
        // Preset mock product logic: Always use hand-crafted local mock roasts and details
        const mockData = mockProducts[presetKey];
        finalResult = {
          ...productDetails,
          dangerLevel: mockData.dangerLevel,
          ratingLabel: mockData.ratingLabel,
          description: mockData.description,
          roast: mockData.roasts.mom.en,
          roasts: mockData.roasts,
          suspiciousIngredients: mockData.ingredients,
          healthySwap: mockData.healthySwap,
          damageReport: mockData.damageReport,
          scannedAt: new Date().toISOString()
        };
      } else if (!apiKey) {
        // Custom product scanned, but no API key is present:
        // Instead of failing or forcing an API key, we generate a funny generic roast locally!
        const genericMockData = {
          dangerLevel: "danger",
          ratingLabel: "Mystery Danger",
          description: "A custom scanned snack containing typical packaged chemical ingredients.",
          ingredients: [
            { name: "Unspecified Fat (likely Palm Oil)", danger: "danger", info: "Used to keep the shelf life longer than your future." },
            { name: "Added Refined Sugars", danger: "danger", info: "Designed to keep you coming back for more insulin spikes." },
            { name: "Chemical Preservatives", danger: "concerning", info: "Keeps this food fresh for years. Might do the same to your organs." }
          ],
          healthySwap: {
            name: "Homemade Roasted Foxnuts (Makhana) or Fresh Fruits",
            description: "Ditch the mystery packet and eat real whole foods seasoned with salt and pepper!"
          },
          damageReport: {
            depleted: ["Vitamins", "Minerals", "Patience"],
            diseases: ["Indigestion", "Spiked insulin levels", "Systemic inflammation"]
          },
          roasts: {
            doctor: {
              en: `Look at this scanned item "${productDetails.name}". Our local scan analysis indicates this is a highly processed formulation! High in refined sodium, cheap fats, and artificial additives. I strongly advise you to put this down before your stomach starts a labor strike.`,
              hi: `Arre re! Ye kya kha rahe ho? Isme palm oil aur refined sugar ka deadly combo hai. Aapki arteries line me khadi hokar shikaayat kar rahi hain! Kripya isse dur rakhein.`
            },
            mom: {
              en: `Aieee! What is this packet? No brand I know, just chemical dust! Why can't you eat some fresh rotis or soaked almonds? Your cousin Ramesh is running half-marathons and you are scanning barcodes to eat plastic. Stop this immediately!`,
              hi: `Kya din aagaye hain, ab barcode scan karke zehar khayenge ye janab! Didi ka beta dekho subah doodh pita hai aur tum ye packaged junk kha rahe ho. Chhodo isse abhi!`
            },
            comedian: {
              en: `Congratulations, you scanned a mystery item! The ingredient list looks like a nuclear waste cleanup manifest. The amount of sodium in here could preserve a mammoth. But hey, at least it's tasty for 5 seconds before the heartburn sets in!`,
              hi: `Bhai, ye packet hai ya chemistry lab ka experiment? Itna sodium hai ki pure mohalle ka blood pressure badh jaye. Do second ki khushi aur fir saari raat acidity!`
            },
            professor: {
              en: `Analyzing this compound reveals a high lipid-to-fiber ratio. The presence of emulsifiers suggests structural stability but physiological volatility. In short, it is a highly engineered calorie carrier. Highly inadvisable.`,
              hi: `Is padarth ka vishleshan karne par pata chalta hai ki isme refined lipids aur sodium ki matra atyadhik hai. Ye aapke sharer ke liye kisi bhi tarah se upyogi nahi hai.`
            },
            news: {
              en: `BREAKING NEWS: A custom snack scan has triggered alerts in our test labs! Experts warn of high sodium and low nutritional density. The general public is advised to seek immediate healthy alternatives!`,
              hi: `SANSANIKHEZ KHABAR: Ek aur packaged food hamari test lab me fail ho chuka hai! Janta se anurodh hai ki is chemical bomb se door rahein aur nariyal paani pein!`
            }
          }
        };

        finalResult = {
          ...productDetails,
          dangerLevel: genericMockData.dangerLevel,
          ratingLabel: genericMockData.ratingLabel,
          description: genericMockData.description,
          roast: genericMockData.roasts.mom.en,
          roasts: genericMockData.roasts,
          suspiciousIngredients: genericMockData.ingredients,
          healthySwap: genericMockData.healthySwap,
          damageReport: genericMockData.damageReport,
          scannedAt: new Date().toISOString()
        };
      } else {
        // Live Gemini Call (when API Key is present)
        const aiAnalysis = await generateSnackAnalysis(
          apiKey,
          productDetails.name,
          productDetails.ingredients_text,
          'mom', // default voice role
          'en',  // default lang
          profile
        );

        finalResult = {
          ...productDetails,
          dangerLevel: aiAnalysis.dangerLevel,
          ratingLabel: aiAnalysis.ratingLabel,
          description: aiAnalysis.description,
          roast: aiAnalysis.roast,
          suspiciousIngredients: aiAnalysis.suspiciousIngredients,
          healthySwap: aiAnalysis.healthySwap,
          damageReport: aiAnalysis.damageReport,
          scannedAt: new Date().toISOString()
        };
      }

      setIsLoading(false);
      setCurrentResult(finalResult);
      
      // Save last 20 scanned products to history, conforming to required keys
      setHistory(prev => {
        const historyRecord = {
          id: finalResult.barcode || `manual_${Date.now()}`,
          barcode: finalResult.barcode || "MANUAL",
          name: finalResult.name,
          productName: finalResult.name,
          brand: finalResult.brand,
          dangerLevel: finalResult.dangerLevel,
          ratingLabel: finalResult.ratingLabel,
          nutriScore: finalResult.nutrition_grades || "C",
          nutrition_grades: finalResult.nutrition_grades || "C",
          timestamp: finalResult.scannedAt || new Date().toISOString(),
          image: finalResult.image,
          ingredients_text: finalResult.ingredients_text,
          nova_group: finalResult.nova_group,
          ecoscore_grade: finalResult.ecoscore_grade,
          allergens: finalResult.allergens,
          additives_tags: finalResult.additives_tags,
          nutriments: finalResult.nutriments,
          roast: finalResult.roast,
          suspiciousIngredients: finalResult.suspiciousIngredients,
          healthySwap: finalResult.healthySwap,
          damageReport: finalResult.damageReport
        };
        const filtered = prev.filter(item => (item.barcode !== finalResult.barcode) && (item.id !== historyRecord.id));
        return [historyRecord, ...filtered].slice(0, 20);
      });
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      alert(`Scan failed: ${err.message}`);
    }
  };

  const handleDeleteHistoryItem = (itemId) => {
    setHistory(prev => prev.filter(item => (item.id !== itemId) && (item.barcode !== itemId)));
  };

  const handleClearHistory = () => {
    if (window.confirm("Do you want to clear your weekly toxic ledger?")) {
      setHistory([]);
    }
  };

  const handleSelectHistory = (item) => {
    setCurrentResult(item);
  };

  return (
    <div className="device-wrapper">
      <div className="device-notch"></div>
      
      <div className="device-status-bar">
        <span>{statusTime}</span>
        <div className="status-bar-icons">
          <Wifi size={13} strokeWidth={2.5} />
          <span style={{ fontSize: '10px' }}>5G</span>
          <Battery size={15} strokeWidth={2.5} />
        </div>
      </div>

      <div className="app-container">
        <header className="app-header">
          <h1 className="app-logo">
            FoodLens <span>Zehar</span>
          </h1>
          <span style={{ 
            fontSize: '9px', 
            fontWeight: 900, 
            background: apiKey ? 'rgba(0, 255, 102, 0.15)' : 'rgba(158,0,255,0.1)', 
            color: apiKey ? 'var(--color-safe)' : 'var(--color-accent)',
            padding: '2px 8px', 
            borderRadius: '20px',
            border: apiKey ? '1px solid rgba(0, 255, 102, 0.3)' : '1px solid rgba(158,0,255,0.2)'
          }}>
            {apiKey ? 'Live AI Mode' : 'Kaggle Demo'}
          </span>
        </header>

        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <h3 style={{ fontSize: '16px', fontWeight: 900, fontFamily: 'var(--font-heading)' }}>Exposing Secrets...</h3>
            <p className="loading-roast-line">"{loaderMessage}"</p>
          </div>
        )}

        <main className="screen-content">
          {currentResult ? (
            <ResultView 
              product={currentResult} 
              profile={profile} 
              apiKey={apiKey}
              onBack={() => setCurrentResult(null)} 
            />
          ) : (
            <>
              {activeTab === 'scan' && (
                <Scanner 
                  onScanStart={handleScanStart} 
                  onScanComplete={handleScanComplete} 
                  onScanError={err => alert(err)} 
                />
              )}
              {activeTab === 'history' && (
                <HistoryView 
                  history={history} 
                  onSelectProduct={handleSelectHistory}
                  onDeleteItem={handleDeleteHistoryItem}
                  onClearAll={handleClearHistory}
                />
              )}
              {activeTab === 'profile' && (
                <ProfileView 
                  profile={profile} 
                  onUpdateProfile={setProfile} 
                  history={history}
                  onSelectProduct={handleSelectHistory}
                />
              )}
              {activeTab === 'settings' && (
                <SettingsView 
                  apiKey={apiKey} 
                  onSaveApiKey={setApiKey} 
                />
              )}
            </>
          )}
        </main>

        <nav className="app-navbar">
          <button 
            className={`nav-item ${activeTab === 'scan' && !currentResult ? 'active' : ''}`}
            onClick={() => { setActiveTab('scan'); setCurrentResult(null); }}
          >
            <Camera size={20} />
            <span>Scan</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'history' && !currentResult ? 'active' : ''}`}
            onClick={() => { setActiveTab('history'); setCurrentResult(null); }}
          >
            <History size={20} />
            <span>Ledger</span>
          </button>

          <button 
            className={`nav-item ${activeTab === 'profile' && !currentResult ? 'active' : ''}`}
            onClick={() => { setActiveTab('profile'); setCurrentResult(null); }}
          >
            <User size={20} />
            <span>Profile</span>
          </button>

          <button 
            className={`nav-item ${activeTab === 'settings' && !currentResult ? 'active' : ''}`}
            onClick={() => { setActiveTab('settings'); setCurrentResult(null); }}
          >
            <SettingsIcon size={20} />
            <span>Settings</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
