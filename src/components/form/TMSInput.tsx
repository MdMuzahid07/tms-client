"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

interface TMSInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  size?: "sm" | "md" | "lg";
  labelIcon?: React.ReactNode;
  startIcon?: React.ReactNode;
  helperText?: string;
}

/**
 * Senior-level Form Input component.
 * Features robust error handling, accessible labels, and refined operational sizing.
 */
export default function TMSInput({
  name,
  label,
  size = "md",
  labelIcon,
  startIcon,
  required,
  className,
  helperText,
  ...props
}: TMSInputProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];
  const hasError = !!error;

  const sizeStyles = {
    sm: "h-8 text-[11px] px-2",
    md: "h-9 text-sm px-3",
    lg: "h-11 text-base px-4",
  };

  return (
    <div className={cn("w-full flex flex-col gap-1.5", className)}>
      {label && (
        <div className="flex items-center justify-between">
          <Label 
            htmlFor={name} 
            className={cn(
              "text-[12px] font-bold uppercase tracking-wider transition-colors",
              hasError ? "text-destructive" : "text-muted-foreground"
            )}
          >
            <span className="flex items-center gap-1.5">
              {labelIcon && <span className="opacity-70">{labelIcon}</span>}
              {label}
              {required && <span className="text-destructive">*</span>}
            </span>
          </Label>
        </div>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="relative flex items-center">
            {startIcon && (
              <div className="absolute left-4 z-10 pointer-events-none opacity-50 group-focus-within:opacity-100 transition-opacity">
                {startIcon}
              </div>
            )}
            <Input
              {...field}
              {...props}
              id={name}
              className={cn(
                "bg-background transition-all duration-200 border-slate-200 dark:border-slate-800",
                "focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary",
                sizeStyles[size],
                startIcon && "pl-11",
                hasError && "border-destructive focus-visible:ring-destructive focus-visible:border-destructive",
                props.disabled && "opacity-50 grayscale"
              )}
              value={field.value ?? ""}
            />
          </div>
        )}
      />

      {hasError ? (
        <span className="flex items-center gap-1 text-[11px] font-bold text-destructive animate-in fade-in slide-in-from-top-1 px-1">
          <AlertCircle size={10} />
          {error.message as string}
        </span>
      ) : helperText ? (
        <span className="text-[10px] text-muted-foreground px-1">{helperText}</span>
      ) : null}
    </div>
  );
}
