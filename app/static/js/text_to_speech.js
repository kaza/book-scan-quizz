let speechSynthesis;
let speechUtterance;
let voices = [];

function initTextToSpeech() {
    if ('speechSynthesis' in window) {
        speechSynthesis = window.speechSynthesis;
        speechUtterance = new SpeechSynthesisUtterance();

        // Load voices
        voices = speechSynthesis.getVoices();
        speechSynthesis.onvoiceschanged = () => {
            voices = speechSynthesis.getVoices();
            populateVoiceList();

            // Set the saved voice after populating the list
            const savedVoiceURI = localStorage.getItem('selectedVoiceURI');
            if (savedVoiceURI) {
                document.getElementById('voice-select').value = savedVoiceURI;
                setVoice(savedVoiceURI);
            }
        };

        return true;
    } else {
        console.error("Text-to-speech not supported in this browser.");
        return false;
    }
}

function populateVoiceList() {
    const voiceSelect = document.getElementById('voice-select');
    voiceSelect.innerHTML = '';
    voices.forEach((voice) => {
        const option = document.createElement('option');
        option.textContent = `${voice.name} (${voice.lang})`;
        option.value = voice.voiceURI;
        voiceSelect.appendChild(option);
    });
}

function speak(text) {
    if (!speechSynthesis) return;

    stopSpeaking();

    speechUtterance.text = text;
    speechSynthesis.speak(speechUtterance);

    // Display spoken text
    const textDisplay = document.getElementById('spoken-text-display');
    textDisplay.textContent = text;
    textDisplay.style.display = 'block';
}

function stopSpeaking() {
    if (speechSynthesis) {
        speechSynthesis.cancel();
    }
}

function setVoice(voiceURI) {
    const voice = voices.find(v => v.voiceURI === voiceURI);
    if (voice) {
        speechUtterance.voice = voice;
        localStorage.setItem('selectedVoiceURI', voiceURI);
    }
}

// Initialize TTS when the page loads
document.addEventListener('DOMContentLoaded', () => {
    if (initTextToSpeech()) {
        const voiceSelect = document.getElementById('voice-select');
        voiceSelect.addEventListener('change', (event) => {
            const selectedVoiceURI = event.target.value;
            setVoice(selectedVoiceURI);
            // Re-speak the question when voice changes
            const textToSpeak = document.getElementById('question-text').textContent;
            speak(textToSpeak);
        });

        // Automatically speak the question when the page loads
        const textToSpeak = document.getElementById('question-text').textContent;

        // Wait a bit for voices to load before speaking
        setTimeout(() => {
            const savedVoiceURI = localStorage.getItem('selectedVoiceURI');
            if (savedVoiceURI) {
                setVoice(savedVoiceURI);
            }
            speak(textToSpeak);
        }, 100);
    } else {
        // Hide TTS controls if not supported
        document.getElementById('tts-controls').style.display = 'none';
    }
});