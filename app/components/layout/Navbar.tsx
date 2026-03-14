"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { cn } from "@/app/lib/utils"
import { Menu, X, Shield } from "lucide-react"
import { Button } from "@/app/components/ui/Button"

export function Navbar() {
    const { data: session } = useSession()
    const isAdmin = (session?.user as { isAdmin?: boolean })?.isAdmin === true
    const [scrolled, setScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 60)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const navLinks = [
        { name: "How It Works", href: "/#how-it-works" },
        { name: "Ad Formats", href: "/#formats" },
        { name: "Contact", href: "/contact" },
    ]

    return (
        <nav
            className={cn(
                "fixed top-0 w-full z-50 transition-all duration-300",
                scrolled ? "bg-black/95 backdrop-blur-md border-b border-border py-3 sm:py-4" : "bg-transparent py-5 sm:py-6"
            )}
        >
            <div className="container mx-auto px-4 sm:px-6 max-w-7xl flex items-center justify-between gap-4">
                <Link href="/" className="flex items-center shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-green focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded">
                    <Image src="/images/LogoNoBackground.png" alt="ClipGanji Logo" width={360} height={120} className="h-20 sm:h-24 md:h-28 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]" priority />
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6 lg:gap-8 font-sans text-sm font-medium">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-gray-light hover:text-white transition-colors py-2 px-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-green focus-visible:ring-inset"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link href="/clippers" className="flex items-center gap-1.5 text-green font-semibold">
                        For Clippers
                        <span className="bg-green text-black text-[10px] font-black px-1.5 py-0.5 rounded">EARN</span>
                    </Link>
                    {isAdmin && (
                        <Link href="/admin" className="flex items-center gap-1.5 text-[#F5B800] font-semibold">
                            <Shield size={16} />
                            Admin
                        </Link>
                    )}
                    <Button variant="outline-white" size="sm" asChild>
                        <Link href="/contact">Book a Call</Link>
                    </Button>
                </nav>

                {/* Mobile Toggle - min 44px touch target */}
                <button
                    className="md:hidden p-3 -mr-2 text-white hover:bg-white/5 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-expanded={mobileMenuOpen}
                    aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Nav */}
            {mobileMenuOpen && (
                <div className="absolute top-full left-0 right-0 bg-ink border-b border-border shadow-2xl p-6 flex flex-col gap-1 md:hidden max-h-[calc(100vh-88px)] overflow-y-auto">
                    <div className="font-mono text-xs text-gray-light tracking-widest uppercase border-b border-border pb-3 mb-2">— For Brands —</div>
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-white text-lg font-sans font-medium py-4 px-2 -mx-2 rounded-lg hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-green focus-visible:ring-inset"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="font-mono text-xs text-green tracking-widest uppercase mt-4 border-b border-border pb-3 mb-2">— For Clippers —</div>
                    <Link href="/clippers" className="text-white text-lg font-sans font-medium py-4 px-2 -mx-2 rounded-lg hover:bg-white/5" onClick={() => setMobileMenuOpen(false)}>How It Works</Link>
                    <Link href="/clippers/campaigns" className="text-white text-lg font-sans font-medium py-4 px-2 -mx-2 rounded-lg hover:bg-white/5" onClick={() => setMobileMenuOpen(false)}>Open Campaigns</Link>
                    <Link href="/clippers/register" className="text-white text-lg font-sans font-medium py-4 px-2 -mx-2 rounded-lg hover:bg-white/5" onClick={() => setMobileMenuOpen(false)}>Register</Link>
                    {isAdmin && (
                        <Link href="/admin" className="flex items-center gap-2 text-[#F5B800] text-lg font-sans font-medium" onClick={() => setMobileMenuOpen(false)}>
                            <Shield size={18} /> Admin
                        </Link>
                    )}

                    <div className="flex flex-col gap-3 mt-8">
                        <Button variant="filled-green" size="lg" className="w-full justify-center min-h-[48px] text-base" asChild>
                            <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>Book a Call</Link>
                        </Button>
                        <Button variant="outline-green" size="lg" className="w-full justify-center min-h-[48px] text-base" asChild>
                            <Link href="/clippers/register" onClick={() => setMobileMenuOpen(false)}>Register as Clipper</Link>
                        </Button>
                    </div>
                </div>
            )}
        </nav>
    )
}
