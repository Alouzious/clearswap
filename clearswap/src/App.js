import React, { useState } from 'react';
import { ArrowRight, Sparkles, BarChart3, Shield, Zap, Target } from 'lucide-react';
import Navbar from './components/Navbar';
import Home from './Pages/Home';
import './App.css';

// Main App component that controls wallet connection and view switching
function App() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [publicKey, setPublicKey] = useState(null);
  const [walletKit, setWalletKit] = useState(null);
  const [currentView, setCurrentView] = useState('landing'); // 'landing' or 'swap'

  // Called when user clicks "Get Started" on landing page
  const handleGetStarted = () => {
    // Connect wallet, then switch to swap view
    handleConnect()
      .then(() => setCurrentView('swap'))
      .catch(() => {
        /* handle connection failure if needed */
      });
  };

  // Simulated wallet connection for demo purposes
  const handleConnect = async () => {
    try {
      const mockAddress = 'GABC...XYZ123';
      setWalletAddress(mockAddress);
      setPublicKey(mockAddress);
      setWalletKit(mockAddress);
      return Promise.resolve();
    } catch (err) {
      console.error('Connection failed:', err);
      alert('Connection cancelled or failed.');
      return Promise.reject(err);
    }
  };

  // Disconnect wallet and return to landing
  const handleDisconnect = () => {
    setWalletAddress(null);
    setPublicKey(null);
    setWalletKit(null);
    setCurrentView('landing');
    alert('Wallet disconnected');
  };

  // Placeholder for analytics feature
  const handleViewAnalytics = () => {
    alert('Analytics feature coming soon! This will show trading statistics and market data.');
  };

  return (
    <div className="app">
      <Navbar
        walletAddress={walletAddress}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        onViewChange={setCurrentView}
        currentView={currentView}
      />

      {currentView === 'landing' ? (
        <LandingPage onGetStarted={handleGetStarted} onViewAnalytics={handleViewAnalytics} />
      ) : (
        <Home
          publicKey={publicKey}
          walletAddress={walletAddress}
          onBackToLanding={() => setCurrentView('landing')}
        />
      )}
    </div>
  );
}

// Landing page component with hero, features, steps, stats, and CTA
const LandingPage = ({ onGetStarted, onViewAnalytics }) => {
  return (
    <main className="landing">
      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              The Future of <span className="gradient-text"> Transparent </span> Token Swaps
            </h1>
            <p className="hero-subtitle">
              Experience lightning-fast, low-cost token swaps on Soroban with full transparency. No
              hidden fees, no surprises - just fair trading for everyone.
            </p>
            <div className="hero-buttons">
              <button
                className="primary-btn"
                onClick={onGetStarted}
                title="Start trading now"
                aria-label="Start trading"
              >
                <Sparkles size={20} />
                Start Trading
              </button>
              <button
                className="secondary-btn"
                onClick={onViewAnalytics}
                title="View analytics"
                aria-label="View analytics"
              >
                <BarChart3 size={20} />
                View Analytics
              </button>
            </div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="floating-card">
              <div className="card-header">
                <div className="card-title">
                  <Zap size={20} color="#00d4ff" />
                  Live Swap
                </div>
              </div>
              <div className="card-content">
                <div className="swap-preview">
                  <div className="token-row">
                    <span>100 USDC</span>
                    <ArrowRight size={16} color="#00d4ff" />
                    <span>99.5 XLM</span>
                  </div>
                  <div className="swap-details">
                    <span>Fee: $0.001</span>
                    <span>Time: ~3s</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose ClearSwap?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Shield size={32} color="#00d4ff" />
              </div>
              <h3 className="feature-title">100% Transparent</h3>
              <p className="feature-description">
                Full breakdown of fees, slippage, and minimum received before every trade. No hidden
                costs.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Zap size={32} color="#00d4ff" />
              </div>
              <h3 className="feature-title">Lightning Fast</h3>
              <p className="feature-description">
                Powered by Soroban for ~3 second settlements and ultra-low fees of just $0.001.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Target size={32} color="#00d4ff" />
              </div>
              <h3 className="feature-title">Best Execution</h3>
              <p className="feature-description">
                Smart aggregation across multiple pools ensures you always get the best possible rate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="howItWorks" className="how-it-works-section">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-container">
            {[ // Map over steps for easier scalability
              {
                number: 1,
                title: 'Connect Wallet',
                description: 'Connect your wallet securely in one click',
              },
              {
                number: 2,
                title: 'Select Tokens',
                description: 'Choose your token pair and enter the amount to swap',
              },
              {
                number: 3,
                title: 'Review Details',
                description: 'See exact output, fees, and price impact before confirming',
              },
              {
                number: 4,
                title: 'Execute Trade',
                description: 'Confirm and enjoy fast, transparent execution',
              },
            ].map(({ number, title, description }) => (
              <div key={number} className="step">
                <div className="step-number">{number}</div>
                <div className="step-content">
                  <h3 className="step-title">{title}</h3>
                  <p className="step-description">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section" aria-label="Platform statistics">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">$0.001</div>
              <div className="stat-label">Average Fee</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">~3s</div>
              <div className="stat-label">Settlement Time</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">50+</div>
              <div className="stat-label">Supported Tokens</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">100%</div>
              <div className="stat-label">Transparent</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="docs" className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Experience Transparent Trading?</h2>
            <p className="cta-description">
              Join the future of decentralized trading on Soroban. Fast, fair, and fully transparent.
            </p>
            <button
              className="cta-btn"
              onClick={onGetStarted}
              title="Get started now"
              aria-label="Get started now"
            >
              <Sparkles size={20} />
              Get Started Now
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default App;
