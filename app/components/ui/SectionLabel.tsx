import { cn } from "@/app/lib/utils"

interface SectionLabelProps {
    text: string
    className?: string
}

export function SectionLabel({ text, className }: SectionLabelProps) {
    return (
        <div className={cn("font-mono text-sm tracking-widest text-green uppercase mb-12", className)}>
      // {text}
        </div>
    )
}
