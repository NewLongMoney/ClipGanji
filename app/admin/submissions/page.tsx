'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, ExternalLink } from 'lucide-react'
import { cn } from '@/app/lib/utils'

interface SubmissionRow {
  id: string
  platform: string
  postUrl: string
  views: number
  earnings: number
  status: string
  rejectionReason: string | null
  submittedAt: string
  reviewedAt: string | null
  clipper: { id: string; fullName: string; phone: string }
  campaign: { id: string; brandPublic: string; category: string; payPer1000Views: number }
}

export default function AdminSubmissionsPage() {
  const searchParams = useSearchParams()
  const statusFilter = searchParams.get('status') || 'all'
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([])
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState<string | null>(null)
  const [viewsInput, setViewsInput] = useState<Record<string, string>>({})

  useEffect(() => {
    const params = statusFilter !== 'all' ? `?status=${statusFilter}` : ''
    fetch(`/api/admin/submissions${params}`)
      .then((r) => (r.ok ? r.json() : []))
      .then(setSubmissions)
      .finally(() => setLoading(false))
  }, [statusFilter])

  const handleApprove = async (id: string) => {
    const views = parseInt(viewsInput[id] ?? '0', 10)
    if (!views || views < 0) {
      alert('Enter a valid view count')
      return
    }
    setActing(id)
    try {
      const res = await fetch('/api/admin/approve-submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId: id, views }),
      })
      if (res.ok) {
        const data = await res.json()
        setSubmissions((prev) =>
          prev.map((s) =>
            s.id === id
              ? {
                  ...s,
                  status: 'approved',
                  views,
                  earnings: data.earnings ?? s.earnings,
                  reviewedAt: new Date().toISOString(),
                }
              : s
          )
        )
        setViewsInput((prev) => ({ ...prev, [id]: '' }))
      } else {
        const err = await res.json()
        alert(err.error || 'Failed to approve')
      }
    } finally {
      setActing(null)
    }
  }

  const handleReject = async (id: string) => {
    const reason = window.prompt('Rejection reason (optional):')
    if (reason === null) return
    setActing(id)
    try {
      const res = await fetch('/api/admin/reject-submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId: id, reason: reason || undefined }),
      })
      if (res.ok) {
        setSubmissions((prev) =>
          prev.map((s) =>
            s.id === id
              ? { ...s, status: 'rejected', reviewedAt: new Date().toISOString() }
              : s
          )
        )
      }
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
          Submissions
        </h1>
        <div className="flex gap-2">
          {['all', 'pending', 'approved', 'rejected'].map((s) => (
            <a
              key={s}
              href={
                s === 'all'
                  ? '/admin/submissions'
                  : `/admin/submissions?status=${s}`
              }
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
                  Campaign · Clipper
                </th>
                <th className="px-6 py-4 text-[10px] font-mono uppercase text-[#8A949C]">
                  Link
                </th>
                <th className="px-6 py-4 text-[10px] font-mono uppercase text-[#8A949C]">
                  Status
                </th>
                <th className="px-6 py-4 text-[10px] font-mono uppercase text-[#8A949C]">
                  Views / Earnings
                </th>
                <th className="px-6 py-4 text-[10px] font-mono uppercase text-[#8A949C]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s) => (
                <motion.tr
                  key={s.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-[#1E2428]/50 hover:bg-white/[0.02]"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">
                      {s.campaign.brandPublic}
                    </div>
                    <div className="text-[10px] text-[#8A949C] font-mono mt-0.5">
                      {s.campaign.category} · {s.clipper.fullName}
                    </div>
                    <div className="text-[10px] text-[#4A5259] mt-0.5 uppercase">
                      {s.platform}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={s.postUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#00C853] hover:underline text-sm truncate max-w-[200px]"
                    >
                      <ExternalLink size={12} />
                      View clip
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase',
                        s.status === 'approved' &&
                          'bg-[#00C853]/15 text-[#00C853] border border-[#00C853]/30',
                        s.status === 'rejected' &&
                          'bg-red-500/15 text-red-400 border border-red-500/30',
                        s.status === 'pending' &&
                          'bg-[#F5B800]/15 text-[#F5B800] border border-[#F5B800]/30'
                      )}
                    >
                      {s.status === 'approved' && <CheckCircle size={10} />}
                      {s.status === 'rejected' && <XCircle size={10} />}
                      {s.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[10px] font-mono text-[#8A949C]">
                    {s.status === 'approved' ? (
                      <>
                        {s.views.toLocaleString()} views · KSh{' '}
                        {s.earnings.toLocaleString()}
                      </>
                    ) : s.status === 'pending' ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={0}
                          placeholder="Views"
                          value={viewsInput[s.id] ?? ''}
                          onChange={(e) =>
                            setViewsInput((prev) => ({
                              ...prev,
                              [s.id]: e.target.value,
                            }))
                          }
                          className="w-24 bg-black/50 border border-[#1E2428] rounded px-2 py-1 text-white text-xs"
                        />
                      </div>
                    ) : (
                      s.rejectionReason || '—'
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {s.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleApprove(s.id)}
                          disabled={acting === s.id}
                          className="p-2 rounded-lg bg-[#00C853]/10 text-[#00C853] hover:bg-[#00C853]/20 disabled:opacity-50 flex items-center gap-1 text-xs"
                        >
                          <CheckCircle size={14} />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(s.id)}
                          disabled={acting === s.id}
                          className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 disabled:opacity-50 flex items-center gap-1 text-xs"
                        >
                          <XCircle size={14} />
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {submissions.length === 0 && (
          <div className="px-6 py-16 text-center text-[#8A949C] font-mono text-sm">
            No submissions match the filter.
          </div>
        )}
      </div>
    </div>
  )
}
