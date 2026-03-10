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
