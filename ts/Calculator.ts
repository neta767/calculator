// remote->pi,pow()
const digit = '0123456789';
const standardOperator = '+-÷×';
const input = document.getElementById('calculator-screen') as HTMLInputElement;
const historyLog = document.querySelectorAll('.calc-history-log');
// const mapKeys = {
//     '÷': '/',
//     '×': '*',
// }

export class Calculator {
    private operator: string | null;
    private firstOperand: string | null;
    //  secondOperand: string | null;
    private waitingForSecondOperand: boolean;
    private calcHistory: { result: string, expression: string }[];

    //
    constructor() {
        this.operator = null;
        this.firstOperand = null;
        this.waitingForSecondOperand = false;
        this.calcHistory = [];
    }

    // all operators
    // {id: string, numOperands: number, calc: (a: number, b?: number) => number}
    private operators = {
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

    public reset(): void {
        this.operator = null;
        this.firstOperand = null;
        this.waitingForSecondOperand = false;
        this.calcHistory = [];
        input.value = '0';
    }

    public clearLogHistory(): void {
        historyLog.forEach(elem => elem.innerHTML = '');
        let item = document.createElement('div');
        item.innerHTML = "There's no history yet";
        historyLog[0].appendChild(item);
    }

    public clearCalHistory(): void {
        this.calcHistory = [];
        this.clearLogHistory();
    }

    public processButtonStandard(char: string) {
        // switch (char) {
        //     case 'Backspace':
        //         //
        //         break;
        if (digit.includes(char)) {
            if (this.waitingForSecondOperand) {
                input.value = char;
                this.waitingForSecondOperand = false;
            } else {
                input.value = input.value === '0' ? char : input.value + char;
            }
        } else if (char == '.') {
            if (!input.value.includes('.')) {
                input.value += '.';
            }
        } else if (standardOperator.includes(char)) {
            this.operator = char;
            if (this.firstOperand === null) {
                this.firstOperand = input.value;
            } else if (!this.waitingForSecondOperand) {
                this.evalStandard();
            }
            this.waitingForSecondOperand = true;
        }
    }

    private refreshHistory() {
        historyLog.forEach(elem => elem.innerHTML = '');
        for (let i = this.calcHistory.length - 1; i >= 0; i--) {
            let expression = document.createElement('div');
            let result = document.createElement('div');
            expression.classList.add('calc-history-eq');
            expression.innerHTML = `${this.calcHistory[i].expression} =`;
            result.classList.add('calc-history-res');
            result.innerHTML = `${this.calcHistory[i].result} <hr>`;
            historyLog[0].appendChild(expression)
            historyLog[0].appendChild(result)
        }
    }

    public evalStandard() {
        let {firstOperand, operator} = this;
        let expression: string = `${firstOperand} ${operator} ${input.value}`;
        // let op = mapKeys[operator] === undefined ? operator : mapKeys[operator];
        input.value = this.firstOperand = this.operators[operator].calc(Number.parseFloat(firstOperand), Number.parseFloat(input.value));
        this.calcHistory.push({result: input.value, expression: expression});
        this.refreshHistory();
        this.waitingForSecondOperand = true;
    }
}