const input = document.querySelector('input');
const log = document.querySelector('textarea');

export class Calculator {
    public static scientificMode = true;
    private static currentValue = '';
    private static firstOperand = '';
    private static secondOperand = '';
    private static operator = '';
    private static waitingForSecondOperand = false;
    private static strInput = '';

    private static isOperator(char: string): boolean {
        return char == '+' || char == '-' || char == '×' || char == '÷';
    }

    static reset(): void {
        log.value = this.strInput = this.currentValue = this.firstOperand = this.secondOperand = this.operator = input.value = '';
    }

    private static scientificEval(char): void {
        if (char == '=') {
            input.value = eval(this.strInput);
        } else if (char == 'AC') {
            this.reset();
            this.waitingForSecondOperand = false;
        } else if (this.isOperator(char)) {
            if (this.isOperator(this.strInput.slice(-1))) {
                this.strInput = this.strInput.slice(0, -1);
            }
            if (char == '÷') {
                this.operator = '/';
            } else if (char == '×') {
                this.operator = '*';
            } else {
                this.operator = char;
            }
            this.strInput += this.operator;
            this.waitingForSecondOperand = true;
        } else if (!isNaN(Number(char)) || '.') {
            this.strInput += char;
            if (this.waitingForSecondOperand) {
                input.value = eval(this.strInput);
            }
        }
        log.value = this.strInput
    }

    private static standardEval(char: string): void {
        if (char == '=') {
            input.value = eval(this.firstOperand + this.operator + this.secondOperand);
        } else if (char == 'AC') {
            this.reset();
            this.waitingForSecondOperand = false;
        } else if (this.isOperator(char)) {
            if (this.waitingForSecondOperand) {
                this.firstOperand = this.currentValue || this.firstOperand;
            }
            if (this.isOperator(this.strInput.slice(-1))) {
                this.strInput = this.strInput.slice(0, -1);
            }
            this.strInput += char;
            log.value = this.strInput;
            if (char == '÷') {
                this.operator = '/';
            } else if (char == '×') {
                this.operator = '*';
            } else {
                this.operator = char;
            }
            this.secondOperand = '';
            this.waitingForSecondOperand = true;
        } else if (!isNaN(Number(char)) || '.') {
            this.strInput += char;
            log.value = this.strInput;
            if (this.waitingForSecondOperand) {
                this.secondOperand += char;
                input.value = this.currentValue = eval(this.firstOperand + this.operator + this.secondOperand);
            } else {
                this.firstOperand += char;
            }
        }
    }

    static myEval(char): void {
        if (this.scientificMode) {
            this.scientificEval(char);
        } else {
            this.standardEval(char);
        }
    }

    static backSpace(): void {
        const newStrInput = this.strInput.slice(0, this.strInput.length - 1);
        this.reset();
        for (let i = 0; i < newStrInput.length; i++) {
            this.myEval(newStrInput[i])
        }
    }
}

