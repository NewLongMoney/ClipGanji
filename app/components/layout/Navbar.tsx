"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { cn } from "@/app/lib/utils"
import { Menu, X } from "lucide-react"
import { Button } from "@/app/components/ui/Button"

export function Navbar() {
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
        { name: "Rates", href: "/rates" },
        { name: "Contact", href: "/contact" },
    ]

    return (
        <nav
            className={cn(
                "fixed top-0 w-full z-50 transition-all duration-300",
                scrolled ? "bg-black/95 backdrop-blur-md border-b border-border py-4" : "bg-transparent py-6"
            )}
        >
            <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
                <Link href="/" className="flex items-center group">
                    <img src="/images/logo2.png" alt="ClipGanji Logo" className="h-10 md:h-14 w-auto object-contain transition-transform group-hover:scale-105" />
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8 font-sans text-sm font-medium">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-gray-light hover:text-white transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link href="/clippers" className="flex items-center gap-1.5 text-green font-semibold">
                        For Clippers
                        <span className="bg-green text-black text-[10px] font-black px-1.5 py-0.5 rounded">EARN</span>
                    </Link>
                    <Button variant="outline-white" size="sm" asChild>
                        <Link href="/contact">Book a Call</Link>
                    </Button>
                </nav>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Nav */}
            {mobileMenuOpen && (
                <div className="absolute top-full left-0 right-0 bg-ink border-b border-border shadow-2xl p-6 flex flex-col gap-6 md:hidden max-h-[calc(100vh-80px)] overflow-y-auto">
                    <div className="font-mono text-xs text-gray-light tracking-widest uppercase border-b border-border pb-2">— For Brands —</div>
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-white text-lg font-sans font-medium"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    
                    <div className="font-mono text-xs text-green tracking-widest uppercase mt-4 border-b border-border pb-2">— For Clippers —</div>
                    <Link href="/clippers" className="text-white text-lg font-sans font-medium" onClick={() => setMobileMenuOpen(false)}>How It Works</Link>
                    <Link href="/clippers/campaigns" className="text-white text-lg font-sans font-medium" onClick={() => setMobileMenuOpen(false)}>Open Campaigns</Link>
                    <Link href="/clippers/register" className="text-white text-lg font-sans font-medium" onClick={() => setMobileMenuOpen(false)}>Register</Link>

                    <div className="flex flex-col gap-4 mt-6">
                        <Button variant="filled-green" className="w-full justify-center" asChild>
                            <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>Book a Call</Link>
                        </Button>
                        <Button variant="outline-green" className="w-full justify-center" asChild>
                            <Link href="/clippers/register" onClick={() => setMobileMenuOpen(false)}>Register as Clipper</Link>
                        </Button>
                    </div>
                </div>
            )}
        </nav>
    )
}
