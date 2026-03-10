import { PageWrapper } from "@/app/components/layout/PageWrapper"
import { Navbar } from "@/app/components/layout/Navbar"
import { Footer } from "@/app/components/layout/Footer"
import { SectionLabel } from "@/app/components/ui/SectionLabel"

export default function WeeklyPage() {
    const weeklyTiers = [
        { package: "Starter", price: "KSh 80,000", clippers: "3–4", clips: "3–4", views: "150K–250K" },
        { package: "Growth", price: "KSh 175,000", clippers: "5–7", clips: "5–7", views: "350K–600K" },
        { package: "Amplify", price: "KSh 300,000", clippers: "10+", clips: "10–14", views: "700K–1.2M" },
        { package: "Dominate", price: "KSh 500,000", clippers: "15+", clips: "20+", views: "1.5M–2.5M", highlight: true },
    ]

    return (
        <PageWrapper>
            <Navbar />
            <main className="pt-32 pb-24 min-h-screen">
                <div className="container mx-auto px-6 max-w-7xl">
                    <SectionLabel text="WEEKLY CAMPAIGNS" />
                    <h1 className="font-anton text-5xl md:text-6xl lg:text-[72px] leading-[1.1] text-white uppercase mb-6">
                        ALWAYS <span className="text-green">ON.</span>
                    </h1>
                    <p className="font-sans text-gray-light text-lg md:text-xl leading-relaxed max-w-2xl mb-16">
                        Dominate the FYP. Our weekly packages deploy a network of clippers to generate compounding daily volume across TikTok, Reels, and Shorts.
                    </p>

                    <div className="bg-card rounded-md border border-border p-8 mb-24 shadow-2xl overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="border-b-2 border-border text-gray-light font-sans text-sm uppercase tracking-wider">
                                    <th className="py-4 px-6 font-medium">Package</th>
                                    <th className="py-4 px-6 font-medium">Price / Week</th>
                                    <th className="py-4 px-6 font-medium">Clippers Deployed</th>
                                    <th className="py-4 px-6 font-medium">Clips / Day</th>
                                    <th className="py-4 px-6 font-medium">Est. Weekly Views</th>
                                </tr>
                            </thead>
                            <tbody className="font-mono text-white">
                                {weeklyTiers.map((tier, index) => (
                                    <tr
                                        key={index}
                                        className={`border-b border-border/50 hover:bg-black/20 transition-colors ${tier.highlight ? 'bg-green/5 border-green/30 hover:bg-green/10' : ''}`}
                                    >
                                        <td className="py-5 px-6 font-medium">
                                            {tier.package} {tier.highlight && <span className="ml-2 text-gold">⭐</span>}
                                        </td>
                                        <td className="py-5 px-6 text-green">{tier.price}</td>
                                        <td className="py-5 px-6">{tier.clippers}</td>
                                        <td className="py-5 px-6">{tier.clips}</td>
                                        <td className="py-5 px-6 text-gold">{tier.views}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="font-anton text-4xl text-white uppercase mb-8">
                                HOW WEEKLY<br />
                                <span className="text-gray">DELIVERY WORKS</span>
                            </h2>

                            <div className="space-y-8 font-sans">
                                <div className="flex gap-6">
                                    <div className="font-mono text-green text-xl mt-1">01</div>
                                    <div>
                                        <h4 className="text-white font-medium text-lg mb-2">Brief & Asset Kickoff</h4>
                                        <p className="text-gray-light">We align on KPIs, target audience, and distribute your brand assets to our curated network of creators.</p>
                                    </div>
                                </div>

                                <div className="flex gap-6">
                                    <div className="font-mono text-gold text-xl mt-1">02</div>
                                    <div>
                                        <h4 className="text-white font-medium text-lg mb-2">Daily Pulse Posts</h4>
                                        <p className="text-gray-light">Creators drop new clips containing your placement every single day. Volume stacks and algorithms engage.</p>
                                    </div>
                                </div>

                                <div className="flex gap-6">
                                    <div className="font-mono text-green text-xl mt-1">03</div>
                                    <div>
                                        <h4 className="text-white font-medium text-lg mb-2">Friday Wrap Report</h4>
                                        <p className="text-gray-light">Full transparency. We deliver a consolidated UTM tracking report showing exact views, clicks, and conversions.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-ink p-10 border border-border mt-8 lg:mt-0">
                            <h3 className="font-anton text-2xl text-white uppercase mb-6 border-b border-border pb-6">Single Drop vs Weekly Pulse</h3>
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-gold font-sans font-medium text-sm mb-1 uppercase tracking-wider">Single Drop (Rates)</h4>
                                    <p className="text-gray-light font-sans text-sm">Best for immediate spikes, product launches, or tight budgets testing the waters. Guaranteed view numbers.</p>
                                </div>
                                <div>
                                    <h4 className="text-green font-sans font-medium text-sm mb-1 uppercase tracking-wider">Weekly Pulse (Above)</h4>
                                    <p className="text-gray-light font-sans text-sm">Best for sustained brand awareness, app installs, and dominating share of voice. High compounding ROI.</p>
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
