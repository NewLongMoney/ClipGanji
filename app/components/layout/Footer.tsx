import Link from "next/link"

export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-ink border-t border-border pt-20 pb-8 px-6">
            <div className="container mx-auto max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Column 1 */}
                    <div className="md:col-span-1">
                        <Link href="/" className="inline-flex items-center mb-6">
                            <img src="/images/logo2.png" alt="ClipGanji Logo" className="h-14 md:h-20 w-auto object-contain hover:scale-105 transition-transform" />
                        </Link>
                        <p className="font-sans text-gray-light max-w-xs leading-relaxed">
                            Kenya&apos;s short-form video advertising network. Your brand inside every clip.
                        </p>
                    </div>

                    {/* Column 2 */}
                    <div className="flex flex-col gap-4">
                        <h4 className="font-mono text-white text-sm tracking-widest uppercase mb-2">For Brands</h4>
                        <Link href="/#how-it-works" className="font-sans text-gray-light hover:text-green transition-colors">How It Works</Link>
                        <Link href="/#formats" className="font-sans text-gray-light hover:text-green transition-colors">Ad Formats</Link>
                        <Link href="/rates" className="font-sans text-gray-light hover:text-green transition-colors">Rates</Link>
                        <Link href="/weekly" className="font-sans text-gray-light hover:text-green transition-colors">Weekly Campaigns</Link>
                    </div>

                    {/* Column 3 */}
                    <div className="flex flex-col gap-4">
                        <h4 className="font-mono text-white text-sm tracking-widest uppercase mb-2">For Clippers</h4>
                        <Link href="/clippers" className="font-sans text-gray-light hover:text-gold transition-colors">Earn Money</Link>
                        <Link href="/clippers/campaigns" className="font-sans text-gray-light hover:text-gold transition-colors">Open Campaigns</Link>
                        <Link href="/clippers/register" className="font-sans text-gray-light hover:text-gold transition-colors">Register</Link>
                        <Link href="/clippers/dashboard" className="font-sans text-gray-light hover:text-gold transition-colors">Log In</Link>
                    </div>

                    {/* Column 4 */}
                    <div className="flex flex-col gap-4">
                        <h4 className="font-mono text-white text-sm tracking-widest uppercase mb-2">WhatsApp Us</h4>
                        <div className="font-sans text-gray-light">
                            <a href="https://wa.me/254115336356?text=Hi%20ClipGanji!%20I'd%20like%20to%20start%20a%20brand%20campaign." target="_blank" rel="noopener noreferrer" className="hover:text-green transition-colors">Chat as a Brand</a>
                        </div>
                        <div className="font-sans text-gray-light">
                            <a href="https://wa.me/254115336356?text=Hi%20ClipGanji!%20I'm%20interested%20in%20joining%20as%20a%20Clipper." target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">Chat as a Clipper</a>
                        </div>
                        <div className="font-sans text-gray-light">
                            <span className="hover:text-green transition-colors cursor-pointer">@NewLongMoney</span>
                        </div>
                        <div className="font-sans text-gray-light mt-4">
                            Nairobi, Kenya
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4 font-sans text-sm text-gray">
                    <div>&copy; {currentYear} ClipGanji. All rights reserved.</div>
                </div>
            </div>
        </footer>
    )
}
