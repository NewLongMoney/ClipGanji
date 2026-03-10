"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/app/lib/utils"
import { Menu, X } from "lucide-react"
import { Button } from "@/app/components/ui/Button"

export function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
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
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                scrolled ? "bg-black/90 backdrop-blur-md border-b border-border py-4" : "bg-transparent py-6"
            )}
        >
            <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
                <Link href="/" className="flex items-center gap-1 group animate-brand-hover">
                    <div className="relative w-44 h-14">
                        <Image
                            src="/images/2.png"
                            alt="CLIPGANJI"
                            fill
                            className="object-contain"
                        />
                    </div>
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
                    <Button variant="outline-white" size="sm" asChild>
                        <Link href="/contact">Book a Call</Link>
                    </Button>
                </nav>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label={mobileMenuOpen ? "Close Menu" : "Open Menu"}
                >
                    {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Nav */}
            {mobileMenuOpen && (
                <div className="absolute top-full left-0 right-0 bg-ink border-b border-border shadow-2xl p-6 flex flex-col gap-6 md:hidden">
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
                    <Button variant="filled-green" className="w-full justify-center" asChild>
                        <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>Book a Call</Link>
                    </Button>
                </div>
            )}
        </header>
    )
}
