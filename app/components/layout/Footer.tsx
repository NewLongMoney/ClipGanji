import Link from "next/link"
import Image from "next/image"

export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-ink border-t border-border pt-20 pb-8 px-6">
            <div className="container mx-auto max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
                    {/* Column 1 */}
                    <div>
                        <Link href="/" className="inline-flex items-center gap-1 mb-6">
                            <div className="relative w-52 h-16">
                                <Image
                                    src="/images/2.png"
                                    alt="CLIPGANJI"
                                    fill
                                    className="object-contain object-left"
                                />
                            </div>
                        </Link>
                        <p className="font-sans text-gray-light max-w-xs leading-relaxed">
                            Kenya&apos;s short-form video advertising network. Your brand inside every clip.
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
                            <a href="tel:0704096417" className="hover:text-gold transition-colors">0704 096 417</a>
                        </div>
                        <div className="font-sans text-gray-light">
                            <a href="mailto:clipganji@gmail.com" className="hover:text-gold transition-colors">clipganji@gmail.com</a>
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
