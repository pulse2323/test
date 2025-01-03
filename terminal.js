class TerminalAnimation {
    constructor() {
        this.lines = [
            "Initializing ECLIPTIC AI core systems...",
            "Loading quantum ECLIPTIC patterns...",
            "Establishing chain connections...",
            "ECLIPTIC network: Online",
            "Quantum core: Activated",
            "Pattern recognition: Enabled",
            "ECLIPTIC AI: Ready for analysis"
        ];
        this.terminal = document.querySelector('.terminal-content');
        this.typeSpeed = 30; // Faster typing speed
        this.lineDelay = 800; // Longer delay between lines
        this.currentLine = 0;
        this.currentChar = 0;
        this.init();
    }

    init() {
        this.createNewLine();
    }

    createNewLine() {
        const line = document.createElement('div');
        line.className = 'terminal-line';

        const prompt = document.createElement('span');
        prompt.className = 'terminal-prompt';
        prompt.textContent = '>';

        const text = document.createElement('span');
        text.className = 'terminal-text';

        line.appendChild(prompt);
        line.appendChild(text);
        this.terminal.appendChild(line);

        this.typeLine(text);
    }

    typeLine(element) {
        if (this.currentChar < this.lines[this.currentLine].length) {
            element.textContent += this.lines[this.currentLine][this.currentChar];
            this.currentChar++;
            setTimeout(() => this.typeLine(element), this.typeSpeed);
        } else {
            this.currentChar = 0;
            this.currentLine++;
            if (this.currentLine < this.lines.length) {
                setTimeout(() => this.createNewLine(), this.lineDelay);
            }
        }
    }
}

// Start animation when document loads
document.addEventListener('DOMContentLoaded', () => {
    new TerminalAnimation();
});