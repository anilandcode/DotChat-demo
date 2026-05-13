import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge editorial-label inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-none border border-transparent px-2.5 py-1 whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-[var(--black)] has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "border-[var(--black)] bg-[var(--black)] text-[var(--surface)]",
        secondary:
          "border-[var(--border)] bg-[var(--accent)] text-[var(--black)]",
        destructive:
          "border-red-700/30 bg-red-100 text-red-900",
        outline:
          "border-[var(--border)] bg-transparent text-[var(--muted)]",
        ghost:
          "text-[var(--foreground-2)] hover:bg-[color-mix(in_srgb,var(--foreground)_6%,transparent)]",
        link: "text-[var(--accent)] underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
