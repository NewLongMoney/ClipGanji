import { PageWrapper } from "@/app/components/layout/PageWrapper"
import { Navbar } from "@/app/components/layout/Navbar"
import { Footer } from "@/app/components/layout/Footer"
import { ContactCTA } from "@/app/components/sections/ContactCTA"

export const metadata = {
    title: "Contact Us | ClipGanji",
    description: "Get in touch with ClipGanji to start your next advertising campaign in Kenya.",
}

export default function ContactPage() {
    return (
        <PageWrapper>
            <Navbar />
            <main className="pt-20">
                <ContactCTA />
            </main>
            <Footer />
        </PageWrapper>
    )
}
