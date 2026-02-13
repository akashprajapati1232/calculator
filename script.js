// Calculator State
let expression = '0';    // The full expression string (e.g. "2+3*7-6")
let lastResult = null;   // Stores last result for chaining after "="
let justCalculated = false; // True right after pressing "="

// DOM Elements
const display = document.getElementById('display');
const hindiDisplay = document.getElementById('hindiDisplay');
const expressionDisplay = document.getElementById('expression');
const displayContainer = document.querySelector('.display-container');

// Sound Effects
const buttonClickSound = new Audio('Assets/sounds/button-click.mp3');
const deleteButtonSound = new Audio('Assets/sounds/delete-button-click.mp3');
const loadingMsgSound = new Audio('Assets/sounds/loading-msg-sound.mp3');
loadingMsgSound.loop = true;

// ==================== Hindi Words Conversion ====================

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
    if (number === 0) return 'शून्य';
    if (isNaN(number)) return 'त्रुटि';
    if (!isFinite(number)) return 'अनंत';

    let isNegative = false;
    if (number < 0) {
        isNegative = true;
        number = Math.abs(number);
    }

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

    if (number > 999999999) {
        return 'बहुत बड़ी संख्या';
    }

    let result = '';

    if (number >= 10000000) {
        const crores = Math.floor(number / 10000000);
        result += convertBelowHundred(crores) + ' करोड़ ';
        number %= 10000000;
    }
    if (number >= 100000) {
        const lakhs = Math.floor(number / 100000);
        result += convertBelowHundred(lakhs) + ' लाख ';
        number %= 100000;
    }
    if (number >= 1000) {
        const thousands = Math.floor(number / 1000);
        result += convertBelowHundred(thousands) + ' हज़ार ';
        number %= 1000;
    }
    if (number >= 100) {
        const hundreds = Math.floor(number / 100);
        result += hindiOnes[hundreds] + ' सौ ';
        number %= 100;
    }
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

// ==================== Sound Helper ====================

function playSound(sound) {
    sound.currentTime = 0;
    sound.play().catch(err => console.log('Sound play failed:', err));
}

// ==================== BODMAS Expression Parser ====================

/**
 * Tokenizes an expression string into numbers and operators.
 * Handles negative numbers at the start or after an operator.
 * Example: "2+3*7-6" -> [2, '+', 3, '*', 7, '-', 6]
 */
function tokenize(expr) {
    const tokens = [];
    let i = 0;

    while (i < expr.length) {
        // Skip whitespace
        if (expr[i] === ' ') { i++; continue; }

        // Check if this is a number (including negative at start or after operator)
        if (expr[i] >= '0' && expr[i] <= '9' || expr[i] === '.') {
            let numStr = '';
            while (i < expr.length && (expr[i] >= '0' && expr[i] <= '9' || expr[i] === '.')) {
                numStr += expr[i];
                i++;
            }
            tokens.push(parseFloat(numStr));
        }
        // Handle negative sign at start of expression or after another operator
        else if (expr[i] === '-' && (tokens.length === 0 || typeof tokens[tokens.length - 1] === 'string')) {
            let numStr = '-';
            i++;
            while (i < expr.length && (expr[i] >= '0' && expr[i] <= '9' || expr[i] === '.')) {
                numStr += expr[i];
                i++;
            }
            tokens.push(parseFloat(numStr));
        }
        // Operators
        else if (['+', '-', '*', '/'].includes(expr[i])) {
            tokens.push(expr[i]);
            i++;
        } else {
            // Skip unknown characters
            i++;
        }
    }

    return tokens;
}

/**
 * Evaluates a tokenized expression using BODMAS (two-pass approach).
 * Pass 1: Evaluate * and / (left to right)
 * Pass 2: Evaluate + and - (left to right)
 * Returns the result number, or throws an error string.
 */
function evaluateTokens(tokens) {
    if (tokens.length === 0) return 0;
    if (tokens.length === 1) return tokens[0];

    // Pass 1: Handle * and / (higher precedence)
    let pass1 = [];
    let i = 0;
    while (i < tokens.length) {
        if (typeof tokens[i] === 'string' && (tokens[i] === '*' || tokens[i] === '/')) {
            const left = pass1.pop();
            const right = tokens[i + 1];

            if (tokens[i] === '*') {
                pass1.push(left * right);
            } else {
                if (right === 0) {
                    throw 'Division by zero';
                }
                pass1.push(left / right);
            }
            i += 2; // skip operator and right operand
        } else {
            pass1.push(tokens[i]);
            i++;
        }
    }

    // Pass 2: Handle + and - (lower precedence)
    let result = pass1[0];
    i = 1;
    while (i < pass1.length) {
        const op = pass1[i];
        const right = pass1[i + 1];

        if (op === '+') {
            result += right;
        } else if (op === '-') {
            result -= right;
        }
        i += 2;
    }

    return result;
}

