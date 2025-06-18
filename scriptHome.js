// Show intro text when Pixel-Team animation ends
const pixelTeamImage = document.querySelector('.pixel-team-image');
pixelTeamImage.addEventListener('animationend', () => {
    const introText = document.querySelector('.intro-text');
    introText.classList.add('show');
});

// Handle Start Button Click
document.querySelector('.start-button').addEventListener('click', () => {
    const beepSound = document.getElementById('beep-sound');
    beepSound.play();
    window.location.href = './html/main.html'; // Điều hướng đến main.html
});