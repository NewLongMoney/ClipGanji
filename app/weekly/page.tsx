import { PageWrapper } from "@/app/components/layout/PageWrapper"
import { Navbar } from "@/app/components/layout/Navbar"
import { Footer } from "@/app/components/layout/Footer"
import { SectionLabel } from "@/app/components/ui/SectionLabel"
import { ContactCTA } from "@/app/components/sections/ContactCTA"

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
                        YOUR BRAND.<br/>
                        <span className="text-green">EVERY CLIP.</span><br/>
                        EVERY DAY OF THE WEEK.
                    </h1>
                    <p className="font-sans text-gray-light text-lg md:text-xl leading-relaxed max-w-2xl mb-16">
                        Dominate the FYP. Our weekly packages deploy a curated network of clippers to generate compounding daily volume across TikTok, Reels, and Shorts.
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

                    <div className="mb-8">
                        <div>
                            <h2 className="font-anton text-4xl text-white uppercase mb-8">
                                HOW WEEKLY<br />
                                <span className="text-gray">DELIVERY WORKS</span>
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 font-sans">
                                <div className="bg-ink p-8 border border-border rounded-md hover:border-green transition-colors">
                                    <div className="w-12 h-12 bg-black text-green font-mono text-xl flex items-center justify-center rounded-full mb-6 border border-green/20">01</div>
                                    <h4 className="text-white font-medium text-lg mb-3">Brief & Kickoff</h4>
                                    <p className="text-gray-light text-sm">We align on KPIs, target audience, and collect your brand assets and tracking links.</p>
                                </div>

                                <div className="bg-ink p-8 border border-border rounded-md hover:border-gold transition-colors">
                                    <div className="w-12 h-12 bg-black text-gold font-mono text-xl flex items-center justify-center rounded-full mb-6 border border-gold/20">02</div>
                                    <h4 className="text-white font-medium text-lg mb-3">Asset Distribution</h4>
                                    <p className="text-gray-light text-sm">Assets are pushed to our curated network of tier-one clippers matching your brand.</p>
                                </div>

                                <div className="bg-ink p-8 border border-border rounded-md hover:border-green transition-colors">
                                    <div className="w-12 h-12 bg-black text-green font-mono text-xl flex items-center justify-center rounded-full mb-6 border border-green/20">03</div>
                                    <h4 className="text-white font-medium text-lg mb-3">Daily Pulse Posts</h4>
                                    <p className="text-gray-light text-sm">Creators drop new clips containing your placement every single day. Volume compounds.</p>
                                </div>

                                <div className="bg-ink p-8 border border-border rounded-md hover:border-gold transition-colors">
                                    <div className="w-12 h-12 bg-black text-gold font-mono text-xl flex items-center justify-center rounded-full mb-6 border border-gold/20">04</div>
                                    <h4 className="text-white font-medium text-lg mb-3">Friday Wrap Report</h4>
                                    <p className="text-gray-light text-sm">Full transparency. We deliver a consolidated UTM tracking report showing exact views and clicks.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-24 mb-8">
                        <SectionLabel text="THE DIFFERENCE" className="mb-8" />
                        <h2 className="font-anton text-4xl md:text-5xl text-white uppercase mb-12">
                            WHY WEEKLY BEATS <span className="text-gold">ONE-OFF.</span>
                        </h2>
                        
                        <div className="bg-ink rounded-md border border-border p-8 shadow-2xl overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[800px] font-sans">
                                <thead>
                                    <tr className="border-b border-border/50 text-gray-light uppercase tracking-wider text-sm">
                                        <th className="py-4 px-6 font-medium w-1/4">Metric</th>
                                        <th className="py-4 px-6 font-medium w-1/3 text-white">Single Drop</th>
                                        <th className="py-4 px-6 font-medium w-auto text-green">Weekly Pulse</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-border/20">
                                        <td className="py-6 px-6 text-gold font-medium">Reach</td>
                                        <td className="py-6 px-6 text-gray-light">Immediate spike, then flatlines.</td>
                                        <td className="py-6 px-6 text-white font-medium bg-green/5">Compounding volume across the week.</td>
                                    </tr>
                                    <tr className="border-b border-border/20">
                                        <td className="py-6 px-6 text-gold font-medium">Algorithm</td>
                                        <td className="py-6 px-6 text-gray-light">One chance at the FYP.</td>
                                        <td className="py-6 px-6 text-white font-medium bg-green/5">Multiple daily shots at virality.</td>
                                    </tr>
                                    <tr className="border-b border-border/20">
                                        <td className="py-6 px-6 text-gold font-medium">Brand Recall</td>
                                        <td className="py-6 px-6 text-gray-light">Viewed once and forgotten.</td>
                                        <td className="py-6 px-6 text-white font-medium bg-green/5">Seen repeatedly. Reinforces trust.</td>
                                    </tr>
                                    <tr className="border-b border-border/20">
                                        <td className="py-6 px-6 text-gold font-medium">Flexibility</td>
                                        <td className="py-6 px-6 text-gray-light">Locked in once posted.</td>
                                        <td className="py-6 px-6 text-white font-medium bg-green/5">Can swap assets mid-week.</td>
                                    </tr>
                                    <tr className="">
                                        <td className="py-6 px-6 text-gold font-medium">Reporting</td>
                                        <td className="py-6 px-6 text-gray-light">48hrs after post.</td>
                                        <td className="py-6 px-6 text-white font-medium bg-green/5">Comprehensive Friday Wrap.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </main>
            <ContactCTA />
            <Footer />
        </PageWrapper>
    )
}
