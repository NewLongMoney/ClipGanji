import Link from "next/link"

export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-ink border-t border-border pt-20 pb-8 px-6">
            <div className="container mx-auto max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
                    {/* Column 1 */}
                    <div>
                        <Link href="/" className="inline-flex items-center gap-1 mb-6">
                            <span className="font-anton text-4xl text-white">CLIP</span>
                            <span className="font-anton text-4xl text-green">GANJI</span>
                        </Link>
                        <p className="font-sans text-gray-light max-w-xs leading-relaxed">
                            Kenya's short-form video advertising network. Your brand inside every clip.
                        </p>
                    </div>

                    {/* Column 2 */}
                    <div className="flex flex-col gap-4">
                        <h4 className="font-mono text-white text-sm tracking-widest uppercase mb-2">Navigation</h4>
                        <Link href="/#how-it-works" className="font-sans text-gray-light hover:text-green transition-colors">How It Works</Link>
                        <Link href="/#formats" className="font-sans text-gray-light hover:text-green transition-colors">Ad Formats</Link>
                        <Link href="/rates" className="font-sans text-gray-light hover:text-green transition-colors">Rates</Link>
                        <Link href="/weekly" className="font-sans text-gray-light hover:text-green transition-colors">Weekly Campaigns</Link>
                        <Link href="/contact" className="font-sans text-gray-light hover:text-green transition-colors">Contact</Link>
                    </div>

                    {/* Column 3 */}
                    <div className="flex flex-col gap-4">
                        <h4 className="font-mono text-white text-sm tracking-widest uppercase mb-2">Contact</h4>
                        <div className="font-sans text-gray-light">
                            <a href="tel:0702005560" className="hover:text-green transition-colors">0702 005 560</a>
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
                    <div className="flex gap-4">
                        <span>TikTok</span>
                        <span>&middot;</span>
                        <span>Instagram</span>
                        <span>&middot;</span>
                        <span>YouTube</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
