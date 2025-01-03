function createMarketCard(tokenData) {
    const card = document.createElement('div');
    card.className = 'market-card';

    // Market card content
    card.innerHTML = `
        <div class="market-header">
            <div class="market-title">
                <h3>${tokenData.symbol}</h3>
                <span class="market-name">${tokenData.name}</span>
            </div>
            <div class="market-price">
                <span class="current-price">$${tokenData.price}</span>
                <span class="price-change ${tokenData.priceChange >= 0 ? 'positive' : 'negative'}">
                    ${tokenData.priceChange}%
                </span>
            </div>
        </div>
        <div class="market-links">
            <a href="https://dexscreener.com/${tokenData.chain}/${tokenData.pairAddress}" 
               class="dex-link" 
               target="_blank" 
               rel="noopener noreferrer">
                <svg class="dex-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke-width="2"/>
                    <path d="M15 3h6v6" stroke-width="2"/>
                    <path d="M10 14L21 3" stroke-width="2"/>
                </svg>
                View on DEXScreener
            </a>
        </div>
    `;

    return card;
}