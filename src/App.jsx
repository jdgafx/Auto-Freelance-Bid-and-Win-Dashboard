import { useState, useEffect } from 'react'

// ─── API ─────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_URL || ''

// ─── STYLES ──────────────────────────────────────────
const S = {
  app: {
    maxWidth: 1480,
    margin: '0 auto',
    padding: '20px 24px 40px',
  },

  // ── HEADER ──
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 0 20px',
    borderBottom: '1px solid var(--border)',
    marginBottom: 24,
    position: 'relative',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: 6,
    background: 'linear-gradient(135deg, var(--neon) 0%, var(--neon-dim) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    color: 'var(--bg-void)',
    fontWeight: 900,
    fontFamily: 'Orbitron, monospace',
    boxShadow: '0 0 12px rgba(0,255,136,0.3)',
  },
  title: {
    fontFamily: 'Orbitron, monospace',
    fontSize: 18,
    fontWeight: 700,
    color: 'var(--neon)',
    letterSpacing: 3,
    textShadow: '0 0 20px rgba(0,255,136,0.3)',
    animation: 'text-flicker 8s infinite',
  },
  subtitle: {
    fontFamily: 'IBM Plex Mono, monospace',
    fontSize: 10,
    color: 'var(--text-dim)',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  clock: {
    fontFamily: 'Orbitron, monospace',
    fontSize: 13,
    color: 'var(--neon-dim)',
    letterSpacing: 1,
  },
  refreshBtn: {
    background: 'transparent',
    border: '1px solid var(--border-bright)',
    color: 'var(--text-dim)',
    padding: '6px 14px',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: 11,
    fontFamily: 'IBM Plex Mono, monospace',
    letterSpacing: 1,
    transition: 'all 0.2s',
  },

  // ── STATS ──
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: 2,
    marginBottom: 24,
    background: 'var(--border)',
    borderRadius: 8,
    overflow: 'hidden',
    border: '1px solid var(--border)',
  },
  statCell: {
    background: 'var(--bg-panel)',
    padding: '14px 12px',
    textAlign: 'center',
    position: 'relative',
  },
  statValue: {
    fontFamily: 'Orbitron, monospace',
    fontSize: 22,
    fontWeight: 700,
    color: 'var(--neon)',
    textShadow: '0 0 10px rgba(0,255,136,0.2)',
    lineHeight: 1,
  },
  statLabel: {
    fontSize: 9,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 6,
  },

  // ── SECTION FRAME ──
  section: {
    marginBottom: 20,
    position: 'relative',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 16px',
    background: 'var(--bg-panel)',
    border: '1px solid var(--border)',
    borderBottom: 'none',
    borderRadius: '6px 6px 0 0',
  },
  sectionTitle: {
    fontFamily: 'Orbitron, monospace',
    fontSize: 11,
    fontWeight: 600,
    color: 'var(--text-dim)',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  sectionBadge: {
    fontSize: 10,
    color: 'var(--neon)',
    fontFamily: 'IBM Plex Mono, monospace',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  sectionBody: {
    background: 'var(--bg-deep)',
    border: '1px solid var(--border)',
    borderRadius: '0 0 6px 6px',
    overflow: 'hidden',
  },

  // ── TABLE ──
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 12,
    fontFamily: 'IBM Plex Mono, monospace',
  },
  th: {
    textAlign: 'left',
    padding: '10px 14px',
    borderBottom: '1px solid var(--border)',
    color: 'var(--text-muted)',
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontWeight: 500,
  },
  td: {
    padding: '9px 14px',
    borderBottom: '1px solid rgba(26,26,48,0.5)',
    color: 'var(--text)',
    transition: 'background 0.15s',
  },
  tr: {
    transition: 'background 0.15s',
  },

  // ── BADGE ──
  badge: (color) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    padding: '2px 10px',
    borderRadius: 3,
    fontSize: 10,
    fontWeight: 600,
    fontFamily: 'IBM Plex Mono, monospace',
    letterSpacing: 1,
    textTransform: 'uppercase',
    background: color + '12',
    color: color,
    border: `1px solid ${color}30`,
    boxShadow: `0 0 8px ${color}15`,
  }),

  // ── VM FLEET ──
  vmGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: 16,
    padding: 16,
  },
  vmCard: {
    background: 'var(--bg-card)',
    borderRadius: 8,
    overflow: 'hidden',
    border: '1px solid var(--border)',
    transition: 'border-color 0.3s, box-shadow 0.3s',
    animation: 'fade-in-up 0.4s ease-out both',
  },
  vmBezel: {
    background: 'linear-gradient(180deg, #1a1a30 0%, #12122a 100%)',
    padding: '8px 14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '2px solid var(--border)',
  },
  vmBezelLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  vmBezelDots: {
    display: 'flex',
    gap: 4,
  },
  vmDot: (color) => ({
    width: 7,
    height: 7,
    borderRadius: '50%',
    background: color,
    boxShadow: `0 0 4px ${color}`,
  }),
  vmName: {
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--text)',
    fontFamily: 'IBM Plex Mono, monospace',
  },
  vmScreen: {
    width: '100%',
    height: 180,
    objectFit: 'cover',
    cursor: 'pointer',
    background: 'var(--bg-void)',
    display: 'block',
  },
  vmScreenPlaceholder: {
    width: '100%',
    height: 180,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg-void)',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
  },
  vmSpecs: {
    fontSize: 10,
    color: 'var(--text-muted)',
    padding: '8px 14px',
    display: 'flex',
    gap: 16,
    borderTop: '1px solid var(--border)',
    fontFamily: 'IBM Plex Mono, monospace',
  },
  vmActions: {
    padding: '8px 14px',
    display: 'flex',
    gap: 8,
    borderTop: '1px solid var(--border)',
  },
  vmBtn: {
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border-bright)',
    color: 'var(--text-dim)',
    padding: '5px 12px',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: 10,
    fontFamily: 'IBM Plex Mono, monospace',
    letterSpacing: 1,
    transition: 'all 0.2s',
  },
  vmLink: {
    color: 'var(--cyan)',
    fontSize: 10,
    textDecoration: 'none',
    padding: '5px 12px',
    fontFamily: 'IBM Plex Mono, monospace',
    letterSpacing: 1,
    transition: 'color 0.2s',
  },

  // ── MISC ──
  error: {
    padding: '16px 20px',
    background: 'rgba(255,51,85,0.06)',
    border: '1px solid rgba(255,51,85,0.2)',
    borderRadius: 6,
    marginBottom: 20,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  errorText: {
    color: 'var(--red)',
    fontSize: 12,
    fontFamily: 'IBM Plex Mono, monospace',
  },
  loading: {
    textAlign: 'center',
    padding: 48,
    color: 'var(--text-muted)',
    fontSize: 12,
  },
  empty: {
    textAlign: 'center',
    padding: '32px 20px',
    color: 'var(--text-muted)',
    fontSize: 11,
    letterSpacing: 1,
  },
  footer: {
    textAlign: 'center',
    color: 'var(--text-muted)',
    fontSize: 9,
    padding: '20px 0',
    letterSpacing: 2,
    textTransform: 'uppercase',
    borderTop: '1px solid var(--border)',
    marginTop: 20,
  },

  // ── LAYOUT ──
  twoCol: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 20,
  },
}

