export class Calculator {
    // static log = document.querySelector('textarea');

    private static currentValue = '';
    private static firstOperand = '';
    private static secondOperand = '';
    private static operator = '';
    private static waitingForSecondOperand = false;
    // private static strInput = '';
    static result1 = 1;
    private static operators = [

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

    static reset(): void {

        this.currentValue = this.firstOperand = this.secondOperand = this.operator;
    }

    // The number of places to round to
    static roundPlaces = 5;

    // Get the operator object for a given operator ID
    static getOperator(opID) {
        for (let i = 0; i < this.operators.length; i++) {
            if (this.operators[i].id === opID) {
                return this.operators[i];
            }
        }
        return undefined;
    }

    // Get the precedence of an operator given its ID
    static getOpPrecedence(opID) {
        for (let i = 0; i < this.operators.length; i++) {
            if (this.operators[i].id === opID) {
                return i;
            }
        }

        // If the given ID does not return an operator, then return a large value that will always lose in precedence
        return 1000;
    }

    // Returns true if op1 ID has equal or higher precedence than op2 ID, false otherwise
    static hasPrecedence(op1, op2) {
        if (this.getOperator(op1) != undefined) {
            return this.getOpPrecedence(op1) <= this.getOpPrecedence(op2);
        }
    }

    // A list of every token (number or operator) currently in the expression
    static tokenList = [];

    // A list of previous results and expressions in the form {out: output, expression: expression string, tokens: list of tokens in the expression}
    static calcHistory = [];

    // Evaluates the expression and outputs the result
    static calculate() {

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

        // Output the calculated result and the original expression
        this.output(document.querySelector('input').value, valStack[0], this.tokenList);
    }

    // Returns the result of applying the given unary or binary operator on the top values of the value stack
    static applyOperator(operator, vals) {
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

    // Updates the equation and calc history with the given output
    static output(expression, out, tokens) {
        document.querySelector('input').value = out.toString();

        this.calcHistory.push({out: out, expression: expression, tokens: tokens});
        document.querySelectorAll('.calc-history-box').forEach(elem => elem.innerHTML = '');
        for (let i = this.calcHistory.length - 1; i >= 0; i--) {
            let list = document.querySelectorAll('.calc-history-box');
            let item1 = document.createElement("p");
            let item2 = document.createElement("p");
            item1.classList.add('calc-history-eq');
            item1.style.color = '#B0B0B0';
            item1.innerHTML = this.calcHistory[i].expression;
            item1.style.textAlign = 'left';
            item2.style.marginTop = '10px';
            item2.innerHTML = '=' + this.calcHistory[i].out;
            list[0].appendChild(item1)
            list[0].appendChild(item2)
        }
    }

    // Adds a token to the token list and updates the display
    static addToken(token) {
        if (isNaN(token)) {
            if (token === "num-pi" && !isNaN(this.tokenList[this.tokenList.length - 1])) {
                this.tokenList.push("op-multiply");
            }
            this.tokenList.push(token);
        } else {
            if (!isNaN(this.tokenList[this.tokenList.length - 1])) {
                this.tokenList[this.tokenList.length - 1] = this.tokenList[this.tokenList.length - 1] + token;
            } else {
                if (!isNaN(token) && this.tokenList[this.tokenList.length - 1] === "num-pi") {
                    this.tokenList.push("op-multiply");
                }
                this.tokenList.push(token);
            }
        }
        this.displayEquation();
    }

    // Updates the expression display's HTML
    static displayEquation() {
        let htmlString = "";
        for (let i = 0; i < this.tokenList.length; i++) {
            if (isNaN(this.tokenList[i])) {
                if (this.tokenList[i] === "num-pi") {
                    htmlString += " π ";
                } else {
                    htmlString += this.getOperator(this.tokenList[i]).symbol;
                }
            } else {
                htmlString += this.tokenList[i];
            }
        }
        document.querySelector('input').value = htmlString;
    }

    // Deletes the last entered token
    static deleteLast() {
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

    // Triggers the appropriate action for each button that can be pressed
    static processButton(button) {
        switch (button.id) {
            case "backspace":
                this.deleteLast();
                break;
            case "clear":
                if (this.tokenList.length === 0) {
                    this.calcHistory.length = 0;
                    document.querySelectorAll('.calc-history-box').forEach(elem => elem.innerHTML = '');
                } else {
                    this.tokenList.length = 0;
                    this.displayEquation();
                }
                break;
            case "period":
                if (isNaN(this.tokenList[this.tokenList.length - 1])) {
                    this.addToken("0.");
                } else {
                    if (this.tokenList[this.tokenList.length - 1].indexOf(".") === -1) {
                        this.tokenList[this.tokenList.length - 1] += ".";
                    }
                }
                this.displayEquation();
                break;
            case "equal":
                this.calculate();
                break;
            case "num-pi":
                this.addToken("num-pi");
                break;
            default:
                if (button.classList.contains("number")) {
                    this.addToken(button.innerHTML);
                } else {
                    this.addToken(button.id);
                }
        }
    }

    // public static scientificEval(char): void {
    //     // if (char == '=') {
    //     //     this.input.value = eval(this.strInput);
    //     //     this.log.value = this.log.value + '\n= ' + this.input.value + '\n' + this.input.value;
    //     //     this.log.rows += 2;
    //     // } else if (char == 'AC') {
    //     //     this.reset();
    //     //     this.waitingForSecondOperand = false;
    //     // } else if (this.isOperator(char)) {
    //     //     if (this.isOperator(this.strInput.slice(-1))) {
    //     //         this.strInput = this.strInput.slice(0, -1);
    //     //         this.log.value = this.log.value.slice(0, -1);
    //     //     }
    //     //     if (char == '÷') {
    //     //         this.operator = '/';
    //     //     } else if (char == '×') {
    //     //         this.operator = '*';
    //     //     } else {
    //     //         this.operator = char;
    //     //     }
    //     //     this.strInput += this.operator;
    //     //     this.log.value += this.operator;
    //     //     this.waitingForSecondOperand = true;
    //     // } else if (!isNaN(Number(char)) || '.') {
    //     //     this.strInput += char;
    //     //     this.log.value += char;
    //     //     if (this.waitingForSecondOperand) {
    //     //         this.input.value = eval(this.strInput);
    //     //     }
    //     // }
    //     // this.log.value = this.strInput
    // }

    // public static standardEval(char: string): void {
    //     if (char == '=') {
    //         this.input.value = eval(this.firstOperand + this.operator + this.secondOperand);
    //     } else if (char == 'AC') {
    //         this.reset();
    //         this.waitingForSecondOperand = false;
    //     } else if (this.isOperator(char)) {
    //         if (this.waitingForSecondOperand) {
    //             this.firstOperand = this.currentValue || this.firstOperand;
    //         }
    //         if (this.isOperator(this.strInput.slice(-1))) {
    //             this.strInput = this.strInput.slice(0, -1);
    //         }
    //         this.strInput += char;
    //         this.log.value = this.strInput;
    //         if (char == '÷') {
    //             this.operator = '/';
    //         } else if (char == '×') {
    //             this.operator = '*';
    //         } else {
    //             this.operator = char;
    //         }
    //         this.secondOperand = '';
    //         this.waitingForSecondOperand = true;
    //     } else if (!isNaN(Number(char)) || '.') {
    //         this.strInput += char;
    //         this.log.value = this.strInput;
    //         if (this.waitingForSecondOperand) {
    //             this.secondOperand += char;
    //             this.input.value = this.currentValue = eval(this.firstOperand + this.operator + this.secondOperand);
    //         } else {
    //             this.firstOperand += char;
    //         }
    //     }
    // }

    // static backSpace(): void {
    //     const newStrInput = this.strInput.slice(0, this.strInput.length - 1);
    //     this.reset();
    //     for (let i = 0; i < newStrInput.length; i++) {
    //         this.myEval(newStrInput[i])
    //     }
    // }
}