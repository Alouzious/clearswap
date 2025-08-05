import React, { useEffect, useState, useCallback } from 'react';
import {
  ArrowDownUp,
  TrendingUp,
  Info,
  RefreshCw,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import './Home.css';

function Home({ publicKey, walletAddress, onBackToLanding }) {
  // State hooks
  const [tokens, setTokens] = useState([]);
  const [fromToken, setFromToken] = useState('');
  const [toToken, setToToken] = useState('');
  const [amount, setAmount] = useState('');
  const [quote, setQuote] = useState(null);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [loadingTokens, setLoadingTokens] = useState(false);
  const [error, setError] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  // API Config (NOTE: avoid exposing API keys in frontend for prod)
  const API_BASE_URL =
    'https://soroswap-api-staging-436722401508.us-central1.run.app';
  const API_KEY =
    'sk_e2acb3e0b5248f286023ef7ce9a5cde7e087c12579ae85fb3e9e318aeb11c6ce';

  const isConnected = Boolean(publicKey || walletAddress);

  // Fetch available tokens from API or fallback
  const fetchTokens = useCallback(async () => {
    setLoadingTokens(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/asset-list?name=soroswap`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error(`API request failed: ${response.status}`);

      const data = await response.json();

      if (!data.assets || !Array.isArray(data.assets)) {
        throw new Error('Token list not available');
      }

      const filteredTokens = data.assets
        .map(asset => ({
          address: asset.contract,
          symbol: asset.code,
          name: asset.name || asset.code,
          decimals: asset.decimals || 7,
          icon: asset.icon,
        }))
        .filter(token => token.address && token.symbol);

      if (filteredTokens.length === 0) throw new Error('No valid tokens found');

      setTokens(filteredTokens);
      setFromToken(filteredTokens[0]?.address || '');
      setToToken(filteredTokens[1]?.address || '');
    } catch (err) {
      // Fallback tokens if API fails
      const fallbackTokens = [
        {
          address: 'CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75',
          symbol: 'USDC',
          name: 'USD Coin',
          decimals: 7,
        },
        {
          address: 'CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA',
          symbol: 'XLM',
          name: 'Stellar Lumens',
          decimals: 7,
        },
        {
          address: 'CDTKPWPLOURQA2SGTKTUQOWRCBZEORB4BWBOMJ3D3ZTQQSGE5F6JBQLV',
          symbol: 'EURC',
          name: 'Euro Coin',
          decimals: 7,
        },
      ];

      setTokens(fallbackTokens);
      setFromToken(fallbackTokens[0].address);
      setToToken(fallbackTokens[1].address);
    } finally {
      setLoadingTokens(false);
    }
  }, [API_BASE_URL, API_KEY]);

  // Fetch quote from API
  const fetchQuote = useCallback(async () => {
    if (!fromToken || !toToken || !amount || parseFloat(amount) <= 0) {
      setError('Please select tokens and enter a valid amount');
      return;
    }
    if (fromToken === toToken) {
      setError('Please select different tokens for swap');
      return;
    }

    setLoadingQuote(true);
    setError('');
    setQuote(null);

    try {
      const amountInStroops = Math.floor(parseFloat(amount) * 1e7).toString();

      const payload = {
        assetIn: fromToken,
        assetOut: toToken,
        amount: amountInStroops,
        tradeType: 'EXACT_IN',
        protocols: ['soroswap', 'phoenix', 'aqua', 'sdex'],
        slippageTolerance: 50,
        gaslessTrustline: 'CREATE',
        feeBps: 50,
      };

      const res = await fetch(`${API_BASE_URL}/quote?network=mainnet`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(
          `Quote request failed: ${res.status} ${res.statusText} - ${errorText}`
        );
      }

      const data = await res.json();
      setQuote(data);
      setShowDetails(true);
    } catch (err) {
      setError(`Failed to get quote: ${err.message}`);
    } finally {
      setLoadingQuote(false);
    }
  }, [fromToken, toToken, amount, API_BASE_URL, API_KEY]);

  // Simulate swap execution
  const executeSwap = async () => {
    if (!quote) {
      setError('Please get a quote first');
      return;
    }

    setIsExecuting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate delay

      alert(
        `Swap executed successfully!\n\nSwapped: ${amount} ${getTokenSymbol(
          fromToken
        )}\nReceived: ${formatAmount(quote.amountOut)} ${getTokenSymbol(
          toToken
        )}\nTransaction will appear in your wallet shortly.`
      );

      // Reset after swap
      setAmount('');
      setQuote(null);
      setShowDetails(false);
    } catch (err) {
      setError(`Swap failed: ${err.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  // Set max amount (mock)
  const setMaxAmount = () => {
    setAmount('1000.0000'); // Mock balance for max
  };

  // Fetch tokens when connected
  useEffect(() => {
    if (isConnected) {
      fetchTokens();
    }
  }, [fetchTokens, isConnected]);

  // Helpers
  const formatAmount = (amount, decimals = 7) => {
    if (!amount) return '0.0000';
    return (parseFloat(amount) / Math.pow(10, decimals)).toFixed(4);
  };

  const getTokenSymbol = address => {
    if (!address) return 'Unknown';
    const token = tokens.find(t => t.address === address);
    return token ? token.symbol : address.substring(0, 8) + '...';
  };

  const getTokenName = address => {
    if (!address) return 'Unknown Token';
    const token = tokens.find(t => t.address === address);
    return token ? token.name : 'Unknown Token';
  };

  // Swap from/to tokens and reset quote/details
  const swapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setQuote(null);
    setShowDetails(false);
  };

  // Main JSX render
  return (
    <>
      <div className="home-container">
        {!isConnected ? (
          <div className="connection-required">
            <div className="connection-card">
              <h2>Wallet Connection Required</h2>
              <p>Please connect your wallet to start trading</p>
              <button className="connect-prompt-btn" onClick={onBackToLanding}>
                Go Back to Connect Wallet
              </button>
            </div>
          </div>
        ) : (
          <div className="swap-container">
            <div className="swap-card">
              <div className="swap-header">
                <h2 className="swap-title">Swap Tokens</h2>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="info-button"
                  title="Toggle quote details"
                >
                  <Info size={20} />
                </button>
              </div>

              {error && (
                <div className="error">
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              {loadingTokens && (
                <div className="loading">
                  <RefreshCw size={16} className="spin" />
                  Loading tokens...
                </div>
              )}

              {/* From Token */}
              <div className="token-card">
                <div className="token-header">
                  <label className="token-label">From</label>
                  <button className="max-button" onClick={setMaxAmount}>
                    Max
                  </button>
                </div>

                <div className="token-input-row">
                  <input
                    type="number"
                    placeholder="0.0"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="amount-input"
                  />

                  <select
                    value={fromToken}
                    onChange={e => setFromToken(e.target.value)}
                    className="token-select"
                    disabled={loadingTokens}
                  >
                    <option value="">Select Token</option>
                    {tokens.map(token => (
                      <option key={token.address} value={token.address}>
                        {token.symbol}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="token-info">
                  <span className="token-name">{getTokenName(fromToken)}</span>
                  <span className="balance">Balance: 1,000.00</span>
                </div>
              </div>

              {/* Swap Button */}
              <div className="swap-button-container">
                <button onClick={swapTokens} className="swap-arrow-button" title="Swap tokens">
                  <ArrowDownUp size={20} />
                </button>
              </div>

              {/* To Token */}
              <div className="token-card">
                <div className="token-header">
                  <label className="token-label">To</label>
                </div>

                <div className="token-input-row">
                  <div className="output-amount">{quote ? formatAmount(quote.amountOut) : '0.0'}</div>

                  <select
                    value={toToken}
                    onChange={e => setToToken(e.target.value)}
                    className="token-select"
                    disabled={loadingTokens}
                  >
                    <option value="">Select Token</option>
                    {tokens.map(token => (
                      <option key={token.address} value={token.address}>
                        {token.symbol}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="token-info">
                  <span className="token-name">{getTokenName(toToken)}</span>
                  <span className="balance">Balance: 0.00</span>
                </div>
              </div>

              {/* Quote Details */}
              {quote && showDetails && (
                <div className="quote-details">
                  <div className="quote-row">
                    <span>Rate</span>
                    <span>
                      1 {getTokenSymbol(fromToken)} ={' '}
                      {(parseFloat(formatAmount(quote.amountOut)) / parseFloat(amount)).toFixed(6)}{' '}
                      {getTokenSymbol(toToken)}
                    </span>
                  </div>
                  <div className="quote-row">
                    <span>Price Impact</span>
                    <span style={{ color: parseFloat(quote.priceImpactPct || 0) > 3 ? '#ff4757' : '#2ed573' }}>
                      {quote.priceImpactPct || 'N/A'}%
                    </span>
                  </div>
                  <div className="quote-row">
                    <span>Minimum Received</span>
                    <span>
                      {formatAmount(quote.otherAmountThreshold)} {getTokenSymbol(toToken)}
                    </span>
                  </div>
                  <div className="quote-row">
                    <span>Platform</span>
                    <span className="platform-name">{quote.platform}</span>
                  </div>
                  <div className="quote-row">
                    <span>Network Fee</span>
                    <span>~$0.001</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="action-buttons">
                <button
                  onClick={fetchQuote}
                  disabled={loadingQuote || loadingTokens || !amount || !fromToken || !toToken}
                  className={`get-quote-btn ${
                    loadingQuote || loadingTokens || !amount || !fromToken || !toToken ? 'disabled' : ''
                  }`}
                >
                  {loadingQuote ? (
                    <>
                      <RefreshCw size={20} className="spin" />
                      Getting Quote...
                    </>
                  ) : (
                    <>
                      <TrendingUp size={20} />
                      Get Quote
                    </>
                  )}
                </button>

                {quote && (
                  <button
                    onClick={executeSwap}
                    disabled={isExecuting}
                    className={`swap-now-btn ${isExecuting ? 'disabled' : ''}`}
                  >
                    {isExecuting ? (
                      <>
                        <RefreshCw size={20} className="spin" />
                        Executing...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={20} />
                        Execute Swap
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-row">
              <div className="stat-mini-card">
                <div className="stat-value">$0.001</div>
                <div className="stat-label-mini">Avg Fee</div>
              </div>
              <div className="stat-mini-card">
                <div className="stat-value">~3s</div>
                <div className="stat-label-mini">Settlement</div>
              </div>
              <div className="stat-mini-card">
                <div className="stat-value">{tokens.length}</div>
                <div className="stat-label-mini">Tokens</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Home;
