'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Trash2, Mail, Phone } from 'lucide-react'
import { cn } from '@/app/lib/utils'

interface ClipperRow {
  id: string
  userId: string
  fullName: string
  phone: string
  county: string
  email: string | null
  status: string
  approvedAt: string | null
  totalEarnings: number
  totalViews: number
  tiktokHandle: string | null
  instagramHandle: string | null
  createdAt: string
  submissionsCount: number
  enrollmentsCount: number
}

export default function AdminClippersPage() {
  const searchParams = useSearchParams()
  const statusFilter = searchParams.get('status') || 'all'
  const [clippers, setClippers] = useState<ClipperRow[]>([])
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/clippers')
      .then((r) => (r.ok ? r.json() : []))
      .then(setClippers)
      .finally(() => setLoading(false))
  }, [])

  const filtered =
    statusFilter === 'all'
      ? clippers
      : clippers.filter((c) => c.status === statusFilter)

  const handleStatus = async (id: string, status: 'approved' | 'rejected') => {
    setActing(id)
    try {
      const res = await fetch(`/api/admin/clippers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        setClippers((prev) =>
          prev.map((c) =>
            c.id === id
              ? {
                  ...c,
                  status,
                  approvedAt: status === 'approved' ? new Date().toISOString() : c.approvedAt,
                }
              : c
          )
        )
      }
    } finally {
      setActing(null)
    }
  }

  const handleDelete = async (id: string, fullName: string) => {
    if (!confirm(`Delete clipper "${fullName}" and their account? This cannot be undone.`))
      return
    setActing(id)
    try {
      const res = await fetch(`/api/admin/clippers/${id}`, { method: 'DELETE' })
      if (res.ok) setClippers((prev) => prev.filter((c) => c.id !== id))
    } finally {
      setActing(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-[#F5B800] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <h1 className="font-anton text-3xl text-white uppercase tracking-wider">
          Clippers
        </h1>
        <div className="flex gap-2">
          {['all', 'pending', 'approved', 'rejected'].map((s) => (
            <a
              key={s}
              href={s === 'all' ? '/admin/clippers' : `/admin/clippers?status=${s}`}
              className={cn(
                'px-4 py-2 rounded-xl text-xs font-mono uppercase',
                statusFilter === s
                  ? 'bg-[#F5B800]/20 text-[#F5B800] border border-[#F5B800]/30'
                  : 'bg-[#0E1214] text-[#8A949C] border border-[#1E2428] hover:text-white'
              )}
            >
              {s}
            </a>
          ))}
        </div>
      </div>

      <div className="bg-[#0E1214] border border-[#1E2428] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#1E2428]">
                <th className="px-6 py-4 text-[10px] font-mono uppercase text-[#8A949C]">
                  Clipper
                </th>
                <th className="px-6 py-4 text-[10px] font-mono uppercase text-[#8A949C]">
                  Contact
                </th>
                <th className="px-6 py-4 text-[10px] font-mono uppercase text-[#8A949C]">
                  Status
                </th>
                <th className="px-6 py-4 text-[10px] font-mono uppercase text-[#8A949C]">
                  Stats
                </th>
                <th className="px-6 py-4 text-[10px] font-mono uppercase text-[#8A949C]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <motion.tr
                  key={c.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-[#1E2428]/50 hover:bg-white/[0.02]"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{c.fullName}</div>
                    <div className="text-[10px] text-[#4A5259] font-mono mt-0.5">
                      {c.county} · {new Date(c.createdAt).toLocaleDateString()}
                    </div>
                    {(c.tiktokHandle || c.instagramHandle) && (
                      <div className="text-[10px] text-[#8A949C] mt-1">
                        {[c.tiktokHandle, c.instagramHandle].filter(Boolean).join(' · ')}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-[#8A949C]">
                      <Mail size={12} />
                      {c.email ?? '—'}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#8A949C] mt-1">
                      <Phone size={12} />
                      {c.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase',
                        c.status === 'approved' && 'bg-[#00C853]/15 text-[#00C853] border border-[#00C853]/30',
                        c.status === 'rejected' && 'bg-red-500/15 text-red-400 border border-red-500/30',
                        c.status === 'pending' && 'bg-[#F5B800]/15 text-[#F5B800] border border-[#F5B800]/30'
                      )}
                    >
                      {c.status === 'approved' && <CheckCircle size={10} />}
                      {c.status === 'rejected' && <XCircle size={10} />}
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[10px] font-mono text-[#8A949C]">
                    {c.totalViews.toLocaleString()} views · KSh {c.totalEarnings.toLocaleString()}
                    <br />
                    <span className="text-[#4A5259]">
                      {c.submissionsCount} submissions · {c.enrollmentsCount} campaigns
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {c.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatus(c.id, 'approved')}
                            disabled={acting === c.id}
                            className="p-2 rounded-lg bg-[#00C853]/10 text-[#00C853] hover:bg-[#00C853]/20 disabled:opacity-50"
                            title="Approve"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            onClick={() => handleStatus(c.id, 'rejected')}
                            disabled={acting === c.id}
                            className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 disabled:opacity-50"
                            title="Reject"
                          >
                            <XCircle size={16} />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(c.id, c.fullName)}
                        disabled={acting === c.id}
                        className="p-2 rounded-lg bg-red-500/5 text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                        title="Delete clipper"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="px-6 py-16 text-center text-[#8A949C] font-mono text-sm">
            No clippers match the filter.
          </div>
        )}
      </div>
    </div>
  )
}
