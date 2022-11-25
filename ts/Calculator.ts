export class Calculator {
    private static input = document.querySelector('input');
    private static history = document.querySelectorAll('.calc-history-box');
    // variables for standard calculate
    private static currentValue = '';
    private static firstOperand = '';
    private static secondOperand = '';
    private static operator = '';
    private static waitingForSecondOperand = false;
    private static expression = ''
    // all operators
    private static operators: { id: string, numOperands: number, symbol: string, calc: (a: number, b?: number) => number }[] = [

        {
            id: "op-factorial",
            numOperands: 1,
            symbol: "!",
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
        },
        {
            id: "op-negate",
            numOperands: 1,
            symbol: "-",
            calc: function (a) {
                return -a;
            }
        },
        {
            id: "op-squared",
            numOperands: 1,
            symbol: "^2",
            calc: function (a) {
                return Math.pow(a, 2);
            }
        },
        {
            id: "op-power",
            numOperands: 2,
            symbol: "^",
            calc: function (a, b) {
                return Math.pow(a, b);
            }
        },
        {
            id: "op-square-root",
            numOperands: 1,
            symbol: "√",
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
            symbol: "*",
            calc: function (a, b) {
                return a * b;
            }
        },
        {
            id: "op-modulo",
            numOperands: 2,
            symbol: "%",
            calc: function (a, b) {
                return a - b * Math.floor(a / b);
            }
        },
        {
            id: "op-divide",
            numOperands: 2,
            symbol: "/",
            calc: function (a, b) {
                return a / b;
            }
        },
        {
            id: "op-add",
            numOperands: 2,
            symbol: "+",
            calc: function (a, b) {
                return a + b;
            }
        },
        {
            id: "op-subtract",
            numOperands: 2,
            symbol: "-",
            calc: function (a, b) {
                return a - b;
            }
        }
    ];
    // The number of places to round to
    private static roundPlaces = 2;
    // A list of every token (number or operator) currently in the expression
    private static tokenList: any[] = [];
    // A list of previous results and expressions in the form {out: output, expression: expression string}
    private static calcHistory: { out: string, expression: string }[] = [];

    public static reset(): void {
        this.waitingForSecondOperand = false;
        this.tokenList.length = 0;
        this.expression = this.currentValue = this.firstOperand = this.secondOperand = this.operator = this.input.value = '';
    }

    /********************************
     * scientific calculate functions
     ********************************/
    /**
     * Get the operator object for a given operator ID
     * @param opID
     * @private
     */
    private static getOperator(opID: string) {
        for (let i = 0; i < this.operators.length; i++) {
            if (this.operators[i].id === opID) {
                return this.operators[i];
            }
        }
        return undefined;
    }

    /**
     * Get the precedence of an operator given its ID
     * @param opID
     * @private
     */
    private static getOpPrecedence(opID: string): number {
        for (let i = 0; i < this.operators.length; i++) {
            if (this.operators[i].id === opID) {
                return i;
            }
        }
        // If the given ID does not return an operator, then return a large value that will always lose in precedence
        return 1000;
    }

    /**
     * Returns true if op1 ID has equal or higher precedence than op2 ID, false otherwise
     * @param op1
     * @param op2
     * @private
     */
    private static hasPrecedence(op1: string, op2: string): boolean {
        if (this.getOperator(op1) != undefined) {
            return this.getOpPrecedence(op1) <= this.getOpPrecedence(op2);
        }
    }

    /**
     * Evaluates the expression and outputs the result
     * @private
     */
    private static scientificCalculate(): void {
        // Evaluate the expression using a modified version of the shunting yard algorithm
        let valStack = [];
        let opStack = [];
        for (let i = 0; i < this.tokenList.length; i++) {
            if (!isNaN(this.tokenList[i])) {
                valStack.push(this.tokenList[i]);
            } else if (this.tokenList[i] === "num-pi") {
                valStack.push(Math.PI);
            } else {
                while (opStack.length > 0 && this.hasPrecedence(opStack[opStack.length - 1], this.tokenList[i])) {
                    let operator = this.getOperator(opStack.pop());
                    if (operator.numOperands === 1)
                        valStack.push(this.applyOperator(operator, [valStack.pop()]));
                    else
                        valStack.push(this.applyOperator(operator, [valStack.pop(), valStack.pop()]));
                }
                opStack.push(this.tokenList[i]);
            }
        }
        while (opStack.length > 0) {
            let operator = this.getOperator(opStack.pop());
            if (operator.numOperands === 1)
                valStack.push(this.applyOperator(operator, [valStack.pop()]));
            else
                valStack.push(this.applyOperator(operator, [valStack.pop(), valStack.pop()]));
        }

        // Output the calculated result and the original expression in the history
        this.output(this.input.value, valStack[0]);
    }

    /**
     * Returns the result of applying the given unary or binary operator on the top values of the value stack
     */
    private static applyOperator(operator, vals: string[]): number {
        let valA = vals[0];
        let result;
        if (vals.length === 1) {
            result = operator.calc(parseFloat(valA));
        } else {
            let valB = vals[1];
            result = operator.calc(parseFloat(valB), parseFloat(valA));
        }
        return result;
    }

    /**
     * Adds a token to the token list and updates the display
     * @param token
     * @private
     */
    private static addToken(token): void {
        if (isNaN(token)) {
            //for expression like 3pi
            if (token === "num-pi" && !isNaN(this.tokenList[this.tokenList.length - 1])) {
                this.tokenList.push("op-multiply");
            } else if (this.getOperator(token) && this.getOperator(this.tokenList[this.tokenList.length - 1])) {
                this.tokenList.pop();
            }
            this.tokenList.push(token);
        } else {
            if (!isNaN(this.tokenList[this.tokenList.length - 1])) {
                this.tokenList[this.tokenList.length - 1] = this.tokenList[this.tokenList.length - 1] + token;
            } else {
                //for expression like pi3
                if (!isNaN(token) && this.tokenList[this.tokenList.length - 1] === "num-pi") {
                    this.tokenList.push("op-multiply");
                }
                this.tokenList.push(token);
            }
        }
        this.displayEquation();
    }


    /**
     * Updates the input
     * @private
     */
    private static displayEquation(): void {
        let htmlString = "";
        for (let i = 0; i < this.tokenList.length; i++) {
            if (isNaN(this.tokenList[i])) {
                if (this.tokenList[i] === "num-pi") {
                    htmlString += "π";
                } else {
                    htmlString += this.getOperator(this.tokenList[i]).symbol;
                }
            } else {
                htmlString += this.tokenList[i];
            }
        }
        this.input.value = htmlString;
    }

    /**
     * Deletes the last entered token
     */
    private static deleteLast(): void {
        if (isNaN(this.tokenList[this.tokenList.length - 1])) {
            this.tokenList.pop();
        } else {
            this.tokenList[this.tokenList.length - 1] = this.tokenList[this.tokenList.length - 1].slice(0, -1);
            if (this.tokenList[this.tokenList.length - 1].length === 0) {
                this.tokenList.pop();
            }
        }
        this.displayEquation();
    }

    /******************************
     * standard calculate functions
     ******************************/
    /**
     * return true if cher is operator
     * @param char
     * @private
     */
    private static isOperator(char: string): boolean {
        return char == '+' || char == '-' || char == '×' || char == '÷';
    }

    /**
     * Evaluates the expression and outputs the result in the input field
     * @param char
     * @private
     */
    private static standardCalculate(char: string): void {
        if (char == '=') {
            let out = eval(this.firstOperand + this.operator + this.secondOperand);
            this.output(this.expression, out)
        } else if (this.isOperator(char)) {
            if (this.waitingForSecondOperand) {
                this.firstOperand = this.currentValue || this.firstOperand;
            }
            if (this.isOperator(this.expression.slice(-1))) {
                this.expression = this.expression.slice(0, -1);
            }
            if (char == '÷') {
                this.operator = '/';
            } else if (char == '×') {
                this.operator = '*';
            } else {
                this.operator = char;
            }
            this.expression += this.operator;
            this.secondOperand = '';
            this.waitingForSecondOperand = true;
        } else if (!isNaN(Number(char)) || '.') {
            this.expression += char;
            if (this.waitingForSecondOperand) {
                this.secondOperand += char;
                this.input.value = this.currentValue = eval(this.firstOperand + this.operator + this.secondOperand);
            } else {
                this.firstOperand += char;
            }
        }
    }

    /**
     * Deletes the last entered char and calculate again as the enter input
     */
    private static backSpace(): void {
        const newStrInput = this.expression.slice(0, this.expression.length - 1);
        this.reset();
        for (let i = 0; i < newStrInput.length; i++) {
            this.standardCalculate(newStrInput[i])
        }
    }

    /***************************
     *both functions calculators
     **************************/
    /**
     * Updates the equation and calc history
     * @param expression
     * @param out
     */
    public static output(expression: string, out) {
        if (!Number.isInteger(out)) {
            out = out.toFixed(this.roundPlaces);
        }
        this.input.value = out.toString();
        this.calcHistory.push({out: out, expression: expression});
        this.history.forEach(elem => elem.innerHTML = '');
        for (let i = this.calcHistory.length - 1; i >= 0; i--) {
            let list = this.history;
            let item1 = document.createElement("div");
            let item2 = document.createElement("div");
            item1.classList.add('calc-history-eq');
            item1.innerHTML = this.calcHistory[i].expression;
            item1.style.textAlign = 'left';
            item2.classList.add('calc-history-eq');
            item2.innerHTML = `= ${this.calcHistory[i].out} <hr>`;
            list[0].appendChild(item1)
            list[0].appendChild(item2)
        }
    }

    /**
     * Triggers the appropriate action for each button that can be pressed be the current mode of the calculator
     * @param button
     * @param scientificMode
     * @param remoteLocation
     */
    public static processButton(button: Element, scientificMode: boolean, remoteLocation: boolean) {
        switch (button.id) {
            case "backspace":
                if (scientificMode || remoteLocation) {
                    this.deleteLast();
                } else {
                    this.backSpace();
                }
                break;
            case "clear":
                if (scientificMode || remoteLocation) {
                    if (this.tokenList.length === 0) {
                        this.calcHistory.length = 0;
                        this.history.forEach(elem => elem.innerHTML = '');
                    }
                } else {
                    if (this.expression === '') {
                        this.calcHistory.length = 0;
                        this.history.forEach(elem => elem.innerHTML = '');
                    }
                    this.displayEquation();

                }
                break;
            case "period":
                if (scientificMode || remoteLocation) {
                    if (isNaN(this.tokenList[this.tokenList.length - 1])) {
                        this.addToken("0.");
                    } else {
                        if (this.tokenList[this.tokenList.length - 1].indexOf(".") === -1) {
                            this.tokenList[this.tokenList.length - 1] += ".";
                        }
                    }
                    this.displayEquation();
                } else {
                    this.standardCalculate(button.innerHTML)
                }
                break;
            case "equal":
                if (!remoteLocation) {
                    if (scientificMode) {
                        this.scientificCalculate();
                    } else {
                        this.standardCalculate(button.innerHTML);
                    }
                }
                break;
            default:
                if (scientificMode || remoteLocation) {
                    if (button.classList.contains("number")) {
                        this.addToken(button.innerHTML);
                    } else {
                        this.addToken(button.id);
                    }
                } else {
                    this.standardCalculate(button.innerHTML)
                }
        }
    }
}