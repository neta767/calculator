export class Calculator {
    static input = document.querySelector('input');
    static log = document.querySelector('textarea');

    private static currentValue = '';
    private static firstOperand = '';
    private static secondOperand = '';
    private static operator = '';
    private static waitingForSecondOperand = false;
    private static strInput = '';
    private operators = [
        {
            id: "op-squared",
            symbol: " ^2",
            calc: function (a) {
                return Math.pow(a, 2);
            }
        },
        {
            id: "op-power",
            symbol: " ^",
            calc: function (a, b) {
                return Math.pow(a, b);
            }
        },
        {
            id: "op-negate",
            symbol: " -",
            calc: function (a) {
                return -a;
            }
        },
        {
            id: "op-square-root",
            symbol: " √",
            calc: function (a) {
                return Math.sqrt(a);
            }
        },
        // {
        //     id: "op-log",
        //     numOperands: 1,
        //     symbol: " log ",
        //     calc: function (a) {
        //         return Math.log10(a);
        //     }
        // },
        {
            id: "op-nth-root",
            numOperands: 2,
            symbol: "*√",
            calc: function (a, b) {
                return Math.pow(b, 1 / a);
            }
        },
        {
            id: "op-multiply",
            numOperands: 2,
            symbol: " x ",
            calc: function (a, b) {
                return a * b;
            }
        },
        {
            id: "op-divide",
            symbol: " ÷ ",
            calc: function (a, b) {
                return a / b;
            }
        },
        {
            id: "op-add",
            symbol: " + ",
            calc: function (a, b) {
                return a + b;
            }
        },
        {
            id: "op-subtract",
            numOperands: 2,
            symbol: " - ",
            calc: function (a, b) {
                return a - b;
            }
        },
        {
            id: "op-subtract",
            numOperands: 2,
            symbol: " - ",
            calc: function (a, b) {
                return a - b;
            }
        },
        {
            id: "op-modulo",
            numOperands: 2,
            symbol: " % ",
            calc: function (a, b) {
                return a - b * Math.floor(a / b);
            }
        }
    ];

    private static isOperator(char: string): boolean {
        return char == '+' || char == '-' || char == '×' || char == '÷';
    }

    static reset(): void {
        this.log.rows = 1;
        this.log.value = this.strInput = this.currentValue = this.firstOperand = this.secondOperand = this.operator = this.input.value = '';
    }

    private static scientificEval(char): void {
        if (char == '=') {
            this.input.value = eval(this.strInput);
            this.log.value = this.log.value + '\n= ' + this.input.value + '\n' + this.input.value;
            this.log.rows += 2;
        } else if (char == 'AC') {
            this.reset();
            this.waitingForSecondOperand = false;
        } else if (this.isOperator(char)) {
            if (this.isOperator(this.strInput.slice(-1))) {
                this.strInput = this.strInput.slice(0, -1);
                this.log.value = this.log.value.slice(0, -1);
            }
            if (char == '÷') {
                this.operator = '/';
            } else if (char == '×') {
                this.operator = '*';
            } else {
                this.operator = char;
            }
            this.strInput += this.operator;
            this.log.value += this.operator;
            this.waitingForSecondOperand = true;
        } else if (!isNaN(Number(char)) || '.') {
            this.strInput += char;
            this.log.value += char;
            if (this.waitingForSecondOperand) {
                this.input.value = eval(this.strInput);
            }
        }
        // this.log.value = this.strInput
    }

    private static standardEval(char: string): void {
        if (char == '=') {
            this.input.value = eval(this.firstOperand + this.operator + this.secondOperand);
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
            this.log.value = this.strInput;
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
            this.log.value = this.strInput;
            if (this.waitingForSecondOperand) {
                this.secondOperand += char;
                this.input.value = this.currentValue = eval(this.firstOperand + this.operator + this.secondOperand);
            } else {
                this.firstOperand += char;
            }
        }
    }

    static myEval(char): void {
        // if (this.scientificMode) {
        //     this.scientificEval(char);
        // } else {
        //     this.standardEval(char);
        // }
    }

    static backSpace(): void {
        const newStrInput = this.strInput.slice(0, this.strInput.length - 1);
        this.reset();
        for (let i = 0; i < newStrInput.length; i++) {
            this.myEval(newStrInput[i])
        }
    }
}

