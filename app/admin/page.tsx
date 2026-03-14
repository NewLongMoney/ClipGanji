'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Users, Upload, Mail, Megaphone, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

interface Stats {
  clippersTotal: number
  clippersPending: number
  submissionsPending: number
  contactsUnread: number
  campaignsActive: number
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => (r.ok ? r.json() : null))
      .then(setStats)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-[#F5B800] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const cards = [
    {
      label: 'Pending clippers',
      value: stats?.clippersPending ?? 0,
      href: '/admin/clippers?status=pending',
      icon: Users,
      color: '#F5B800',
    },
    {
      label: 'Pending submissions',
      value: stats?.submissionsPending ?? 0,
      href: '/admin/submissions?status=pending',
      icon: Upload,
      color: '#F5B800',
    },
    {
      label: 'Contact briefs',
      value: stats?.contactsUnread ?? 0,
      href: '/admin/contacts',
      icon: Mail,
      color: '#00C853',
    },
    {
      label: 'Total clippers',
      value: stats?.clippersTotal ?? 0,
      href: '/admin/clippers',
      icon: Users,
      color: '#8A949C',
    },
    {
      label: 'Open campaigns',
      value: stats?.campaignsActive ?? 0,
      href: '/admin/clippers',
      icon: Megaphone,
      color: '#8A949C',
    },
  ]

  return (
    <div className="max-w-5xl space-y-8">
      <h1 className="font-anton text-3xl text-white uppercase tracking-wider">
        Dashboard
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.href + card.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              href={card.href}
              className="block bg-[#0E1214] border border-[#1E2428] rounded-2xl p-6 hover:border-[#F5B800]/30 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="p-2 rounded-lg bg-black/40"
                  style={{ color: card.color }}
                >
                  <card.icon size={20} />
                </div>
                <ChevronRight className="w-5 h-5 text-[#4A5259] group-hover:text-[#F5B800]" />
              </div>
              <p className="font-anton text-3xl text-white tracking-wider">
                {card.value}
              </p>
              <p className="text-[#8A949C] text-sm font-mono uppercase mt-1">
                {card.label}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