/**
 * Full expression evaluator: tokenize -> evaluate with BODMAS.
 */
function evaluateExpression(expr) {
    const tokens = tokenize(expr);
    return evaluateTokens(tokens);
}

// ==================== Helper Functions ====================

/** Check if the last character of the expression is an operator */
function lastCharIsOperator() {
    const last = expression[expression.length - 1];
    return ['+', '-', '*', '/'].includes(last);
}

/** Get the current number segment (last number being typed) */
function getCurrentNumberSegment() {
    // Find the last operator position
    let lastOpIndex = -1;
    for (let i = expression.length - 1; i >= 0; i--) {
        if (['+', '-', '*', '/'].includes(expression[i])) {
            // Make sure it's not a negative sign at the start or after another operator
            if (i === 0 || ['+', '-', '*', '/'].includes(expression[i - 1])) {
                continue; // This is a negative sign, not an operator
            }
            lastOpIndex = i;
            break;
        }
    }
    return expression.substring(lastOpIndex + 1);
}

/** Prettify the expression for display (replace operators with symbols) */
function prettifyExpression(expr) {
    return expr
        .replace(/\*/g, '×')
        .replace(/\//g, '÷');
}

// ==================== Display ====================

function updateDisplay() {
    // Show the full expression in the main display
    display.textContent = prettifyExpression(expression);

    // Auto-shrink font for long expressions
    if (expression.length > 12) {
        display.style.fontSize = '32px';
    } else if (expression.length > 8) {
        display.style.fontSize = '40px';
    } else {
        display.style.fontSize = '48px';
    }

    // Clear the expression line (we show everything in main display now)
    expressionDisplay.textContent = '';
}

// ==================== Calculator Actions ====================

function inputNumber(num) {
    playSound(buttonClickSound);

    // If we just calculated, start a fresh expression
    if (justCalculated) {
        expression = num;
        justCalculated = false;
        // Remove result-mode to go back to normal calculator display
        displayContainer.classList.remove('result-mode');
        hindiDisplay.textContent = '';
        hindiDisplay.className = 'hindi-display';
    } else {
        // Replace leading '0' (but not '0.')
        if (expression === '0') {
            expression = num;
        } else {
            expression += num;
        }
    }
    updateDisplay();
}

function inputDecimal() {
    playSound(buttonClickSound);

    if (justCalculated) {
        expression = '0.';
        justCalculated = false;
        displayContainer.classList.remove('result-mode');
        hindiDisplay.textContent = '';
        hindiDisplay.className = 'hindi-display';
        updateDisplay();
        return;
    }

    // Only add a decimal if the current number segment doesn't have one
    const currentNum = getCurrentNumberSegment();
    if (!currentNum.includes('.')) {
        // If last char is an operator, insert "0." for convenience
        if (lastCharIsOperator() || expression === '') {
            expression += '0.';
        } else {
            expression += '.';
        }
    }
    updateDisplay();
}

function inputOperator(op) {
    playSound(buttonClickSound);

    // If we just calculated, continue from the result
    if (justCalculated) {
        justCalculated = false;
        displayContainer.classList.remove('result-mode');
        hindiDisplay.textContent = '';
        hindiDisplay.className = 'hindi-display';
        // expression already holds the result string
    }

    // If the expression is just "0" and operator is minus, allow negative start
    if (expression === '0' && op === '-') {
        expression = '-';
        updateDisplay();
        return;
    }

    // If last character is an operator, replace it (prevent consecutive operators)
    if (lastCharIsOperator()) {
        expression = expression.slice(0, -1) + op;
    } else {
        expression += op;
    }
    updateDisplay();
}

async function calculate() {
    // Don't calculate if expression ends with operator or is empty/just "0"
    if (lastCharIsOperator() || expression === '0' || expression === '' || expression === '-') return;

    playSound(buttonClickSound);

    // Save the expression for display
    const fullExpression = expression;

    // Show loading animation
    const loadingMessages = [
        '🤔 Calculating...',
        '🧮 Applying quantum logic...',
        '🎲 Consulting the math gods...',
        '🔮 Predicting the future...',
        '✨ Sprinkling magic numbers...',
        '🎯 Almost there...'
    ];

    expressionDisplay.textContent = prettifyExpression(fullExpression) + ' =';
    hindiDisplay.className = 'hindi-display loading';

    loadingMsgSound.currentTime = 0;
    loadingMsgSound.play().catch(err => console.log('Loading sound failed:', err));

    for (let i = 0; i < loadingMessages.length; i++) {
        hindiDisplay.textContent = loadingMessages[i];
        await new Promise(resolve => setTimeout(resolve, 700));
    }

    loadingMsgSound.pause();
    loadingMsgSound.currentTime = 0;

    // Evaluate the expression with BODMAS
    let result;
    try {
        result = evaluateExpression(fullExpression);
    } catch (err) {
        // Division by zero or parse error
        display.textContent = 'Error';
        hindiDisplay.className = 'hindi-display';
        hindiDisplay.textContent = 'त्रुटि: शून्य से विभाजन';
        expression = '0';
        justCalculated = true;
        return;
    }

    // Check for invalid results
    if (!isFinite(result) || isNaN(result)) {
        display.textContent = 'Error';
        hindiDisplay.className = 'hindi-display';
        hindiDisplay.textContent = 'त्रुटि';
        expression = '0';
        justCalculated = true;
        return;
    }

    // Round to avoid floating point errors
    result = Math.round(result * 100000000) / 100000000;

    // Store result as the new expression (for chaining)
    expression = result.toString();
    justCalculated = true;

    // Show result in main display
    display.textContent = expression;
    display.style.fontSize = expression.length > 12 ? '32px' : expression.length > 8 ? '40px' : '48px';

    // Show Hindi result
    hindiDisplay.className = 'hindi-display result';
    hindiDisplay.textContent = convertToHindiWords(result);

    // Enable result-mode
    displayContainer.classList.add('result-mode');
}

function clearAll() {
    playSound(buttonClickSound);
    expression = '0';
    justCalculated = false;
    hindiDisplay.textContent = '';
    hindiDisplay.className = 'hindi-display';
    displayContainer.classList.remove('result-mode');
    display.style.fontSize = '48px';
    updateDisplay();
}

function deleteLast() {
    playSound(deleteButtonSound);

    // If showing a result, clear everything
    if (justCalculated) {
        clearAll();
        return;
    }

    if (expression.length > 1) {
        expression = expression.slice(0, -1);
    } else {
        expression = '0';
    }
    updateDisplay();
}

function toggleSign() {
    playSound(buttonClickSound);

    if (justCalculated) {
        // Toggle sign of the result
        if (expression.startsWith('-')) {
            expression = expression.slice(1);
        } else if (expression !== '0') {
            expression = '-' + expression;
        }
        display.textContent = expression;
        return;
    }

    // For expressions, toggle sign is complex — we'll toggle the current number segment
    // Find the start of the current number segment
    let lastOpIndex = -1;
    for (let i = expression.length - 1; i >= 0; i--) {
        if (['+', '-', '*', '/'].includes(expression[i])) {
            if (i === 0) {
                // Leading negative sign
                lastOpIndex = 0;
                break;
            }
            if (['+', '-', '*', '/'].includes(expression[i - 1])) {
                // Negative sign after operator (e.g., "5*-3")
                continue;
            }
            lastOpIndex = i;
            break;
        }
    }

    if (lastOpIndex === -1) {
        // Entire expression is one number
        if (expression.startsWith('-')) {
            expression = expression.slice(1);
        } else if (expression !== '0') {
            expression = '-' + expression;
        }
    }
    // For multi-part expressions, toggle sign is less straightforward
    // so we keep it simple for the single-number case

    updateDisplay();
}

// ==================== Keyboard Support ====================

document.addEventListener('keydown', (event) => {
    const key = event.key;

    if (key >= '0' && key <= '9') {
        inputNumber(key);
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        inputOperator(key);
    } else if (key === '.') {
        inputDecimal();
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    } else if (key === 'Escape' || key.toLowerCase() === 'c') {
        clearAll();
    } else if (key === 'Backspace') {
        event.preventDefault();
        deleteLast();
    }
});

// ==================== Initialize ====================
updateDisplay();
