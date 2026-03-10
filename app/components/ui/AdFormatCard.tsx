import { cn } from "@/app/lib/utils"

interface AdFormatCardProps {
    title: string
    body: string
    price: string
    tag: string
    accent: 'green' | 'gold'
    className?: string
}

export function AdFormatCard({ title, body, price, tag, accent, className }: AdFormatCardProps) {
    return (
        <div
            className={cn(
                "bg-card p-10 flex flex-col items-start border-t-4",
                accent === 'green' ? 'border-t-green' : 'border-t-gold',
                className
            )}
        >
            <h3 className={cn("font-anton text-3xl mb-6", accent === 'green' ? 'text-green' : 'text-gold')}>
                {title}
            </h3>

            <p className="text-gray-light font-sans leading-relaxed mb-8 flex-grow">
                {body}
            </p>

            <div className="w-full pt-8 border-t border-border flex flex-col gap-2">
                <div className="font-mono text-white text-lg">{price}</div>
                <div className="font-sans text-sm text-gray">{tag}</div>
            </div>
        </div>
    )
}
