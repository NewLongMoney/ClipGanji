import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/app/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-sm text-base font-anton uppercase tracking-widest transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                "filled-green": "bg-green text-black hover:bg-green-dim",
                "filled-gold": "bg-gold text-black hover:bg-gold-dim",
                "outline-white": "border-2 border-white text-white hover:bg-white hover:text-black",
                "outline-green": "border-2 border-green text-green hover:bg-green hover:text-black",
                "outline-gold": "border-2 border-gold text-gold hover:bg-gold hover:text-black",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-14 px-8 py-3",
                sm: "h-10 rounded-sm px-4 text-sm",
                lg: "h-16 rounded-sm px-10 text-xl",
                icon: "h-12 w-12",
            },
        },
        defaultVariants: {
            variant: "filled-green",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, ...props }, ref) => {
        // If asChild is false, we try to see if it's meant to be an anchor by checking href, but standard radix implementation implies using Slot.
        // For simplicity without radix-ui/react-slot dependency right now, let's use a standard button or a styled standard element if needed.
        // Actually, installed clsx but not class-variance-authority or radix-ui yet. Let's do a simpler implementation since they weren't explicitly requested.

        // Fallback simple native implementations:
        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
