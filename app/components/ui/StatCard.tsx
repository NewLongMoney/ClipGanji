import { cn } from "@/app/lib/utils"

interface StatCardProps {
    stat: string
    label: string
    className?: string
}

export function StatCard({ stat, label, className }: StatCardProps) {
    return (
        <div
            className={cn(
                "bg-card border-t-4 border-t-green p-8 flex flex-col justify-center rounded-b-sm",
                className
            )}
        >
            <div className="font-anton text-4xl md:text-5xl text-gold mb-2">{stat}</div>
            <div className="font-sans text-gray-light leading-relaxed">{label}</div>
        </div>
    )
}
