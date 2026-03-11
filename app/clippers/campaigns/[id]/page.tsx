import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { PageWrapper } from "@/app/components/layout/PageWrapper"
import { Navbar } from "@/app/components/layout/Navbar"
import { Footer } from "@/app/components/layout/Footer"
import { campaigns } from "@/app/../data/campaigns"
import { Button } from "@/app/components/ui/Button"
import { cn } from "@/app/lib/utils"

export default function CampaignBrief({ params }: { params: { id: string } }) {
    const campaign = campaigns.find(c => c.id === params.id)

    if (!campaign) {
        notFound()
    }

    return (
        <PageWrapper>
            <Navbar />
            <main className="min-h-screen bg-black pt-32 pb-24 px-6 relative">
                <div 
                    className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none opacity-20" 
                    style={{ backgroundColor: campaign.logoColor || '#00C853' }}
                />

                <div className="container mx-auto max-w-4xl relative z-10">
                    <Link href="/clippers/campaigns" className="inline-flex items-center gap-2 font-mono text-xs tracking-widest text-gray-light hover:text-white uppercase mb-12 transition-colors">
                        <ArrowLeft size={14} /> Back to Campaigns
                    </Link>

                    <div className="bg-card border border-border shadow-2xl rounded-[2rem] overflow-hidden relative">
                        {/* Top Accent Line */}
                        <div 
                            className="absolute top-0 left-0 right-0 h-2" 
                            style={{ backgroundColor: campaign.logoColor || '#00C853' }} 
                        />

                        {/* Header Box */}
                        <div className="p-8 md:p-12 border-b border-border bg-ink/50 flex flex-col items-start gap-6">
                            <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
                                <span className="font-mono text-xs tracking-widest text-gray-light uppercase border border-border px-3 py-1 bg-black/50">
                                    {campaign.category}
                                </span>
                                <span className={cn(
                                    "font-mono text-xs tracking-widest uppercase font-bold px-3 py-1",
                                    campaign.status === 'open' ? "text-green bg-green/10" :
                                    campaign.status === 'filling' ? "text-gold bg-gold/10" :
                                    "text-red-500 bg-red-500/10"
                                )}>
                                    {campaign.status === 'open' ? 'OPEN' : campaign.status === 'filling' ? 'FILLING FAST' : 'FULL'}
                                </span>
                            </div>

                            <div>
                                <h1 className="font-anton text-5xl md:text-6xl text-white outline-none mb-4 leading-none uppercase tracking-wide">
                                    {campaign.brand}
                                </h1>
                                <h2 className="font-sans text-xl md:text-2xl text-gray-light max-w-2xl">
                                    {campaign.headline}
                                </h2>
                            </div>
                        </div>

                        {/* Brief Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
                            
                            {/* Left Col - 2/3: Body */}
                            <div className="md:col-span-2 p-8 md:p-12 flex flex-col gap-10">
                                <section>
                                    <h3 className="font-mono text-xs tracking-widest text-white uppercase border-b border-border pb-2 mb-4">
                                        {"// THE BRIEF"}
                                    </h3>
                                    <p className="font-sans text-lg text-gray-light leading-relaxed whitespace-pre-line">
                                        {campaign.brief}
                                    </p>
                                </section>

                                <section>
                                    <h3 className="font-mono text-xs tracking-widest text-white uppercase border-b border-border pb-2 mb-4">
                                        {"// FORMAT INSTRUCTIONS"}
                                    </h3>
                                    <div className="bg-black/50 border border-border p-6 rounded-lg font-sans text-gray-light leading-relaxed">
                                        {campaign.format === 'logo-bug' && (
                                            <>
                                                <p className="mb-2"><strong className="text-white">Style:</strong> Logo Bug Only</p>
                                                <p>Place our provided PNG logo over your video using TikTok/Instagram stickers or your video editor. Ensure it stays visible for the full duration of the clip.</p>
                                            </>
                                        )}
                                        {campaign.format === 'video-placement' && (
                                            <>
                                                <p className="mb-2"><strong className="text-white">Style:</strong> Organic Video Placement</p>
                                                <p>Mention the brand naturally within the first 5 seconds. Show the app or product on screen if possible. No overlay bugs needed.</p>
                                            </>
                                        )}
                                        {campaign.format === 'both' && (
                                            <>
                                                <p className="mb-2"><strong className="text-white">Style:</strong> Full Takeover (Bug + Mention)</p>
                                                <p>You must place the provided logo bug on your clip AND organically mention the brand/app in your content.</p>
                                            </>
                                        )}
                                    </div>
                                </section>
                            </div>

                            {/* Right Col - 1/3: Stats */}
                            <div className="p-8 md:p-12 bg-black/20 flex flex-col gap-8">
                                <div>
                                    <div className="font-mono text-[10px] text-gray uppercase tracking-widest mb-1">Pay Rate</div>
                                    <div className="font-anton text-3xl text-white">KSh {campaign.payPerThousandViews}</div>
                                    <div className="font-sans text-sm text-gray-light">per 1,000 views</div>
                                </div>

                                <div>
                                    <div className="font-mono text-[10px] text-gold uppercase tracking-widest mb-1">Bonus Structure</div>
                                    <div className="font-sans text-gray-light text-sm leading-tight border border-gold/20 bg-gold/5 p-3 rounded-md">
                                        Hit <strong className="text-white">{campaign.bonusThreshold.toLocaleString()}</strong> views to unlock a <strong className="text-gold">+KSh {campaign.bonusAmount.toLocaleString()}</strong> cash bonus.
                                    </div>
                                </div>

                                <div>
                                    <div className="font-mono text-[10px] text-gray uppercase tracking-widest mb-2">Required Platforms</div>
                                    <div className="flex gap-2">
                                        {campaign.platforms.map(platform => (
                                            <span key={platform} className="px-3 py-1 font-sans text-xs font-medium text-white bg-border rounded-full capitalize">
                                                {platform}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <div className="font-mono text-[10px] text-gray uppercase tracking-widest mb-1">Deadline to Post</div>
                                    <div className="font-sans text-white font-medium">{campaign.deadline}</div>
                                </div>

                                <div>
                                    <div className="font-mono text-[10px] text-gray uppercase tracking-widest mb-1">Availability</div>
                                    <div className={cn("font-sans font-medium", campaign.spotsRemaining <= 3 ? "text-red-500" : "text-green")}>
                                        {campaign.spotsRemaining} spots remaining
                                    </div>
                                </div>

                                <div className="mt-4 pt-8 border-t border-border">
                                    <Button 
                                        variant={campaign.status === 'full' ? "outline-white" : "filled-green"} 
                                        className="w-full justify-center" 
                                        asChild={campaign.status !== 'full'}
                                        disabled={campaign.status === 'full'}
                                    >
                                        {campaign.status === 'full' ? (
                                            <span className="opacity-50">Campaign Full</span>
                                        ) : (
                                            <Link href="/clippers/register">Apply Now &rarr;</Link>
                                        )}
                                    </Button>
                                    <p className="font-sans text-[10px] text-gray text-center mt-3">
                                        Must be registered to apply.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </PageWrapper>
    )
}
