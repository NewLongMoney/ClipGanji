'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, User } from 'lucide-react'
import { escapeHtml } from '@/lib/security'

interface ContactRow {
  id: string
  companyName: string
  name: string
  email: string
  budget: string
  message: string
  requestRateCard: boolean
  requestPitchDeck?: boolean
  createdAt: string
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<ContactRow[]>([])
  const [loading, setLoading] = useState(true)
  const [expandId, setExpandId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/contacts')
      .then((r) => (r.ok ? r.json() : []))
      .then(setContacts)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-[#F5B800] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl space-y-6">
      <h1 className="font-anton text-3xl text-white uppercase tracking-wider">
        Contact briefs
      </h1>

      <div className="bg-[#0E1214] border border-[#1E2428] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#1E2428]">
                <th className="px-6 py-4 text-[10px] font-mono uppercase text-[#8A949C]">
                  Company / Contact
                </th>
                <th className="px-6 py-4 text-[10px] font-mono uppercase text-[#8A949C]">
                  Budget
                </th>
                <th className="px-6 py-4 text-[10px] font-mono uppercase text-[#8A949C]">
                  Date
                </th>
                <th className="px-6 py-4 text-[10px] font-mono uppercase text-[#8A949C]">
                  Rate card
                </th>
                <th className="px-6 py-4 text-[10px] font-mono uppercase text-[#8A949C]">
                  Pitch deck
                </th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c) => (
                <motion.tr
                  key={c.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-[#1E2428]/50 hover:bg-white/[0.02]"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{c.companyName}</div>
                    <div className="text-sm text-[#8A949C] flex items-center gap-1 mt-0.5">
                      <User size={12} />
                      {c.name}
                    </div>
                    <a
                      href={`mailto:${c.email}`}
                      className="text-sm text-[#00C853] hover:underline flex items-center gap-1 mt-0.5"
                    >
                      <Mail size={12} />
                      {c.email}
                    </a>
                    <button
                      onClick={() =>
                        setExpandId((id) => (id === c.id ? null : c.id))
                      }
                      className="mt-2 text-[10px] font-mono text-[#F5B800] uppercase"
                    >
                      {expandId === c.id ? 'Hide message' : 'Show message'}
                    </button>
                    {expandId === c.id && (
                      <div
                        className="mt-2 p-3 bg-black/30 rounded-lg text-sm text-[#8A949C] whitespace-pre-wrap border border-[#1E2428]"
                      >
                        {c.message}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-mono text-[#F5B800]">
                    {c.budget}
                  </td>
                  <td className="px-6 py-4 text-[10px] font-mono text-[#8A949C]">
                    {new Date(c.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    {c.requestRateCard ? (
                      <span className="text-[#00C853] text-xs font-bold">Yes</span>
                    ) : (
                      <span className="text-[#4A5259] text-xs">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {c.requestPitchDeck ? (
                      <span className="text-[#00C853] text-xs font-bold">Yes</span>
                    ) : (
                      <span className="text-[#4A5259] text-xs">No</span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {contacts.length === 0 && (
          <div className="px-6 py-16 text-center text-[#8A949C] font-mono text-sm">
            No contact briefs yet.
          </div>
        )}
      </div>
    </div>
  )
}
