import React, { useState } from 'react';
import { Settings, Eye, EyeOff, Key, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';

export default function SettingsView({ apiKey, onSaveApiKey }) {
  const [keyInput, setKeyInput] = useState(apiKey || "");
  const [showKey, setShowKey] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const handleSave = () => {
    onSaveApiKey(keyInput.trim());
    setSaveStatus("Settings saved successfully!");
    setTimeout(() => {
      setSaveStatus(null);
    }, 3000);
  };

  const handleReset = () => {
    setKeyInput("");
    onSaveApiKey("");
    setSaveStatus("API key removed. Running in Demo Mock Mode.");
    setTimeout(() => {
      setSaveStatus(null);
    }, 3000);
  };

  return (
    <div className="settings-screen">
      <div>
        <h2 className="scanner-title">Settings</h2>
        <p className="scanner-tagline">Configure AI keys & integration modes</p>
      </div>

      {/* Mode Status Indicator Card */}
      <div style={{
        background: apiKey ? 'rgba(0, 255, 102, 0.05)' : 'rgba(158, 0, 255, 0.05)',
        border: apiKey ? '1px solid rgba(0, 255, 102, 0.2)' : '1px solid rgba(158, 0, 255, 0.2)',
        borderRadius: '24px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {apiKey ? (
            <>
              <CheckCircle size={18} color="var(--color-safe)" />
              <span style={{ fontWeight: 800, fontSize: '13px', color: 'var(--color-safe)' }}>LIVE AI MODE RUNNING</span>
            </>
          ) : (
            <>
              <Sparkles size={18} color="var(--color-accent)" />
              <span style={{ fontWeight: 800, fontSize: '13px', color: 'var(--color-accent)' }}>DEMO MOCK MODE ACTIVE</span>
            </>
          )}
        </div>
        <p style={{ fontSize: '11px', color: '#B3B3C2', lineHeight: '1.4' }}>
          {apiKey 
            ? "Your custom Gemini API Key is loaded. You can scan or upload photo of *any* packaged food label and receive dynamic real-time AI roasts!" 
            : "Running in serverless demonstration mode. Scan the pre-seeded Quick-Scan items or input simple phrases to test. To scan arbitrary snacks, add your Gemini API Key below!"}
        </p>
      </div>

      {/* API Key Form */}
      <div className="settings-input-group">
        <label className="settings-label">
          <Key size={13} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
          <span>Gemini Developer API Key</span>
        </label>
        
        <div className="settings-input-wrapper">
          <input 
            type={showKey ? "text" : "password"} 
            className="settings-input" 
            placeholder="AIzaSy..." 
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
          />
          <button 
            type="button"
            className="settings-input-toggle-btn"
            onClick={() => setShowKey(!showKey)}
          >
            {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <p className="settings-help">
          Don't have an API Key? Get one for free in 30 seconds: 
          <br />
          <a 
            href="https://aistudio.google.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ fontWeight: 700 }}
          >
            👉 Click here to open Google AI Studio
          </a>
        </p>
      </div>

      {saveStatus && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          color: apiKey ? 'var(--color-safe)' : 'var(--color-meh)', 
          fontSize: '11px', 
          background: 'rgba(255,255,255,0.03)', 
          padding: '10px', 
          borderRadius: '8px', 
          border: '1px solid rgba(255,255,255,0.08)' 
        }}>
          <AlertCircle size={14} />
          <span>{saveStatus}</span>
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          className="btn-save-settings" 
          onClick={handleSave}
          style={{ flex: 2 }}
        >
          Save Configuration
        </button>
        
        {apiKey && (
          <button 
            className="btn-save-settings" 
            onClick={handleReset}
            style={{ flex: 1, background: 'rgba(255,51,51,0.1)', color: 'var(--color-danger)', border: '1px solid rgba(255,51,51,0.2)' }}
          >
            Reset
          </button>
        )}
      </div>

      {/* Instructions details */}
      <div style={{ 
        marginTop: '12px',
        padding: '12px', 
        borderRadius: '16px', 
        background: 'rgba(255,255,255,0.01)', 
        border: '1px solid rgba(255,255,255,0.03)',
        fontSize: '11px',
        lineHeight: '1.4',
        color: 'var(--text-muted)'
      }}>
        <span style={{ fontWeight: 800, color: 'white', display: 'block', marginBottom: '4px' }}>How it works under the hood:</span>
        <ol style={{ paddingLeft: '14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <li>FoodLens scans are secure and run entirely client-side in your browser.</li>
          <li>When you upload a snack label, the system uses Google's latest <code style={{ color: 'var(--color-safe)' }}>gemini-2.5-flash</code> model.</li>
          <li>The prompt instructs the model to translate ingredients into plain-English definitions and compile roasts suited to your profile and voice configurations.</li>
        </ol>
      </div>
    </div>
  );
}
