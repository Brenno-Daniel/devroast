"use client";

import { Switch } from "@base-ui/react/switch";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { useId } from "react";
import { tv } from "tailwind-variants";
import { cn } from "@/lib/cn";

const rootVariants = tv({
  base: "group peer relative inline-flex h-[22px] w-10 shrink-0 cursor-pointer items-center rounded-full bg-[#2A2A2A] p-[3px] transition-colors data-[checked]:bg-emerald-500 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
});

const thumbVariants = tv({
  base: "pointer-events-none block size-4 rounded-full bg-[#6B7280] shadow-sm transition-[transform,background-color] duration-200 ease-out will-change-transform group-data-[checked]:translate-x-[18px] group-data-[checked]:bg-[#0A0A0A]",
});

export type SwitchRootProps = ComponentPropsWithoutRef<typeof Switch.Root>;

export type SwitchFieldProps = SwitchRootProps & {
  /** Visible label (e.g. roast mode). */
  label?: ReactNode;
};

/**
 * Base UI Switch with Pencil-sized track/thumb. Optional label uses peer styling for checked color.
 */
export function SwitchField({
  className,
  label,
  id: idProp,
  ...rest
}: SwitchFieldProps) {
  const autoId = useId();
  const fieldId = idProp ?? autoId;

  const control = (
    <Switch.Root
      className={(state) =>
        cn(
          rootVariants(),
          typeof className === "function" ? className(state) : className,
        )
      }
      id={fieldId}
      {...rest}
    >
      <Switch.Thumb className={thumbVariants()} />
    </Switch.Root>
  );

  if (label === undefined) {
    return control;
  }

  return (
    <div className="inline-flex items-center gap-3">
      {control}
      <label
        className="cursor-pointer font-mono text-muted-foreground text-xs select-none peer-data-[checked]:text-emerald-500"
        htmlFor={fieldId}
      >
        {label}
      </label>
    </div>
  );
}

export { Switch };
