// Calculator State
let currentInput = '0';
let previousInput = '';
let operation = null;
let shouldResetDisplay = false;

// DOM Elements
const display = document.getElementById('display');
const hindiDisplay = document.getElementById('hindiDisplay');
const expressionDisplay = document.getElementById('expression');
const displayContainer = document.querySelector('.display-container');

// Sound Effects
const buttonClickSound = new Audio('sounds/button-click.mp3');
const deleteButtonSound = new Audio('sounds/delete-button-click.mp3');
const loadingMsgSound = new Audio('sounds/loading-msg-sound.mp3');
loadingMsgSound.loop = true; // Enable looping for loading sound

// Number to Hindi Words Conversion
const hindiOnes = ['', 'एक', 'दो', 'तीन', 'चार', 'पाँच', 'छह', 'सात', 'आठ', 'नौ'];
const hindiTeens = ['दस', 'ग्यारह', 'बारह', 'तेरह', 'चौदह', 'पंद्रह', 'सोलह', 'सत्रह', 'अठारह', 'उन्नीस'];
const hindiTens = ['', '', 'बीस', 'तीस', 'चालीस', 'पचास', 'साठ', 'सत्तर', 'अस्सी', 'नब्बे'];
const hindiTwenties = ['बीस', 'इक्कीस', 'बाईस', 'तेईस', 'चौबीस', 'पच्चीस', 'छब्बीस', 'सत्ताईस', 'अट्ठाईस', 'उनतीस'];
const hindiThirties = ['तीस', 'इकतीस', 'बत्तीस', 'तैंतीस', 'चौंतीस', 'पैंतीस', 'छत्तीस', 'सैंतीस', 'अड़तीस', 'उनतालीस'];
const hindiForties = ['चालीस', 'इकतालीस', 'बयालीस', 'तैंतालीस', 'चौवालीस', 'पैंतालीस', 'छियालीस', 'सैंतालीस', 'अड़तालीस', 'उनचास'];
const hindiFifties = ['पचास', 'इक्यावन', 'बावन', 'तिरेपन', 'चौवन', 'पचपन', 'छप्पन', 'सत्तावन', 'अट्ठावन', 'उनसठ'];
const hindiSixties = ['साठ', 'इकसठ', 'बासठ', 'तिरसठ', 'चौंसठ', 'पैंसठ', 'छियासठ', 'सड़सठ', 'अड़सठ', 'उनहत्तर'];
const hindiSeventies = ['सत्तर', 'इकहत्तर', 'बहत्तर', 'तिहत्तर', 'चौहत्तर', 'पचहत्तर', 'छिहत्तर', 'सतहत्तर', 'अठहत्तर', 'उनासी'];
const hindiEighties = ['अस्सी', 'इक्यासी', 'बयासी', 'तिरासी', 'चौरासी', 'पचासी', 'छियासी', 'सत्तासी', 'अट्ठासी', 'नवासी'];
const hindiNineties = ['नब्बे', 'इक्यानवे', 'बानवे', 'तिरानवे', 'चौरानवे', 'पचानवे', 'छियानवे', 'सत्तानवे', 'अट्ठानवे', 'निन्यानवे'];

function convertToHindiWords(number) {
    // Handle special cases
    if (number === 0) return 'शून्य';
    if (isNaN(number)) return 'त्रुटि';
    if (!isFinite(number)) return 'अनंत';

    // Handle negative numbers
    let isNegative = false;
    if (number < 0) {
        isNegative = true;
        number = Math.abs(number);
    }

    // Handle decimal numbers
    let decimalPart = '';
    if (number % 1 !== 0) {
        const parts = number.toString().split('.');
        number = parseInt(parts[0]);
        if (parts[1]) {
            decimalPart = ' दशमलव ';
            for (let digit of parts[1]) {
                decimalPart += hindiOnes[parseInt(digit)] + ' ';
            }
        }
    }

    number = Math.floor(number);

    // Handle numbers greater than 99,99,99,999
    if (number > 999999999) {
        return 'बहुत बड़ी संख्या';
    }

    let result = '';

    // Crores (करोड़)
    if (number >= 10000000) {
        const crores = Math.floor(number / 10000000);
        result += convertBelowHundred(crores) + ' करोड़ ';
        number %= 10000000;
    }

    // Lakhs (लाख)
    if (number >= 100000) {
        const lakhs = Math.floor(number / 100000);
        result += convertBelowHundred(lakhs) + ' लाख ';
        number %= 100000;
    }

    // Thousands (हज़ार)
    if (number >= 1000) {
        const thousands = Math.floor(number / 1000);
        result += convertBelowHundred(thousands) + ' हज़ार ';
        number %= 1000;
    }

    // Hundreds (सौ)
    if (number >= 100) {
        const hundreds = Math.floor(number / 100);
        result += hindiOnes[hundreds] + ' सौ ';
        number %= 100;
    }

    // Below 100
    if (number > 0) {
        result += convertBelowHundred(number);
    }

    result = result.trim();

    if (isNegative) {
        result = 'ऋण ' + result;
    }

    return result + decimalPart;
}

function convertBelowHundred(num) {
    if (num === 0) return '';
    if (num < 10) return hindiOnes[num];
    if (num >= 10 && num < 20) return hindiTeens[num - 10];
    if (num >= 20 && num < 30) return hindiTwenties[num - 20];
    if (num >= 30 && num < 40) return hindiThirties[num - 30];
    if (num >= 40 && num < 50) return hindiForties[num - 40];
    if (num >= 50 && num < 60) return hindiFifties[num - 50];
    if (num >= 60 && num < 70) return hindiSixties[num - 60];
    if (num >= 70 && num < 80) return hindiSeventies[num - 70];
    if (num >= 80 && num < 90) return hindiEighties[num - 80];
    if (num >= 90 && num < 100) return hindiNineties[num - 90];
}

