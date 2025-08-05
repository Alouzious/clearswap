import React from 'react';
import { Wallet, Zap } from 'lucide-react';
import './Navbar.css';

const Navbar = ({
  walletAddress,
  setWalletAddress,
  setPublicKey,
  onDisconnect,
  onViewChange,
  currentView,
}) => {
  
  const scrollToSection = (id) => {
    if (currentView !== 'landing') {
      onViewChange('landing');
      setTimeout(() => {
        const section = document.getElementById(id);
        if (section) section.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const section = document.getElementById(id);
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleConnectClick = async () => {
    try {
      // Opens Albedo popup for user confirmation to connect wallet
      const response = await window.albedo.publicKey({ token: "auth" });
      if (response && response.pubkey) {
        setWalletAddress(response.pubkey);
        setPublicKey(response.pubkey);
        alert(`Wallet connected: ${response.pubkey}`);
        if (currentView === 'landing') {
          alert(`Wallet connected successfully! You can now start trading.`);
        }
      }
    } catch (err) {
      console.error("Connection failed or cancelled:", err);
      alert("Connection cancelled or failed.");
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <div className="logo-icon">
          <Zap size={24} color="#00d4ff" />
        </div>
        <span className="logo-text">ClearSwap</span>
      </div>

      <ul className="nav-links">
        <li><button className="nav-link" onClick={() => scrollToSection('home')}>Home</button></li>
        <li><button className="nav-link" onClick={() => scrollToSection('about')}>About</button></li>
        <li><button className="nav-link" onClick={() => scrollToSection('howItWorks')}>How It Works</button></li>
        <li><button className="nav-link" onClick={() => scrollToSection('docs')}>Docs</button></li>
      </ul>

      <div>
        {walletAddress ? (
          <div className="wallet-connected">
            {currentView === 'swap' && (
              <button 
                className="back-to-landing-btn" 
                onClick={() => onViewChange('landing')}
              >
                Back to Home
              </button>
            )}
            <button className="disconnect-btn" onClick={onDisconnect}>
              {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
            </button>
          </div>
        ) : (
          <button className="connect-btn" onClick={handleConnectClick}>
            <Wallet size={18} />
            Connect Wallet
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;



















// import React from "react";
// import "./Navbar.css";

// const Navbar = ({ walletAddress, setWalletAddress, setPublicKey, setWalletKit }) => {
//   const handleConnect = async () => {
//     try {
//       const response = await window.albedo.publicKey({ token: "auth" });
//       setWalletAddress(response.pubkey);
//       setPublicKey(response.pubkey);
//       alert(`Wallet connected: ${response.pubkey}`);
//     } catch (err) {
//       console.error("Connection failed:", err);
//       alert("Connection cancelled or failed.");
//     }
//   };

//   const handleDisconnect = () => {
//     setWalletAddress(null);
//     setPublicKey(null);
//     setWalletKit(null);
//     alert("Wallet disconnected");
//   };

//   return (
//     <nav className="navbar">
//       <div className="navbar-logo">
//         <span role="img" aria-label="swap">💱</span>
//         <span className="logo-text">ClearSwap</span>
//       </div>

//       <ul className="navbar-links">
//         <li>
//           <button className="nav-link" onClick={() => scrollToSection('home')}>Home</button>
//         </li>
//         <li>
//           <button className="nav-link" onClick={() => scrollToSection('about')}>About</button>
//         </li>
//         <li>
//           <button className="nav-link" onClick={() => scrollToSection('howItWorks')}>How It Works</button>
//         </li>
//         <li>
//           <button className="nav-link" onClick={() => scrollToSection('docs')}>Docs</button>
//         </li>
//       </ul>

//       <div className="wallet-btn">
//         {walletAddress ? (
//           <button className="disconnect" onClick={handleDisconnect}>
//             Disconnect
//           </button>
//         ) : (
//           <button className="connect" onClick={handleConnect}>
//             Connect Wallet
//           </button>
//         )}
//       </div>
//     </nav>
//   );
// };

// const scrollToSection = (id) => {
//   const section = document.getElementById(id);
//   if (section) {
//     section.scrollIntoView({ behavior: 'smooth' });
//   }
// };

// export default Navbar;
