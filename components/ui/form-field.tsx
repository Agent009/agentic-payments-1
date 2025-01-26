import React from "react";

import { cn } from "@lib/utils";
import { Input } from "@ui/input";
import { Label } from "@ui/label";
import { Select } from "@ui/select";
import { Textarea } from "@ui/textarea";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> {
  label: string;
  name: string;
  error?: string;
  textarea?: boolean;
  select?: boolean;
  children?: React.ReactNode;
}

export function FormField({
  label,
  name,
  error,
  textarea = false,
  select = false,
  children,
  className,
  ...props
}: FormFieldProps) {
  // @ts-expect-error ignore
  let InputComponent: React.ComponentType<unknown> = Input;

  if (textarea) {
    // @ts-expect-error ignore
    InputComponent = Textarea;
  } else if (select) {
    // @ts-expect-error ignore
    InputComponent = Select;
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      {/* @ts-expect-error ignore */}
      <InputComponent id={name} name={name} className={cn(error && "border-red-500", className)} {...props}>
        {children}
      </InputComponent>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
