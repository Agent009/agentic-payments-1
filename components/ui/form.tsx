import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button.tsx";

import { FormField } from "./form-field.tsx";

interface FormProps<T extends z.ZodType<never, never>> {
  schema: T;
  onSubmit: SubmitHandler<z.infer<T>>;
  children: React.ReactNode;
  submitText?: string;
  isSubmitting?: boolean;
}

export function Form<T extends z.ZodType<never, never>>({
  schema,
  onSubmit,
  children,
  submitText = "Submit",
  isSubmitting = false,
}: FormProps<T>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === FormField) {
          return React.cloneElement(child, {
            // @ts-expect-error ignore
            ...child.props,
            // @ts-expect-error ignore
            ...register(child.props.name),
            // @ts-expect-error ignore
            error: errors[child.props.name]?.message,
          });
        }
        return child;
      })}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : submitText}
      </Button>
    </form>
  );
}

export { FormField } from "./form-field.tsx";
