"use client";

import { type TextareaHTMLAttributes, type Ref, ReactNode, useId } from "react";
import { cn } from "@/utils/classNames";

const textareaBaseClass =
  "w-full rounded-lg border border-[#ead9b0] bg-white px-4 py-2 text-sm text-[#1a1a1a] transition-all scrollbar " +
  "focus:outline-none focus:ring-2 focus:ring-[#c6a15b]/40 focus:border-[#c6a15b] disabled:cursor-not-allowed disabled:opacity-50 " +
  "placeholder:text-[#8a7560] placeholder:font-normal ";

const resizeClassNames = {
  none: "resize-none",
  vertical: "resize-y",
  horizontal: "resize-x",
  both: "resize",
} as const;

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "children"> {
  label?: ReactNode;
  labelClassName?: string;
  error?: string;
  fullWidth?: boolean;
  containerClassName?: string;
  /** Default `none`. Use `vertical` to allow height resize via drag handle. */
  resize?: keyof typeof resizeClassNames;
  ref?: Ref<HTMLTextAreaElement>;
}

const Textarea = ({
  className,
  label,
  labelClassName,
  error,
  fullWidth,
  containerClassName,
  resize = "none",
  id,
  rows = 4,
  ref,
  ...props
}: TextareaProps) => {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5",
        fullWidth && "w-full",
        containerClassName
      )}
    >
      {label ? (
        <label
          htmlFor={textareaId}
          className={cn("text-[#a6853d] font-semibold text-xs", labelClassName)}
        >
          {label}
        </label>
      ) : null}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        className={cn(
          textareaBaseClass,
          resizeClassNames[resize],
          error
            ? "border-[#d42027]/80 focus:border-[#d42027] focus:ring-[#d42027]/40"
            : undefined,
          className
        )}
        {...props}
      />
      {error ? <p className="text-xs font-semibold text-[#d42027]">{error}</p> : null}
    </div>
  );
};

Textarea.displayName = "Textarea";

export { Textarea };
