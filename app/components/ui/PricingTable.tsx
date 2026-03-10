import { cn } from "@/app/lib/utils"

interface PricingRow {
    views: string
    logoBug: string
    videoAd: string
    highlight?: boolean
}

interface PricingTableProps {
    rows: PricingRow[]
    className?: string
}

export function PricingTable({ rows, className }: PricingTableProps) {
    return (
        <div className={cn("w-full overflow-x-auto", className)}>
            <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                    <tr className="border-b-2 border-border text-gray-light font-sans text-sm uppercase tracking-wider">
                        <th className="py-4 px-6 font-medium">Views</th>
                        <th className="py-4 px-6 font-medium">Logo Bug / Banner</th>
                        <th className="py-4 px-6 font-medium">Video Ad Placement</th>
                    </tr>
                </thead>
                <tbody className="font-mono text-white">
                    {rows.map((row, index) => (
                        <tr
                            key={index}
                            className={cn(
                                "border-b border-border/50 hover:bg-card/50 transition-colors",
                                row.highlight && "bg-green/10 border-green/30 hover:bg-green/20"
                            )}
                        >
                            <td className="py-5 px-6 font-medium whitespace-nowrap">
                                {row.views} {row.highlight && <span className="ml-2 text-gold">⭐</span>}
                            </td>
                            <td className="py-5 px-6">{row.logoBug}</td>
                            <td className="py-5 px-6 text-green">{row.videoAd}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
