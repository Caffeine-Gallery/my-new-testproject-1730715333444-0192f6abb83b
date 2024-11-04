import { backend } from 'declarations/backend';

const display = document.getElementById('display');
const buttons = document.querySelectorAll('.keypad button');
const clearButton = document.getElementById('clear');

let currentInput = '';
let operator = '';
let firstOperand = null;

buttons.forEach(button => {
    button.addEventListener('click', () => handleButtonClick(button.textContent));
});

clearButton.addEventListener('click', clearCalculator);

async function handleButtonClick(value) {
    if (value >= '0' && value <= '9' || value === '.') {
        currentInput += value;
        updateDisplay();
    } else if (['+', '-', '*', '/'].includes(value)) {
        if (firstOperand === null) {
            firstOperand = parseFloat(currentInput);
            operator = value;
            currentInput = '';
        } else {
            await performCalculation();
            operator = value;
        }
    } else if (value === '=') {
        await performCalculation();
    }
}

async function performCalculation() {
    if (firstOperand !== null && currentInput !== '') {
        const secondOperand = parseFloat(currentInput);
        try {
            display.value = 'Calculating...';
            const result = await backend.calculate(firstOperand, operator, secondOperand);
            currentInput = result.toString();
            updateDisplay();
            firstOperand = null;
            operator = '';
        } catch (error) {
            display.value = 'Error';
            console.error('Calculation error:', error);
        }
    }
}

function updateDisplay() {
    display.value = currentInput;
}

function clearCalculator() {
    currentInput = '';
    operator = '';
    firstOperand = null;
    updateDisplay();
}