// ─── STATUS COLORS ───────────────────────────────────
const statusColors = {
  discovered: '#4488ff',
  scored: '#ffaa00',
  bid_queued: '#ff8800',
  bid: '#ff6600',
  won: '#00ff88',
  delivered: '#00cc66',
  rejected: '#ff3355',
  lost: '#cc3333',
  pending: '#ffaa00',
  submitted: '#4488ff',
  awarded: '#00ff88',
  in_progress: '#ffaa00',
  running: '#00ff88',
  stopped: '#ff3355',
}

// ─── COMPONENTS ──────────────────────────────────────

function Badge({ status }) {
  const color = statusColors[status] || '#666680'
  return (
    <span style={S.badge(color)}>
      <span style={{
        width: 5, height: 5, borderRadius: '50%',
        background: color, boxShadow: `0 0 4px ${color}`,
      }} />
      {status?.replace(/_/g, ' ')}
    </span>
  )
}

function PulseDot({ active }) {
  return (
    <span style={{
      display: 'inline-block',
      width: 8, height: 8, borderRadius: '50%',
      background: active ? 'var(--neon)' : 'var(--red)',
      boxShadow: active ? '0 0 8px var(--neon), 0 0 16px rgba(0,255,136,0.3)' : '0 0 4px var(--red)',
      animation: active ? 'pulse-glow 2s infinite' : 'none',
    }} />
  )
}

