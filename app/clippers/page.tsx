import { PageWrapper } from "@/app/components/layout/PageWrapper"
import { Navbar } from "@/app/components/layout/Navbar"
import { Footer } from "@/app/components/layout/Footer"
import { ClipperHero } from "@/app/components/sections/ClipperHero"
import { ClipperHowItWorks } from "@/app/components/sections/ClipperHowItWorks"
import { ClipperEarnings } from "@/app/components/sections/ClipperEarnings"
import { ClipperRequirements } from "@/app/components/sections/ClipperRequirements"
import { ClipperCTA } from "@/app/components/sections/ClipperCTA"

export default function ClippersPage() {
    return (
        <PageWrapper>
            <Navbar />
            <main>
                <ClipperHero />
                <ClipperHowItWorks />
                <ClipperEarnings />
                <ClipperRequirements />
                <ClipperCTA />
            </main>
            <Footer />
        </PageWrapper>
    )
}
