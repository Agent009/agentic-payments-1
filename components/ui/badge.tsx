import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";
import { useTheme } from "next-themes";

import { Tooltip } from "@/components/ui/tooltip.tsx";
import { cn, generateConsistentColor } from "@lib/utils.ts";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        consistent: "", // Empty variant for consistent coloring
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
  truncate?: boolean;
  useConsistentColor?: boolean;
}

function Badge({ className, variant, truncate = true, useConsistentColor = false, children, ...props }: BadgeProps) {
  const { resolvedTheme } = useTheme();
  // Generate consistent colors if enabled and we have string content
  const content = children?.toString() || "";
  const colors = useConsistentColor ? generateConsistentColor(content) : null;

  return (
    <Tooltip content={children}>
      <div
        className={cn(
          badgeVariants({ variant: useConsistentColor ? "consistent" : variant }),
          "transition-colors",
          truncate && "max-w-full",
          className,
        )}
        style={
          useConsistentColor
            ? {
                backgroundColor: colors?.[resolvedTheme === "dark" ? "dark" : "light"],
                color: resolvedTheme === "dark" ? "#fff" : "#000",
              }
            : undefined
        }
        {...props}
      >
        <span className={truncate ? "block truncate" : ""}>{children}</span>
      </div>
    </Tooltip>
  );
}

export { Badge, badgeVariants };
