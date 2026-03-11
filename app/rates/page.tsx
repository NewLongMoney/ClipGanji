import { PageWrapper } from "@/app/components/layout/PageWrapper"
import { Navbar } from "@/app/components/layout/Navbar"
import { Footer } from "@/app/components/layout/Footer"
import { PricingTable } from "@/app/components/ui/PricingTable"
import { SectionLabel } from "@/app/components/ui/SectionLabel"
import { PillarCard } from "@/app/components/ui/PillarCard"

export default function RatesPage() {
    const rateRows = [
        { views: "50,000", logoBug: "KSh 25,000", videoAd: "KSh 40,000" },
        { views: "100,000", logoBug: "KSh 50,000", videoAd: "KSh 80,000" },
        { views: "250,000", logoBug: "KSh 112,500", videoAd: "KSh 180,000" },
        { views: "500,000", logoBug: "KSh 225,000", videoAd: "KSh 350,000" },
        { views: "750,000", logoBug: "KSh 300,000", videoAd: "KSh 480,000" },
        { views: "1,000,000", logoBug: "KSh 400,000", videoAd: "KSh 600,000", highlight: true },
    ]

    const pillars = [
        {
            numeral: "I",
            accent: "green" as const,
            title: "Cannot Be Blocked, Skipped, or Ignored",
            body: "Your logo is embedded inside the video file — not an ad server overlay. No blocker removes it. No skip button bypasses it."
        },
        {
            numeral: "II",
            accent: "gold" as const,
            title: "Every View Is Verified",
            body: "UTM-tracked. Geo-filtered to Kenya. Tied to app downloads. You get proof, not estimates."
        },
        {
            numeral: "III",
            accent: "green" as const,
            title: "Earned Attention — Not Forced Exposure",
            body: "People chose to watch this clip. Your brand is part of content they wanted. Recall is 4–7x higher than forced-view formats."
        }
    ]

    return (
        <PageWrapper>
            <Navbar />
            <main className="pt-32 pb-24">
                <div className="container mx-auto px-6 max-w-7xl">
                    <SectionLabel text="FULL RATE CARD" />
                    <h1 className="font-anton text-5xl md:text-6xl lg:text-[72px] leading-[1.1] text-white uppercase mb-6">
                        WHAT YOUR <span className="text-gold">BUDGET BUYS</span>
                    </h1>
                    <p className="font-sans text-gray-light text-lg md:text-xl leading-relaxed max-w-2xl mb-16">
                        All campaigns are guaranteed to hit view targets. UTM-tracked. Geo-filtered to Kenya. Detailed reporting delivered within 48 hours of campaign completion.
                    </p>

                    <div className="bg-card rounded-md border border-border p-8 mb-16 shadow-2xl">
                        <PricingTable rows={rateRows} />
                        <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row gap-8 justify-between text-sans text-sm text-gray-light">
                            <div>
                                <strong className="text-white">Note:</strong> Logo Bug placements require existing creative. Video Ad placements include creator production.
                            </div>
                            <div className="text-right">
                                All prices are exclusive of VAT.
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6 mb-24 justify-center items-center">
                        <a href="/downloads/ClipGanji_PitchDeck.pdf" target="_blank" rel="noopener noreferrer" className="bg-green text-black px-8 py-4 rounded-md font-anton text-2xl uppercase hover:bg-gold transition-colors min-w-[300px] text-center shadow-lg">
                            Download Pitch Deck (PDF)
                        </a>
                        <a href="/downloads/ClipGanji_Rate_Card.docx" target="_blank" rel="noopener noreferrer" className="bg-ink border border-border text-white px-8 py-4 rounded-md font-anton text-2xl uppercase hover:border-gold hover:text-gold transition-colors min-w-[300px] text-center shadow-lg">
                            Download Rate Card (DOCX)
                        </a>
                    </div>

                    <div className="mb-16">
                        <SectionLabel text="THE CLIPGANJI ADVANTAGE" className="mb-8" />
                        <h2 className="font-anton text-4xl md:text-5xl text-white uppercase mb-12">
                            WHY PAY FOR VIEWS?<br />
                            <span className="text-gray">PAY FOR ATTENTION.</span>
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {pillars.map((pillar, index) => (
                                <PillarCard
                                    key={index}
                                    numeral={pillar.numeral}
                                    title={pillar.title}
                                    body={pillar.body}
                                    accent={pillar.accent}
                                />
                            ))}
                        </div>
                    </div>

                </div>
            </main>
            <Footer />
        </PageWrapper>
    )
}
