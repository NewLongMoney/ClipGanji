import { cn } from "@/app/lib/utils"

interface PillarCardProps {
    numeral: string
    title: string
    body: string
    accent: 'green' | 'gold'
    className?: string
}

export function PillarCard({ numeral, title, body, accent, className }: PillarCardProps) {
    return (
        <div className={cn("flex flex-col", className)}>
            <div className={cn(
                "font-anton text-6xl mb-6",
                accent === 'green' ? "text-green" : "text-gold"
            )}>
                {numeral}
            </div>

            <h3 className="font-anton text-3xl text-white mb-4 leading-[1.1]">
                {title}
            </h3>

            <p className="font-sans text-gray-light leading-relaxed">
                {body}
            </p>
        </div>
    )
}