function SectionFrame({ title, badge, children }) {
  return (
    <div style={S.section}>
      <div style={S.sectionHeader}>
        <span style={S.sectionTitle}>{title}</span>
        {badge && <span style={S.sectionBadge}>{badge}</span>}
      </div>
      <div style={S.sectionBody}>
        {children}
      </div>
    </div>
  )
}

function useFetch(endpoint) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const refetch = () => {
    setLoading(true)
    fetch(`${API_BASE}${endpoint}`)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(d => { setData(d); setError(null) })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { refetch() }, [endpoint])
  return { data, error, loading, refetch }
}

function useClock() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return time.toLocaleTimeString('en-US', { hour12: false }) +
    '.' + String(time.getMilliseconds()).padStart(3, '0').slice(0, 2)
}

// ─── VM CARD ─────────────────────────────────────────

function VMCard({ vm, index }) {
  const [screenshotUrl, setScreenshotUrl] = useState(null)
  const [loading, setLoading] = useState(false)

  const takeScreenshot = () => {
    setLoading(true)
    fetch(`${API_BASE}/api/vms/${vm.id}/screenshot`)
      .then(r => r.blob())
      .then(blob => {
        setScreenshotUrl(URL.createObjectURL(blob))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  const isRunning = vm.status === 'running'

  return (
    <div style={{
      ...S.vmCard,
      animationDelay: `${index * 80}ms`,
    }}
    onMouseEnter={e => {
      e.currentTarget.style.borderColor = isRunning ? 'var(--neon)' : 'var(--red)'
      e.currentTarget.style.boxShadow = isRunning
        ? '0 0 20px rgba(0,255,136,0.1)' : '0 0 20px rgba(255,51,85,0.1)'
    }}
    onMouseLeave={e => {
      e.currentTarget.style.borderColor = 'var(--border)'
      e.currentTarget.style.boxShadow = 'none'
    }}>
      {/* Monitor bezel top */}
      <div style={S.vmBezel}>
        <div style={S.vmBezelLeft}>
          <div style={S.vmBezelDots}>
            <span style={S.vmDot(isRunning ? '#00ff88' : '#ff3355')} />
            <span style={S.vmDot(isRunning ? '#ffaa00' : '#44445a')} />
            <span style={S.vmDot(isRunning ? '#00d4ff' : '#44445a')} />
          </div>
          <span style={S.vmName}>{vm.name}</span>
        </div>
        <Badge status={vm.status} />
      </div>

      {/* Screen area */}
      {screenshotUrl ? (
        <img
          src={screenshotUrl}
          alt={`${vm.name}`}
          style={S.vmScreen}
          onClick={takeScreenshot}
          title="Click to refresh"
        />
      ) : (
        <div style={S.vmScreenPlaceholder} onClick={takeScreenshot}>
          {/* CRT noise pattern */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.03,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.5'/%3E%3C/svg%3E")`,
          }} />
          <span style={{ color: 'var(--text-muted)', fontSize: 10, letterSpacing: 2, zIndex: 1 }}>
            {loading ? '[ CAPTURING... ]' : '[ CLICK TO CAPTURE ]'}
          </span>
          <span style={{
            color: 'var(--text-muted)', fontSize: 9, marginTop: 6,
            opacity: 0.5, zIndex: 1,
          }}>
            {vm.id.slice(0, 12)}
          </span>
        </div>
      )}

      {/* Specs bar */}
      <div style={S.vmSpecs}>
        <span>CPU <span style={{ color: 'var(--cyan)' }}>{vm.cpu}</span></span>
        <span>RAM <span style={{ color: 'var(--cyan)' }}>{vm.ram}GB</span></span>
        <span>WS <span style={{ color: 'var(--text-dim)' }}>{vm.workspace}</span></span>
      </div>

      {/* Actions */}
      <div style={S.vmActions}>
        <button style={S.vmBtn} onClick={takeScreenshot}
          onMouseEnter={e => { e.target.style.borderColor = 'var(--neon)'; e.target.style.color = 'var(--neon)' }}
          onMouseLeave={e => { e.target.style.borderColor = 'var(--border-bright)'; e.target.style.color = 'var(--text-dim)' }}>
          {loading ? '...' : 'CAPTURE'}
        </button>
        <a href={vm.url} target="_blank" rel="noopener noreferrer" style={S.vmLink}
          onMouseEnter={e => e.target.style.color = '#fff'}
          onMouseLeave={e => e.target.style.color = 'var(--cyan)'}>
          OPEN VNC &rarr;
        </a>
      </div>
    </div>
  )
}

// ─── MAIN APP ────────────────────────────────────────

export default function App() {
  const stats = useFetch('/api/stats')
  const jobs = useFetch('/api/jobs')
  const bids = useFetch('/api/bids')
  const vms = useFetch('/api/vms')
  const clock = useClock()

  const refreshAll = () => {
    stats.refetch()
    jobs.refetch()
    bids.refetch()
    vms.refetch()
  }

  useEffect(() => {
    const interval = setInterval(refreshAll, 30000)
    return () => clearInterval(interval)
  }, [])

  const vmList = Array.isArray(vms.data) ? vms.data : []
  const runningCount = vmList.filter(v => v.status === 'running').length

  return (
    <div style={S.app}>
      {/* ── HEADER ── */}
      <header style={S.header}>
        <div style={S.headerLeft}>
          <div style={S.logo}>
            <div style={S.logoIcon}>FA</div>
            <div>
              <div style={S.title}>FREELANCE AUTOPILOT</div>
              <div style={S.subtitle}>Autonomous Acquisition Pipeline</div>
            </div>
          </div>
        </div>
        <div style={S.headerRight}>
          <span style={S.clock}>{clock}</span>
          <button style={S.refreshBtn} onClick={refreshAll}
            onMouseEnter={e => { e.target.style.borderColor = 'var(--neon)'; e.target.style.color = 'var(--neon)' }}
            onMouseLeave={e => { e.target.style.borderColor = 'var(--border-bright)'; e.target.style.color = 'var(--text-dim)' }}>
            REFRESH
          </button>
        </div>
      </header>

      {/* ── ERROR ── */}
      {stats.error && (
        <div style={S.error}>
          <span style={{ fontSize: 18 }}>&#9888;</span>
          <div style={S.errorText}>
            LINK DOWN: {stats.error}
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
              API endpoint unreachable &mdash; check deployment
            </div>
          </div>
        </div>
      )}

      {/* ── STATS BAR ── */}
      {stats.data && (
        <div style={S.statsRow}>
          <StatCell value={stats.data.jobs_discovered} label="DISCOVERED" />
          <StatCell value={stats.data.jobs_scored} label="SCORED" />
          <StatCell value={stats.data.bids_submitted} label="BIDS SENT" />
          <StatCell value={stats.data.bids_won} label="WINS" accent />
          <StatCell value={`${stats.data.win_rate}%`} label="WIN RATE"
            color={stats.data.win_rate >= 30 ? 'var(--neon)' : 'var(--amber)'} />
          <StatCell value={stats.data.active_projects} label="ACTIVE" />
          <StatCell value={`$${Number(stats.data.total_revenue).toLocaleString()}`}
            label="REVENUE" accent />
        </div>
      )}

      {/* ── VM FLEET ── */}
      <SectionFrame
        title="ORGO VM FLEET"
        badge={vmList.length > 0 ? (
          <>
            <PulseDot active={runningCount > 0} />
            <span>{runningCount} ONLINE / {vmList.length} TOTAL</span>
          </>
        ) : null}
      >
        {vmList.length > 0 ? (
          <div style={S.vmGrid}>
            {vmList.map((vm, i) => <VMCard key={vm.id} vm={vm} index={i} />)}
          </div>
        ) : (
          <div style={S.empty}>
            <span style={{ color: 'var(--text-muted)' }}>
              NO ACTIVE INSTANCES &mdash; DEPLOY WITH: <span style={{ color: 'var(--cyan)' }}>python deploy_cloud.py</span>
            </span>
          </div>
        )}
      </SectionFrame>

      {/* ── TWO-COLUMN: JOBS + BIDS ── */}
      <div style={S.twoCol}>
        {/* ── JOBS ── */}
        <SectionFrame
          title="RECENT JOBS"
          badge={jobs.data ? `${jobs.data.length} RECORDS` : null}
        >
          {jobs.loading ? (
            <div style={S.loading}>LOADING<span style={{ animation: 'blink-cursor 1s infinite' }}>_</span></div>
          ) : jobs.data && jobs.data.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={S.table}>
                <thead>
                  <tr>
                    <th style={S.th}>Platform</th>
                    <th style={S.th}>Title</th>
                    <th style={S.th}>Score</th>
                    <th style={S.th}>Status</th>
                    <th style={S.th}>Found</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.data.slice(0, 20).map((job, i) => (
                    <tr key={job.id} style={{
                      ...S.tr,
                      animation: `fade-in-up 0.3s ease-out ${i * 30}ms both`,
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={S.td}>
                        <span style={{
                          color: 'var(--cyan)', fontSize: 10,
                          textTransform: 'uppercase', letterSpacing: 1,
                        }}>{job.platform}</span>
                      </td>
                      <td style={{ ...S.td, maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {job.title || '—'}
                      </td>
                      <td style={S.td}>
                        <ScoreBar score={job.score} />
                      </td>
                      <td style={S.td}><Badge status={job.status} /></td>
                      <td style={{ ...S.td, color: 'var(--text-muted)', fontSize: 10 }}>
                        {timeAgo(job.discovered_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={S.empty}>NO JOBS DISCOVERED — START ORCHESTRATOR</div>
          )}
        </SectionFrame>

        {/* ── BIDS ── */}
        <SectionFrame
          title="RECENT BIDS"
          badge={bids.data ? `${bids.data.length} RECORDS` : null}
        >
          {bids.loading ? (
            <div style={S.loading}>LOADING<span style={{ animation: 'blink-cursor 1s infinite' }}>_</span></div>
          ) : bids.data && bids.data.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={S.table}>
                <thead>
                  <tr>
                    <th style={S.th}>Platform</th>
                    <th style={S.th}>Job</th>
                    <th style={S.th}>Amount</th>
                    <th style={S.th}>Score</th>
                    <th style={S.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bids.data.slice(0, 15).map((bid, i) => (
                    <tr key={bid.id} style={{
                      ...S.tr,
                      animation: `fade-in-up 0.3s ease-out ${i * 30}ms both`,
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={S.td}>
                        <span style={{
                          color: 'var(--cyan)', fontSize: 10,
                          textTransform: 'uppercase', letterSpacing: 1,
                        }}>{bid.platform}</span>
                      </td>
                      <td style={{ ...S.td, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {bid.title || '—'}
                      </td>
                      <td style={S.td}>
                        <span style={{ color: 'var(--neon)', fontFamily: 'Orbitron, monospace', fontSize: 12 }}>
                          ${bid.bid_amount}
                        </span>
                      </td>
                      <td style={S.td}>
                        <ScoreBar score={bid.score} />
                      </td>
                      <td style={S.td}><Badge status={bid.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={S.empty}>NO BIDS SUBMITTED</div>
          )}
        </SectionFrame>
      </div>

      {/* ── FOOTER ── */}
      <footer style={S.footer}>
        FreelanceAutopilot v1.0 &middot; Autonomous Pipeline &middot; Built with Claude Code
      </footer>
    </div>
  )
}

// ─── STAT CELL ───────────────────────────────────────

function StatCell({ value, label, accent, color }) {
  return (
    <div style={S.statCell}>
      <div style={{
        ...S.statValue,
        color: color || (accent ? 'var(--neon)' : 'var(--text)'),
        textShadow: accent ? '0 0 12px rgba(0,255,136,0.3)' : 'none',
      }}>{value}</div>
      <div style={S.statLabel}>{label}</div>
    </div>
  )
}

// ─── SCORE BAR ───────────────────────────────────────

function ScoreBar({ score }) {
  if (score == null) return <span style={{ color: 'var(--text-muted)' }}>—</span>
  const pct = Math.min(score, 100)
  const color = pct >= 80 ? 'var(--neon)' : pct >= 60 ? 'var(--amber)' : 'var(--red)'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{
        width: 40, height: 4, background: 'var(--bg-void)',
        borderRadius: 2, overflow: 'hidden',
      }}>
        <div style={{
          width: `${pct}%`, height: '100%', background: color,
          borderRadius: 2, boxShadow: `0 0 4px ${color}`,
          transition: 'width 0.6s ease-out',
        }} />
      </div>
      <span style={{ fontSize: 11, color, fontFamily: 'Orbitron, monospace', fontWeight: 600 }}>
        {score}
      </span>
    </div>
  )
}

// ─── HELPERS ─────────────────────────────────────────

function timeAgo(dateStr) {
  if (!dateStr) return '—'
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'now'
  if (mins < 60) return `${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h`
  return `${Math.floor(hrs / 24)}d`
}
