document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.querySelector('.preloader');
    const enterButton = document.querySelector('.enter-button');
    const loadingStatus = document.querySelector('.loading-status');

    // Array of loading messages
    const loadingMessages = [
        'INITIALIZING ECLIPTIC CORE',
        'CONNECTING TO BLOCKCHAIN',
        'LOADING QUANTUM PROCESSORS',
        'CALIBRATING AI SYSTEMS',
        'SYNCHRONIZING DATA STREAMS'
    ];

    // Cycle through loading messages
    let messageIndex = 0;
    const messageInterval = setInterval(() => {
        loadingStatus.textContent = loadingMessages[messageIndex];
        messageIndex = (messageIndex + 1) % loadingMessages.length;
    }, 500);

    // Handle enter button click
    enterButton.addEventListener('click', () => {
        clearInterval(messageInterval);
        preloader.classList.add('fade-out');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    });
});