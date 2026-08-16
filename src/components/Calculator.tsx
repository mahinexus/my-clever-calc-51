import { useCalculator, type Operator } from "@/hooks/use-calculator";
import { cn } from "@/lib/utils";
import { History, Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";

interface KeyProps {
  label: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "primary" | "secondary" | "accent" | "danger";
  className?: string;
  ariaLabel?: string;
}

function Key({
  label,
  onClick,
  variant = "default",
  className,
  ariaLabel,
}: KeyProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        "relative flex h-14 items-center justify-center rounded-2xl text-xl font-semibold shadow-sm transition-all duration-75 active:scale-95 active:shadow-inner",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        variant === "default" &&
          "bg-[#d4d4d2] text-[#1c1c1c] hover:bg-[#c8c8c6] dark:bg-[#505050] dark:text-[#f5f5f5] dark:hover:bg-[#606060]",
        variant === "primary" &&
          "bg-[#ff9500] text-white hover:bg-[#e68600] dark:bg-[#ff9500] dark:hover:bg-[#e68600]",
        variant === "secondary" &&
          "bg-[#a5a5a5] text-[#1c1c1c] hover:bg-[#9a9a9a] dark:bg-[#636366] dark:text-[#f5f5f5] dark:hover:bg-[#74747a]",
        variant === "accent" &&
          "bg-[#4b4b4b] text-[#f5f5f5] hover:bg-[#3a3a3a] dark:bg-[#3a3a3c] dark:hover:bg-[#2c2c2e]",
        variant === "danger" &&
          "bg-[#ff453a] text-white hover:bg-[#e03d33] dark:bg-[#ff453a] dark:hover:bg-[#e03d33]",
        className
      )}
    >
      {label}
    </button>
  );
}

export function Calculator() {
  const {
    display,
    previousValue,
    operator,
    history,
    inputDigit,
    inputDecimal,
    clear,
    clearAll,
    toggleSign,
    percentage,
    performOperation,
    equals,
    handleKeyDown,
  } = useCalculator();

  const displayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = displayRef.current;
    if (!el) return;
    // Auto-scroll to the right when the display grows
    el.scrollLeft = el.scrollWidth;
  }, [display]);

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-background p-4 sm:p-8"
      onKeyDown={handleKeyDown}
      role="application"
      aria-label="Calculator"
      tabIndex={0}
    >
      <div className="flex w-full max-w-4xl flex-col gap-6 lg:flex-row lg:items-start">
        {/* Calculator body */}
        <div className="mx-auto w-full max-w-[360px] overflow-hidden rounded-[2.5rem] border border-border bg-card p-5 shadow-2xl">
          {/* Display */}
          <div className="mb-4 flex flex-col justify-end rounded-3xl bg-[#1c1c1c] p-5 text-right text-white dark:bg-[#0f0f10]">
            <div className="h-6 text-sm font-medium text-[#a5a5a5]" aria-live="polite">
              {previousValue && operator
                ? `${previousValue} ${operator}`
                : "\u00A0"}
            </div>
            <div
              ref={displayRef}
              className="mt-1 overflow-x-auto whitespace-nowrap text-5xl font-light tracking-tight scrollbar-hide"
              aria-live="assertive"
            >
              {display}
            </div>
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-4 gap-3">
            <Key
              label="AC"
              onClick={clear}
              variant="secondary"
              ariaLabel="Clear all"
            />
            <Key
              label="+/-"
              onClick={toggleSign}
              variant="secondary"
              ariaLabel="Toggle sign"
            />
            <Key
              label="%"
              onClick={percentage}
              variant="secondary"
              ariaLabel="Percentage"
            />
            <Key
              label="÷"
              onClick={() => performOperation("÷")}
              variant="primary"
              ariaLabel="Divide"
              className={operator === "÷" ? "ring-2 ring-white/60" : ""}
            />

            <Key label="7" onClick={() => inputDigit("7")} variant="default" />
            <Key label="8" onClick={() => inputDigit("8")} variant="default" />
            <Key label="9" onClick={() => inputDigit("9")} variant="default" />
            <Key
              label="×"
              onClick={() => performOperation("×")}
              variant="primary"
              ariaLabel="Multiply"
              className={operator === "×" ? "ring-2 ring-white/60" : ""}
            />

            <Key label="4" onClick={() => inputDigit("4")} variant="default" />
            <Key label="5" onClick={() => inputDigit("5")} variant="default" />
            <Key label="6" onClick={() => inputDigit("6")} variant="default" />
            <Key
              label="-"
              onClick={() => performOperation("-")}
              variant="primary"
              ariaLabel="Subtract"
              className={operator === "-" ? "ring-2 ring-white/60" : ""}
            />

            <Key label="1" onClick={() => inputDigit("1")} variant="default" />
            <Key label="2" onClick={() => inputDigit("2")} variant="default" />
            <Key label="3" onClick={() => inputDigit("3")} variant="default" />
            <Key
              label="+"
              onClick={() => performOperation("+")}
              variant="primary"
              ariaLabel="Add"
              className={operator === "+" ? "ring-2 ring-white/60" : ""}
            />

            <Key
              label="0"
              onClick={() => inputDigit("0")}
              variant="default"
              className="col-span-2"
            />
            <Key
              label="."
              onClick={inputDecimal}
              variant="default"
              ariaLabel="Decimal point"
            />
            <Key
              label="="
              onClick={equals}
              variant="primary"
              ariaLabel="Equals"
            />
          </div>
        </div>

        {/* History panel */}
        <div className="mx-auto w-full max-w-[360px] flex-1 rounded-[2.5rem] border border-border bg-card p-6 shadow-xl lg:mx-0">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-foreground">
              <History className="h-5 w-5" />
              <h2 className="font-semibold">History</h2>
            </div>
            {history.length > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
                aria-label="Clear history"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-center text-muted-foreground">
              <History className="h-8 w-8 opacity-40" />
              <p className="text-sm">No calculations yet.</p>
            </div>
          ) : (
            <ul className="flex max-h-[420px] flex-col gap-3 overflow-y-auto pr-1">
              {history.map((entry, index) => (
                <li
                  key={index}
                  className="rounded-2xl border border-border bg-background p-3 text-right transition-colors hover:bg-accent/50"
                >
                  <div className="text-xs text-muted-foreground">
                    {entry.expression}
                  </div>
                  <div className="text-lg font-semibold text-foreground">
                    = {entry.result}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
