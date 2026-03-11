import Link from 'next/link'
import { cn } from '@/app/lib/utils'

export interface Campaign {
    id: string
    brand: string
    category: string
    logoColor: string
    headline: string
    brief: string
    format: 'logo-bug' | 'video-placement' | 'both'
    platforms: ('tiktok' | 'reels' | 'shorts')[]
    payPerThousandViews: number
    bonusThreshold: number
    bonusAmount: number
    deadline: string
    spotsRemaining: number
    status: 'open' | 'filling' | 'full'
}

interface CampaignCardProps {
    campaign: Campaign
}

export function CampaignCard({ campaign }: CampaignCardProps) {
    return (
        <div className="bg-card border border-border flex flex-col relative group hover:border-green hover:-translate-y-1 transition-all duration-300 shadow-xl overflow-hidden min-h-[380px]">
            {/* Top Accent Line */}
            <div 
                className="absolute top-0 left-0 right-0 h-1" 
                style={{ backgroundColor: campaign.logoColor || '#00C853' }} 
            />

            <div className="p-6 flex flex-col flex-grow">
                {/* Header Row */}
                <div className="flex items-start justify-between mb-4">
                    <span className="font-mono text-[10px] tracking-widest text-gray-light uppercase border border-border px-2 py-0.5 rounded-sm">
                        {campaign.category}
                    </span>
                    
                    <span className={cn(
                        "font-mono text-[10px] tracking-widest uppercase font-bold px-2 py-0.5 rounded-sm",
                        campaign.status === 'open' ? "text-green bg-green/10" :
                        campaign.status === 'filling' ? "text-gold bg-gold/10" :
                        "text-red-500 bg-red-500/10"
                    )}>
                        {campaign.status === 'open' ? 'OPEN' : campaign.status === 'filling' ? 'FILLING FAST' : 'FULL'}
                    </span>
                </div>

                <div className="mb-6">
                    <h3 className="font-anton text-3xl text-white outline-none mb-2 leading-none uppercase tracking-wide">
                        {campaign.brand}
                    </h3>
                    <h4 className="font-sans text-base text-gray-light font-medium">
                        {campaign.headline}
                    </h4>
                </div>

                <p className="font-sans text-sm text-gray line-clamp-2 leading-relaxed mb-6">
                    {campaign.brief}
                </p>

                <div className="border-t border-border/50 my-6" />

                <div className="flex flex-wrap items-center justify-between gap-4 mt-auto mb-6">
                    <div>
                        <div className="font-anton text-2xl text-white">
                            KSh {campaign.payPerThousandViews}
                        </div>
                        <div className="font-sans text-xs text-gray-light">
                            per 1K views
                        </div>
                    </div>
                    
                    <div className="text-right">
                        <div className="flex gap-1.5 justify-end mb-1">
                            {campaign.platforms.map(platform => (
                                <span key={platform} className="w-5 h-5 rounded-full bg-ink flex items-center justify-center border border-border group-hover:border-green/50 transition-colors" title={platform}>
                                    {/* Placeholders for actual icons */}
                                    <span className="text-[10px] leading-none uppercase font-bold text-gray">{platform[0]}</span>
                                </span>
                            ))}
                        </div>
                        <div className="font-mono text-[10px] text-gray uppercase tracking-widest">
                            {campaign.deadline}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                    <span className={cn(
                        "font-sans text-xs font-medium",
                        campaign.spotsRemaining <= 3 ? "text-red-500" : "text-green"
                    )}>
                        {campaign.spotsRemaining} spots remaining
                    </span>
                </div>

                <Link href={`/clippers/campaigns/${campaign.id}`} className="w-full text-center font-sans font-bold text-sm text-white bg-ink hover:bg-white hover:text-black py-3 rounded-md border border-border transition-colors">
                    View Brief &rarr;
                </Link>
            </div>
        </div>
    )
}
