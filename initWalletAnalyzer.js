class WalletAnalyzer {
    constructor() {
        this.HELIUS_API_KEY = 'a86b2499-75a3-431c-9958-4dd7f2c42b20';
        this.initializeEventListeners();
        this.isTokensExpanded = false;
        this.isTransfersExpanded = false;
    }

    initializeEventListeners() {
        const analyzeButton = document.getElementById('analyzeButton');
        const walletInput = document.getElementById('walletInput');

        if (analyzeButton) {
            analyzeButton.addEventListener('click', () => this.analyzeWallet());
        }

        if (walletInput) {
            walletInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.analyzeWallet();
                }
            });
        }
    }

    async analyzeWallet() {
        const walletInput = document.getElementById('walletInput');
        const walletAnalytics = document.getElementById('walletAnalytics');
        const address = walletInput.value.trim();

        if (!address) {
            walletAnalytics.innerHTML = `
                <div class="error-message">Please enter a wallet address</div>
            `;
            return;
        }

        try {
            walletAnalytics.innerHTML = '<div class="loading">Analyzing wallet data...</div>';

            // Fetch both balances and transactions
            const [balanceResponse, txResponse] = await Promise.all([
                fetch(`https://api.helius.xyz/v0/addresses/${address}/balances?api-key=${this.HELIUS_API_KEY}`),
                fetch(`https://api.helius.xyz/v0/addresses/${address}/transactions?api-key=${this.HELIUS_API_KEY}`)
            ]);

            const balanceData = await balanceResponse.json();
            const txData = await txResponse.json();

            this.updateUI(balanceData, txData);
        } catch (error) {
            console.error('Analysis error:', error);
            walletAnalytics.innerHTML = `
                <div class="error-message">
                    ${error.message || 'Error analyzing wallet'}
                </div>
            `;
        }
    }

    updateUI(data, transactions) {
        const analyticsDiv = document.getElementById('walletAnalytics');
        const address = document.getElementById('walletInput').value.trim();

        const solBalance = data.tokens.find(token => token.mint === "So11111111111111111111111111111111111111112");
        const nativeBalance = data.nativeBalance;

        // Sort tokens by value/amount
        const sortedTokens = data.tokens.sort((a, b) => b.amount - a.amount);

        // Filter transfers from transactions
        const transfers = transactions.filter(tx =>
            tx.type === 'TRANSFER' || tx.type === 'SOL_TRANSFER'
        ).slice(0, 8);

        analyticsDiv.innerHTML = `
            <div class="analytics-results">
                <div class="wallet-stats-grid">
                    <div class="stat-card">
                        <h4>SOL Balance</h4>
                        <div class="balance-value">${(nativeBalance / 1e9).toFixed(4)} SOL</div>
                        <div class="balance-usd">
                            <a href="https://solscan.io/account/${address}" target="_blank" class="solscan-link">
                                View on Solscan
                                <svg class="external-link-icon" viewBox="0 0 24 24" width="12" height="12">
                                    <path fill="currentColor" d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                    <div class="stat-card">
                        <h4>Wrapped SOL</h4>
                        <div class="balance-value">${solBalance ? (solBalance.amount / 1e9).toFixed(4) : '0'} SOL</div>
                        <div class="balance-usd">wSOL Balance</div>
                    </div>
                    <div class="stat-card">
                        <h4>Token Count</h4>
                        <div class="balance-value">${data.tokens.length}</div>
                        <div class="balance-usd">Different tokens</div>
                    </div>
                </div>

                <div class="data-columns">
                    <div class="token-holdings">
                        <h3>Token Holdings</h3>
                        <div class="token-list">
                            ${sortedTokens.slice(0, this.isTokensExpanded ? undefined : 4).map(token => `
                                <a href="https://solscan.io/token/${token.mint}" target="_blank" class="token-item">
                                    <div class="token-header">
                                        <span class="token-symbol">${token.mint.slice(0, 4)}...${token.mint.slice(-4)}</span>
                                        <span class="token-balance">${(token.amount / Math.pow(10, token.decimals)).toFixed(4)}</span>
                                    </div>
                                    <div class="view-on-solscan">
                                        View on Solscan
                                        <svg class="external-link-icon" viewBox="0 0 24 24" width="12" height="12">
                                            <path fill="currentColor" d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
                                        </svg>
                                    </div>
                                </a>
                            `).join('')}
                        </div>
                        ${sortedTokens.length > 4 ? `
                            <button class="view-more-button" onclick="window.walletAnalyzer.toggleTokens()">
                                ${this.isTokensExpanded ? 'Show Less' : 'View More'}
                            </button>
                        ` : ''}
                    </div>

                    <div class="recent-transfers">
                        <h3>Recent Transfers</h3>
                        <div class="transfers-list">
                            ${transfers.slice(0, this.isTransfersExpanded ? undefined : 4).map(tx => `
                                <a href="https://solscan.io/tx/${tx.signature}" target="_blank" class="transfer-item">
                                    <div class="transfer-header">
                                        <span class="transfer-type">${tx.type}</span>
                                        <span class="transfer-amount">${tx.amount ? (tx.amount / 1e9).toFixed(4) : ''} SOL</span>
                                    </div>
                                    <div class="transfer-time">${new Date(tx.timestamp).toLocaleString()}</div>
                                    <div class="view-on-solscan">
                                        View on Solscan
                                        <svg class="external-link-icon" viewBox="0 0 24 24" width="12" height="12">
                                            <path fill="currentColor" d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
                                        </svg>
                                    </div>
                                </a>
                            `).join('')}
                        </div>
                        ${transfers.length > 4 ? `
                            <button class="view-more-button" onclick="window.walletAnalyzer.toggleTransfers()">
                                ${this.isTransfersExpanded ? 'Show Less' : 'View More'}
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    toggleTokens() {
        this.isTokensExpanded = !this.isTokensExpanded;
        this.analyzeWallet();
    }

    toggleTransfers() {
        this.isTransfersExpanded = !this.isTransfersExpanded;
        this.analyzeWallet();
    }
}

// Initialize when document loads
document.addEventListener('DOMContentLoaded', () => {
    window.walletAnalyzer = new WalletAnalyzer();
});

export default WalletAnalyzer;