export type State = {
    operator: string | null;
    firstOperand: string | null;
    // secondOperand: string | null;
    waitingForSecondOperand: boolean;
    calcHistory?: { result: string, expression: string }[];
};