// Sound Effect Helper
function playSound(sound) {
    sound.currentTime = 0; // Reset to start
    sound.play().catch(err => console.log('Sound play failed:', err));
}

// Update Display
function updateDisplay() {
    display.textContent = currentInput;

    // Update expression display
    if (operation && previousInput) {
        let opSymbol = operation;
        if (operation === '*') opSymbol = '×';
        if (operation === '/') opSymbol = '÷';
        if (operation === '-') opSymbol = '−';
        expressionDisplay.textContent = `${previousInput} ${opSymbol}`;
    } else {
        expressionDisplay.textContent = '';
    }
}

// Input Number
function inputNumber(num) {
    playSound(buttonClickSound);
    if (shouldResetDisplay) {
        currentInput = num;
        shouldResetDisplay = false;
    } else {
        currentInput = currentInput === '0' ? num : currentInput + num;
    }
    updateDisplay();
}

// Input Decimal
function inputDecimal() {
    playSound(buttonClickSound);
    if (shouldResetDisplay) {
        currentInput = '0.';
        shouldResetDisplay = false;
    } else if (!currentInput.includes('.')) {
        currentInput += '.';
    }
    updateDisplay();
}

// Input Operator
function inputOperator(op) {
    playSound(buttonClickSound);
    if (operation !== null && !shouldResetDisplay) {
        calculate();
    }
    previousInput = currentInput;
    operation = op;
    shouldResetDisplay = true;
    updateDisplay();
}

// Calculate Result
async function calculate() {
    if (operation === null || shouldResetDisplay) return;

    // Play button click sound (same as other buttons) and start loading sound
    playSound(buttonClickSound);

    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    let result;

    // Funny loading messages
    const loadingMessages = [
        '🤔 Calculating...',
        '🧮 Applying quantum logic...',
        '🎲 Consulting the math gods...',
        '🔮 Predicting the future...',
        '✨ Sprinkling magic numbers...',
        '🎯 Almost there...'
    ];

    // Clear expression and show loading
    expressionDisplay.textContent = '';
    hindiDisplay.className = 'hindi-display loading';

    // Start loading sound
    loadingMsgSound.currentTime = 0;
    loadingMsgSound.play().catch(err => console.log('Loading sound failed:', err));

    // Show loading messages one by one
    for (let i = 0; i < loadingMessages.length; i++) {
        hindiDisplay.textContent = loadingMessages[i];
        await new Promise(resolve => setTimeout(resolve, 700)); // 700ms per message
    }

    // Stop loading sound
    loadingMsgSound.pause();
    loadingMsgSound.currentTime = 0;

    // Perform calculation
    switch (operation) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                // Stop loading sound on error
                loadingMsgSound.pause();
                loadingMsgSound.currentTime = 0;

                currentInput = 'Error';
                hindiDisplay.className = 'hindi-display';
                hindiDisplay.textContent = 'त्रुटि: शून्य से विभाजन';
                operation = null;
                previousInput = '';
                shouldResetDisplay = true;
                return;
            }
            result = prev / current;
            break;
        default:
            // Stop loading sound if returning early
            loadingMsgSound.pause();
            loadingMsgSound.currentTime = 0;
            return;
    }

    // Round to avoid floating point errors
    result = Math.round(result * 100000000) / 100000000;

    currentInput = result.toString();
    operation = null;
    previousInput = '';
    shouldResetDisplay = true;

    // Update the numeric display
    display.textContent = currentInput;

    // Show final Hindi result in professional calculator display mode
    const numericValue = parseFloat(currentInput);
    hindiDisplay.className = 'hindi-display result';
    hindiDisplay.textContent = convertToHindiWords(numericValue);

    // Enable result-mode: hide numeric displays, show only Hindi result centered
    displayContainer.classList.add('result-mode');
}

// Clear All
function clearAll() {
    playSound(buttonClickSound);
    currentInput = '0';
    previousInput = '';
    operation = null;
    shouldResetDisplay = false;
    hindiDisplay.textContent = '';
    hindiDisplay.className = 'hindi-display';

    // Remove result-mode to show normal calculator display
    displayContainer.classList.remove('result-mode');

    updateDisplay();
}

// Delete Last Character
function deleteLast() {
    playSound(deleteButtonSound);
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

// Toggle Sign
function toggleSign() {
    playSound(buttonClickSound);
    if (currentInput !== '0') {
        currentInput = currentInput.startsWith('-')
            ? currentInput.slice(1)
            : '-' + currentInput;
        updateDisplay();
    }
}

// Keyboard Support
document.addEventListener('keydown', (event) => {
    const key = event.key;

    // Numbers
    if (key >= '0' && key <= '9') {
        inputNumber(key);
    }
    // Operators
    else if (key === '+' || key === '-' || key === '*' || key === '/') {
        inputOperator(key);
    }
    // Decimal
    else if (key === '.') {
        inputDecimal();
    }
    // Calculate
    else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    }
    // Clear
    else if (key === 'Escape' || key.toLowerCase() === 'c') {
        clearAll();
    }
    // Backspace
    else if (key === 'Backspace') {
        event.preventDefault();
        deleteLast();
    }
});

// Initialize Display
updateDisplay();
