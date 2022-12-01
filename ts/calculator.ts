class calculator {
    public input = document.getElementById('calculator-screen') as HTMLInputElement;
    public historyLog = document.querySelectorAll('.calc-history-log');
    public calcHistory: { result: string, expression: string }[];
    public digit = '0123456789';
    // all operators
    // {id: string, numOperands: number, calc: (a: number, b?: number) => number}
    public operators = {
        '!': {
            id: 'op-factorial',
            numOperands: 1,
            calc: function (a) {
                if (a == 0) {
                    return 1;
                } else {
                    let c = 1;
                    for (let i = 1; i <= a; i++) {
                        c *= i;
                    }
                    return c;
                }
            }
        }
        ,
        // '-': {
        //     id: 'op-negate',
        //     numOperands: 1,
        //     calc: function (a) {
        //         return -a;
        //     }
        // },
        '^2': {
            id: 'op-squared',
            numOperands: 1,
            calc: function (a) {
                return Math.pow(a, 2);
            }
        },
        '^': {
            id: 'op-power',
            numOperands: 2,
            calc: function (a, b) {
                return Math.pow(a, b);
            }
        },
        '√': {
            id: 'op-square-root',
            numOperands: 1,
            calc: function (a) {
                return Math.sqrt(a);
            }
        },
        // {
        //     id: ''op-log'',
        //     numOperands: 1,
        //     symbol: '' log '',
        //     calc: function (a) {
        //         return Math.log10(a);
        //     }
        // },
        '*√': {
            id: 'op-nth-root',
            numOperands: 2,
            calc: function (a, b) {
                return Math.pow(b, 1 / a);
            }
        },
        '×': {
            id: 'op-multiply',
            numOperands: 2,
            calc: function (a, b) {
                return a * b;
            }
        },
        '%': {
            id: 'op-modulo',
            numOperands: 2,
            calc: function (a, b) {
                return a - b * Math.floor(a / b);
            }
        },
        '÷': {
            id: 'op-divide',
            numOperands: 2,
            calc: function (a, b) {
                return a / b;
            }
        },
        '+': {
            id: 'op-add',
            numOperands: 2,
            calc: function (a, b) {
                return a + b;
            }
        },
        '-': {
            id: 'op-subtract',
            numOperands: 2,
            symbol: '-',
            calc: function (a, b) {
                return a - b;
            }
        }
    }

    constructor() {
        this.calcHistory = [];
    }

    public clearLogHistory(): void {
        this.historyLog.forEach(elem => elem.innerHTML = '');
        let item = document.createElement('div');
        item.innerHTML = "There's no history yet";
        this.historyLog[0].appendChild(item);
    }

    public clearCalHistory(): void {
        this.calcHistory = [];
        this.clearLogHistory();
    }

    public refreshHistory() {
        this.historyLog.forEach(elem => elem.innerHTML = '');
        for (let i = this.calcHistory.length - 1; i >= 0; i--) {
            let expression = document.createElement('div');
            let result = document.createElement('div');
            expression.classList.add('calc-history-eq');
            expression.innerHTML = `${this.calcHistory[i].expression} =`;
            result.classList.add('calc-history-res');
            result.innerHTML = `${this.calcHistory[i].result} <hr>`;
            this.historyLog[0].appendChild(expression)
            this.historyLog[0].appendChild(result)
        }
    }
}

export class standardCalculator extends calculator {
    // remote->pi,pow()
    public standardOperator = '+-÷×';
// const mapKeys = {
//     '÷': '/',
//     '×': '*',
// }
    public operator: string | null;
    public firstOperand: string | null;
    //  secondOperand: string | null;
    public waitingForSecondOperand: boolean;

    constructor() {
        super();
        this.operator = null;
        this.firstOperand = null;
        this.waitingForSecondOperand = false;
    }

    public reset(): void {
        this.operator = null;
        this.firstOperand = null;
        this.waitingForSecondOperand = false;
        this.calcHistory = [];
        this.input.value = '0';
    }

    public processButton(char: string) {
        // switch (char) {
        //     case 'Backspace':
        //         //
        //         break;
        if (this.digit.includes(char)) {
            if (this.waitingForSecondOperand) {
                this.input.value = char;
                this.waitingForSecondOperand = false;
            } else {
                this.input.value = this.input.value === '0' ? char : this.input.value + char;
            }
        } else if (char == '.') {
            if (!this.input.value.includes('.')) {
                this.input.value += '.';
            }
        } else if (this.standardOperator.includes(char)) {
            this.operator = char;
            if (this.firstOperand === null) {
                this.firstOperand = this.input.value;
            } else if (!this.waitingForSecondOperand) {
                this.eval();
            }
            this.waitingForSecondOperand = true;
        }
    }

    public eval() {
        let {firstOperand, operator} = this;
        let expression: string = `${firstOperand} ${operator} ${this.input.value}`;
        // let op = mapKeys[operator] === undefined ? operator : mapKeys[operator];
        this.input.value = this.firstOperand = this.operators[operator].calc(Number.parseFloat(firstOperand), Number.parseFloat(this.input.value));
        this.calcHistory.push({result: this.input.value, expression: expression});
        this.refreshHistory();
        this.waitingForSecondOperand = true;
    }
}

export class scientificCalculator extends calculator {
    constructor() {
        super();
    }
}