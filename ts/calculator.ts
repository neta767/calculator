const input = document.querySelector('input');
const log = document.querySelector('textarea');

export class calculator {
    currentValue = '';
    firstOperand = '';
    secondOperand = '';
    operator = '';
    waitingForSecondOperand = false;
    strInput = '';

    reset(): void {
        log.value = this.strInput = this.currentValue = this.firstOperand = this.secondOperand = this.operator = input.value = '';
    }

    scientificEval(char): void {
        switch (char) {
            case '=':
                input.value = eval(this.strInput);
                break;
            case 'AC':
                this.strInput = input.value = '';
                break;
            case '÷':
                this.strInput += '/';
                break;
            case '×':
                this.strInput += '*';
                break;
            default:
                // if (Number.isInteger(Number(char)) || '') {
                if (!isNaN(Number(char)) || '.') {
                    // if (char === '0' && this.strInput.slice(-1) === '/') {
                    //     alert('undefined')
                    // } else {
                    this.strInput += char;
                    input.value = eval(this.strInput);
                    // }
                } else {
                    this.strInput += char;
                }
        }
        log.value = this.strInput
    }

    isOperator(char: string): boolean {
        return char == '+' || char == '-' || char == '×' || char == '÷';
    }

    standardEval(char: string): void {
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
                this.secondOperand += char
                // console.log(this.firstOperand + this.operator + this.secondOperand);
                input.value = this.currentValue = eval(this.firstOperand + this.operator + this.secondOperand);
            } else {
                this.firstOperand += char;
            }
        }
    }
}