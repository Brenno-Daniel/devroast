"use client";

import { Switch } from "@base-ui/react/switch";
import {
  type ComponentPropsWithoutRef,
  createContext,
  useContext,
  useId,
  useMemo,
} from "react";
import { tv } from "tailwind-variants";
import { cn } from "@/lib/cn";

const rootVariants = tv({
  base: "group peer relative inline-flex h-[22px] w-10 shrink-0 cursor-pointer items-center rounded-full bg-[#2A2A2A] p-[3px] transition-colors data-[checked]:bg-emerald-500 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
});

const thumbVariants = tv({
  base: "pointer-events-none block size-4 rounded-full bg-[#6B7280] shadow-sm transition-[transform,background-color] duration-200 ease-out will-change-transform group-data-[checked]:translate-x-[18px] group-data-[checked]:bg-[#0A0A0A]",
});

type SwitchFieldContextValue = {
  controlId: string;
};

const SwitchFieldContext = createContext<SwitchFieldContextValue | null>(null);

function useSwitchFieldContext(component: string) {
  const ctx = useContext(SwitchFieldContext);
  if (!ctx) {
    throw new Error(`${component} must be used within SwitchFieldRoot`);
  }
  return ctx;
}

export type SwitchFieldRootProps = ComponentPropsWithoutRef<"div">;

export function SwitchFieldRoot({
  className,
  children,
  ...props
}: SwitchFieldRootProps) {
  const controlId = useId();
  const value = useMemo(() => ({ controlId }), [controlId]);

  return (
    <SwitchFieldContext.Provider value={value}>
      <div
        className={cn("inline-flex items-center gap-3", className)}
        {...props}
      >
        {children}
      </div>
    </SwitchFieldContext.Provider>
  );
}

export type SwitchFieldControlProps = ComponentPropsWithoutRef<
  typeof Switch.Root
>;

export function SwitchFieldControl({
  className,
  id: idProp,
  ...rest
}: SwitchFieldControlProps) {
  const { controlId } = useSwitchFieldContext("SwitchFieldControl");

  return (
    <Switch.Root
      className={(state) =>
        cn(
          rootVariants(),
          typeof className === "function" ? className(state) : className,
        )
      }
      id={idProp ?? controlId}
      {...rest}
    >
      <Switch.Thumb className={thumbVariants()} />
    </Switch.Root>
  );
}

export type SwitchFieldLabelProps = ComponentPropsWithoutRef<"label">;

export function SwitchFieldLabel({
  className,
  htmlFor: htmlForProp,
  ...rest
}: SwitchFieldLabelProps) {
  const { controlId } = useSwitchFieldContext("SwitchFieldLabel");

  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: htmlFor matches SwitchFieldControl id from context
    <label
      className={cn(
        "cursor-pointer font-mono text-muted-foreground text-xs select-none peer-data-[checked]:text-emerald-500",
        className,
      )}
      htmlFor={htmlForProp ?? controlId}
      {...rest}
    />
  );
}

export { Switch };
