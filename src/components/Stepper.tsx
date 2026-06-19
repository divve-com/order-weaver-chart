import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StepperStep {
  label: string;
}

interface StepperProps {
  steps: StepperStep[];
  /** 1-based index of the current step. Steps before are completed. */
  current: number;
  className?: string;
}

export function Stepper({ steps, current, className }: StepperProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-y-3", className)}>
      {steps.map((step, i) => {
        const num = i + 1;
        const completed = num < current;
        const active = num === current;
        const done = completed || active;
        return (
          <div key={step.label} className="flex items-center">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                done
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {completed ? <Check className="h-4 w-4" /> : num}
            </div>
            <span
              className={cn(
                "ml-2 text-sm",
                done ? "font-medium text-foreground" : "text-muted-foreground",
              )}
            >
              {step.label}
            </span>
            {i < steps.length - 1 && (
              <div className="mx-3 h-px w-8 bg-border" />
            )}
          </div>
        );
      })}
    </div>
  );
}