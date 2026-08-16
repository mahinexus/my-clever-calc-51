import { useState, useCallback } from "react";

export type Operator = "+" | "-" | "×" | "÷" | null;

export interface HistoryEntry {
  expression: string;
  result: string;
}

interface CalculatorState {
  display: string;
  previousValue: string;
  operator: Operator;
  waitingForOperand: boolean;
  history: HistoryEntry[];
}

const MAX_DIGITS = 16;

const formatNumber = (num: string): string => {
  if (num === "Error") return num;
  if (num.length > MAX_DIGITS) {
    const n = Number(num);
    if (Number.isFinite(n)) {
      return n.toExponential(MAX_DIGITS - 6);
    }
    return "Error";
  }
  return num;
};

const calculate = (left: number, right: number, operator: Operator): string => {
  let result: number;
  switch (operator) {
    case "+":
      result = left + right;
      break;
    case "-":
      result = left - right;
      break;
    case "×":
      result = left * right;
      break;
    case "÷":
      if (right === 0) return "Error";
      result = left / right;
      break;
    default:
      return String(right);
  }

  if (!Number.isFinite(result)) return "Error";

  const formatted = parseFloat(result.toPrecision(MAX_DIGITS)).toString();
  return formatNumber(formatted);
};

export function useCalculator() {
  const [state, setState] = useState<CalculatorState>({
    display: "0",
    previousValue: "",
    operator: null,
    waitingForOperand: false,
    history: [],
  });

  const inputDigit = useCallback((digit: string) => {
    setState((prev) => {
      if (prev.waitingForOperand) {
        return {
          ...prev,
          display: digit,
          waitingForOperand: false,
        };
      }

      if (prev.display === "0") {
        return { ...prev, display: digit };
      }

      if (prev.display.replace(/[.-]/g, "").length >= MAX_DIGITS) {
        return prev;
      }

      return { ...prev, display: prev.display + digit };
    });
  }, []);

  const inputDecimal = useCallback(() => {
    setState((prev) => {
      if (prev.waitingForOperand) {
        return { ...prev, display: "0.", waitingForOperand: false };
      }
      if (prev.display.includes(".")) return prev;
      return { ...prev, display: prev.display + "." };
    });
  }, []);

  const clear = useCallback(() => {
    setState({
      display: "0",
      previousValue: "",
      operator: null,
      waitingForOperand: false,
      history: state.history,
    });
  }, [state.history]);

  const clearAll = useCallback(() => {
    setState({
      display: "0",
      previousValue: "",
      operator: null,
      waitingForOperand: false,
      history: [],
    });
  }, []);

  const toggleSign = useCallback(() => {
    setState((prev) => {
      if (prev.display === "0" || prev.display === "Error") return prev;
      return {
        ...prev,
        display: prev.display.startsWith("-")
          ? prev.display.slice(1)
          : "-" + prev.display,
      };
    });
  }, []);

  const percentage = useCallback(() => {
    setState((prev) => {
      const value = Number(prev.display);
      if (Number.isNaN(value)) return prev;
      return {
        ...prev,
        display: formatNumber(String(value / 100)),
        waitingForOperand: true,
      };
    });
  }, []);

  const performOperation = useCallback((nextOperator: Operator) => {
    setState((prev) => {
      const currentValue = prev.display;

      if (prev.operator && !prev.waitingForOperand) {
        const result = calculate(
          Number(prev.previousValue),
          Number(currentValue),
          prev.operator
        );

        return {
          ...prev,
          display: result,
          previousValue: result,
          operator: nextOperator,
          waitingForOperand: true,
        };
      }

      return {
        ...prev,
        previousValue: currentValue,
        operator: nextOperator,
        waitingForOperand: true,
      };
    });
  }, []);

  const equals = useCallback(() => {
    setState((prev) => {
      if (!prev.operator || prev.waitingForOperand) return prev;

      const result = calculate(
        Number(prev.previousValue),
        Number(prev.display),
        prev.operator
      );

      const expression = `${prev.previousValue} ${prev.operator} ${prev.display}`;
      const newEntry: HistoryEntry = {
        expression,
        result,
      };

      return {
        ...prev,
        display: result,
        previousValue: "",
        operator: null,
        waitingForOperand: true,
        history: [newEntry, ...prev.history].slice(0, 20),
      };
    });
  }, []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const key = event.key;

      if (/^[0-9]$/.test(key)) {
        event.preventDefault();
        inputDigit(key);
      } else if (key === "." || key === ",") {
        event.preventDefault();
        inputDecimal();
      } else if (key === "+") {
        event.preventDefault();
        performOperation("+");
      } else if (key === "-") {
        event.preventDefault();
        performOperation("-");
      } else if (key === "*") {
        event.preventDefault();
        performOperation("×");
      } else if (key === "/") {
        event.preventDefault();
        performOperation("÷");
      } else if (key === "Enter" || key === "=") {
        event.preventDefault();
        equals();
      } else if (key === "Escape" || key === "c" || key === "C") {
        event.preventDefault();
        clear();
      } else if (key === "Backspace") {
        event.preventDefault();
        setState((prev) => {
          if (prev.display === "Error" || prev.waitingForOperand) return prev;
          if (prev.display.length === 1 || (prev.display.length === 2 && prev.display.startsWith("-"))) {
            return { ...prev, display: "0" };
          }
          return { ...prev, display: prev.display.slice(0, -1) };
        });
      } else if (key === "%") {
        event.preventDefault();
        percentage();
      }
    },
    [inputDigit, inputDecimal, performOperation, equals, clear, percentage]
  );

  return {
    display: state.display,
    previousValue: state.previousValue,
    operator: state.operator,
    history: state.history,
    inputDigit,
    inputDecimal,
    clear,
    clearAll,
    toggleSign,
    percentage,
    performOperation,
    equals,
    handleKeyDown,
  };
}
