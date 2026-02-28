import { useState, useEffect, useRef } from 'react'

// ─── API ────────────────────────────────────────────
const API_BASE = ''

// ─── BOOT SEQUENCE ──────────────────────────────────

const BOOT_LINES = [
  { text: 'FREELANCE_AUTOPILOT v2.0.0', delay: 0, color: 'var(--neon)' },
  { text: 'Initializing autonomous acquisition pipeline...', delay: 120 },
  { text: 'Connecting to Supabase [OK]', delay: 200 },
  { text: 'Loading Orgo VM fleet...', delay: 280 },
  { text: 'Groq inference engine [ONLINE]', delay: 360 },
  { text: 'Scout network [ACTIVE]', delay: 420 },
  { text: 'SYSTEM READY', delay: 520, color: 'var(--neon)', bold: true },
]

function BootScreen({ onComplete }) {
  const [lines, setLines] = useState([])
  const [done, setDone] = useState(false)

  useEffect(() => {
    BOOT_LINES.forEach((line, i) => {
      setTimeout(() => {
        setLines(prev => [...prev, line])
        if (i === BOOT_LINES.length - 1) {
          setTimeout(() => setDone(true), 400)
          setTimeout(onComplete, 900)
        }
      }, line.delay)
    })
  }, [])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10000,
      background: 'var(--bg-void)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      opacity: done ? 0 : 1,
      transition: 'opacity 0.5s ease-out',
      pointerEvents: done ? 'none' : 'all',
    }}>
      <div style={{ maxWidth: 600, width: '100%', padding: '0 24px' }}>
        <pre style={{
          fontFamily: 'VT323, monospace',
          fontSize: 18,
          lineHeight: 1.8,
          color: 'var(--text-dim)',
        }}>
          {lines.map((line, i) => (
            <div key={i} style={{
              color: line.color || 'var(--text-dim)',
              fontWeight: line.bold ? 700 : 400,
              animation: 'fade-in-up 0.15s ease-out both',
            }}>
              <span style={{ color: 'var(--text-muted)', marginRight: 8 }}>{'>'}</span>
              {line.text}
            </div>
          ))}
          <span style={{
            display: 'inline-block',
            width: 10, height: 18,
            background: 'var(--neon)',
            animation: 'blink-cursor 0.8s infinite',
            verticalAlign: 'middle',
            marginTop: 4,
          }} />
        </pre>
      </div>
    </div>
  )
}

// ─── HOOKS ──────────────────────────────────────────

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
  return time
}

// ─── HELPERS ────────────────────────────────────────

function timeAgo(dateStr) {
  if (!dateStr) return '\u2014'
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'now'
  if (mins < 60) return `${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h`
  return `${Math.floor(hrs / 24)}d`
}

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

// ─── SMALL COMPONENTS ───────────────────────────────

function Badge({ status }) {
  const color = statusColors[status] || '#555570'
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '2px 10px', borderRadius: 3,
      fontSize: 10, fontWeight: 600,
      fontFamily: 'IBM Plex Mono, monospace',
      letterSpacing: 1, textTransform: 'uppercase',
      background: color + '12', color: color,
      border: `1px solid ${color}25`,
      boxShadow: `0 0 6px ${color}10`,
    }}>
      <span style={{
        width: 5, height: 5, borderRadius: '50%',
        background: color, boxShadow: `0 0 4px ${color}`,
      }} />
      {status?.replace(/_/g, ' ')}
    </span>
  )
}

function PulseDot({ active, size = 8 }) {
  return (
    <span style={{
      display: 'inline-block', width: size, height: size, borderRadius: '50%',
      background: active ? 'var(--neon)' : 'var(--red)',
      boxShadow: active
        ? '0 0 4px var(--neon), 0 0 12px rgba(0,255,136,0.3)'
        : '0 0 4px var(--red)',
      animation: active ? 'pulse-glow 2s infinite' : 'none',
    }} />
  )
}

function ScoreRing({ score }) {
  if (score == null) return <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{'\u2014'}</span>
  const pct = Math.min(score, 100)
  const color = pct >= 80 ? 'var(--neon)' : pct >= 60 ? 'var(--amber)' : 'var(--red)'
  const circumference = 2 * Math.PI * 20
  const offset = circumference - (pct / 100) * circumference
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <svg width="32" height="32" viewBox="0 0 48 48" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="24" cy="24" r="20" fill="none" stroke="var(--border)" strokeWidth="3" />
        <circle cx="24" cy="24" r="20" fill="none" stroke={color} strokeWidth="3"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          className="score-ring"
          style={{ filter: `drop-shadow(0 0 3px ${color})`, animation: 'score-fill 0.8s ease-out' }}
        />
      </svg>
      <span style={{
        fontSize: 12, color, fontFamily: 'Orbitron, monospace', fontWeight: 700,
        textShadow: `0 0 6px ${color}40`,
      }}>
        {score}
      </span>
    </div>
  )
}

function SectionFrame({ title, badge, accent, children }) {
  const accentColor = accent || 'var(--neon)'
  return (
    <div style={{ marginBottom: 20, position: 'relative' }}>
      {/* Top accent line */}
      <div style={{
        height: 1, background: `linear-gradient(90deg, ${accentColor}60, ${accentColor}10, transparent)`,
        marginBottom: 0,
      }} />
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 16px',
        background: 'var(--bg-panel)',
        borderLeft: `1px solid ${accentColor}30`,
        borderRight: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            width: 3, height: 14, background: accentColor,
            boxShadow: `0 0 6px ${accentColor}60`,
          }} />
          <span style={{
            fontFamily: 'Orbitron, monospace', fontSize: 11, fontWeight: 600,
            color: 'var(--text-dim)', letterSpacing: 3, textTransform: 'uppercase',
          }}>{title}</span>
        </div>
        {badge && (
          <span style={{
            fontSize: 10, color: accentColor,
            fontFamily: 'IBM Plex Mono, monospace',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>{badge}</span>
        )}
      </div>
      <div style={{
        background: 'var(--bg-deep)',
        borderLeft: `1px solid ${accentColor}15`,
        borderRight: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }}>
        {children}
      </div>
    </div>
  )
}

// ─── STAT CELL ──────────────────────────────────────

function StatCell({ value, label, accent, color }) {
  return (
    <div style={{
      background: 'var(--bg-panel)',
      padding: '16px 12px 14px',
      textAlign: 'center',
      position: 'relative',
      borderRight: '1px solid var(--border)',
    }}>
      {/* Tiny top accent */}
      {accent && <div style={{
        position: 'absolute', top: 0, left: '20%', right: '20%', height: 1,
        background: 'var(--neon)', boxShadow: '0 0 8px var(--neon-glow)',
      }} />}
      <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: 2, marginBottom: 8, textTransform: 'uppercase' }}>
        {label}
      </div>
      <div style={{
        fontFamily: 'Orbitron, monospace', fontSize: 24, fontWeight: 800,
        color: color || (accent ? 'var(--neon)' : 'var(--text)'),
        textShadow: accent ? '0 0 15px rgba(0,255,136,0.25)' : 'none',
        lineHeight: 1,
      }}>
        {value}
      </div>
    </div>
  )
}

// ─── TICKER BAR ─────────────────────────────────────

function TickerBar({ jobs }) {
  if (!jobs || jobs.length === 0) return null
  const items = jobs.slice(0, 20)
  return (
    <div style={{
      overflow: 'hidden', whiteSpace: 'nowrap',
      background: 'var(--bg-deep)',
      borderTop: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
      padding: '6px 0',
      fontSize: 10,
      color: 'var(--text-muted)',
      fontFamily: 'IBM Plex Mono, monospace',
      position: 'relative',
    }}>
      {/* Fade edges */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 40, background: 'linear-gradient(90deg, var(--bg-deep), transparent)', zIndex: 2 }} />
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 40, background: 'linear-gradient(270deg, var(--bg-deep), transparent)', zIndex: 2 }} />
      <div style={{
        display: 'inline-block',
        animation: 'ticker-scroll 60s linear infinite',
      }}>
        {[...items, ...items].map((job, i) => (
          <span key={i} style={{ marginRight: 40 }}>
            <span style={{ color: 'var(--cyan)', textTransform: 'uppercase', fontSize: 9, letterSpacing: 1 }}>{job.platform}</span>
            {' '}
            <span style={{ color: 'var(--text-dim)' }}>{(job.title || '').slice(0, 50)}</span>
            {job.score != null && (
              <>
                {' '}
                <span style={{ color: job.score >= 80 ? 'var(--neon)' : job.score >= 60 ? 'var(--amber)' : 'var(--text-muted)' }}>
                  [{job.score}]
                </span>
              </>
            )}
            <span style={{ color: 'var(--border-bright)', margin: '0 16px' }}>{'\u2502'}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── VM CARD ────────────────────────────────────────

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
  const dimBorder = isRunning ? 'rgba(0,255,136,0.15)' : 'rgba(255,51,85,0.15)'

  return (
    <div
      className={isRunning ? 'glow-card' : 'glow-card glow-card-red'}
      style={{
        background: 'var(--bg-card)',
        borderRadius: 6,
        overflow: 'hidden',
        border: `1px solid ${dimBorder}`,
        animation: `fade-in-up 0.4s ease-out ${index * 80}ms both`,
      }}
    >
      {/* Monitor bezel */}
      <div style={{
        background: 'linear-gradient(180deg, #0f0f1e 0%, #0a0a18 100%)',
        padding: '7px 12px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: `1px solid ${dimBorder}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Power LED */}
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: isRunning ? 'var(--neon)' : 'var(--red)',
            boxShadow: isRunning
              ? '0 0 4px var(--neon), 0 0 8px rgba(0,255,136,0.3)'
              : '0 0 4px var(--red)',
            animation: isRunning ? 'pulse-glow 3s infinite' : 'none',
          }} />
          <span style={{
            fontFamily: 'Orbitron, monospace', fontSize: 11, fontWeight: 600,
            color: isRunning ? 'var(--text)' : 'var(--text-muted)',
            letterSpacing: 1,
          }}>{vm.name}</span>
        </div>
        <Badge status={vm.status} />
      </div>

      {/* Screen area with CRT effect */}
      <div className="crt-screen" style={{ cursor: 'pointer' }} onClick={takeScreenshot}>
        {screenshotUrl ? (
          <img src={screenshotUrl} alt={vm.name} style={{
            width: '100%', height: 200, objectFit: 'cover',
            display: 'block', background: 'var(--bg-void)',
          }} />
        ) : (
          <div style={{
            width: '100%', height: 200,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            background: 'var(--bg-void)',
            position: 'relative',
          }}>
            {/* Static noise */}
            <div style={{
              position: 'absolute', inset: 0, opacity: 0.04,
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.5'/%3E%3C/svg%3E")`,
            }} />
            {/* Scanline sweep */}
            <div style={{
              position: 'absolute', left: 0, right: 0, height: 2,
              background: 'linear-gradient(180deg, transparent, rgba(0,255,136,0.08), transparent)',
              animation: 'sweep 4s linear infinite',
              top: '50%',
            }} />
            <span style={{
              fontFamily: 'VT323, monospace', fontSize: 16,
              color: isRunning ? 'var(--text-dim)' : 'var(--text-muted)',
              letterSpacing: 3, zIndex: 1,
            }}>
              {loading ? '[ CAPTURING... ]' : '[ CLICK TO CAPTURE ]'}
            </span>
            <span style={{
              fontFamily: 'IBM Plex Mono, monospace', fontSize: 9,
              color: 'var(--text-muted)', marginTop: 8, opacity: 0.5, zIndex: 1,
              letterSpacing: 1,
            }}>
              ID: {vm.id.slice(0, 12)}
            </span>
          </div>
        )}
      </div>

      {/* Specs bar */}
      <div style={{
        fontSize: 10, color: 'var(--text-muted)',
        padding: '7px 12px',
        display: 'flex', gap: 14, justifyContent: 'space-between',
        borderTop: `1px solid ${dimBorder}`,
        fontFamily: 'IBM Plex Mono, monospace',
        background: 'var(--bg-panel)',
      }}>
        <span>CPU <span style={{ color: 'var(--cyan)', fontWeight: 600 }}>{vm.cpu}</span></span>
        <span>RAM <span style={{ color: 'var(--cyan)', fontWeight: 600 }}>{vm.ram}GB</span></span>
        <span style={{ color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 120 }}>
          {vm.workspace}
        </span>
      </div>

      {/* Actions */}
      <div style={{
        padding: '7px 12px', display: 'flex', gap: 8,
        borderTop: `1px solid ${dimBorder}`,
        background: 'var(--bg-panel)',
      }}>
        <button className="cmd-btn" style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-bright)',
          color: 'var(--text-dim)',
          padding: '4px 12px', borderRadius: 3,
          fontSize: 10, fontFamily: 'IBM Plex Mono, monospace', letterSpacing: 1,
        }} onClick={takeScreenshot}>
          {loading ? '...' : 'CAPTURE'}
        </button>
        <a href={vm.url} target="_blank" rel="noopener noreferrer"
          className="vnc-link" style={{
            color: 'var(--cyan)', fontSize: 10, textDecoration: 'none',
            padding: '4px 12px', fontFamily: 'IBM Plex Mono, monospace', letterSpacing: 1,
          }}>
          VNC &rarr;
        </a>
      </div>
    </div>
  )
}

// ─── MAIN APP ───────────────────────────────────────

export default function App() {
  const [booted, setBooted] = useState(false)
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

  const clockStr = clock.toLocaleTimeString('en-US', { hour12: false }) +
    '.' + String(clock.getMilliseconds()).padStart(3, '0').slice(0, 2)

  const dateStr = clock.toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  }).toUpperCase()

  // Compute uptime (time since page load)
  const [loadTime] = useState(Date.now())
  const uptimeSec = Math.floor((clock.getTime() - loadTime) / 1000)
  const uptimeStr = `${Math.floor(uptimeSec / 3600).toString().padStart(2, '0')}:${Math.floor((uptimeSec % 3600) / 60).toString().padStart(2, '0')}:${(uptimeSec % 60).toString().padStart(2, '0')}`

  return (
    <>
      {!booted && <BootScreen onComplete={() => setBooted(true)} />}

      <div style={{
        maxWidth: 1520, margin: '0 auto', padding: '0 20px 40px',
        opacity: booted ? 1 : 0, transition: 'opacity 0.6s ease-out 0.3s',
      }}>

        {/* ════════════ TOP BAR ════════════ */}
        <header style={{
          display: 'flex', alignItems: 'stretch',
          borderBottom: '1px solid var(--border)',
          marginBottom: 0,
        }}>
          {/* Logo block */}
          <div style={{
            padding: '14px 20px 14px 0',
            display: 'flex', alignItems: 'center', gap: 14,
            borderRight: '1px solid var(--border)',
            paddingRight: 24,
          }}>
            {/* Icon */}
            <div style={{
              width: 38, height: 38, borderRadius: 4,
              background: 'linear-gradient(135deg, var(--neon) 0%, var(--neon-dim) 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, color: 'var(--bg-void)', fontWeight: 900,
              fontFamily: 'Orbitron, monospace',
              boxShadow: '0 0 16px rgba(0,255,136,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
            }}>FA</div>
            <div>
              <div style={{
                fontFamily: 'Orbitron, monospace', fontSize: 16, fontWeight: 800,
                color: 'var(--neon)', letterSpacing: 4,
                textShadow: '0 0 20px rgba(0,255,136,0.25)',
                animation: 'text-flicker 8s infinite',
              }}>
                FREELANCE AUTOPILOT
              </div>
              <div style={{
                fontSize: 9, color: 'var(--text-muted)', letterSpacing: 2,
                textTransform: 'uppercase', marginTop: 2,
              }}>
                AUTONOMOUS ACQUISITION PIPELINE
              </div>
            </div>
          </div>

          {/* System status indicators */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 0,
            flex: 1, overflow: 'hidden',
          }}>
            <SysIndicator label="STATUS" value="ONLINE" color="var(--neon)" dot />
            <SysIndicator label="VMS" value={`${runningCount}/${vmList.length}`} color="var(--cyan)" />
            <SysIndicator label="UPTIME" value={uptimeStr} color="var(--text-dim)" />
            <SysIndicator label="CYCLE" value="30s" color="var(--text-muted)" />
          </div>

          {/* Clock + refresh */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 16,
            borderLeft: '1px solid var(--border)',
            padding: '0 0 0 20px',
          }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontFamily: 'Orbitron, monospace', fontSize: 15,
                color: 'var(--neon-dim)', letterSpacing: 2, fontWeight: 600,
              }}>
                {clockStr}
              </div>
              <div style={{
                fontSize: 9, color: 'var(--text-muted)', letterSpacing: 2, marginTop: 1,
              }}>
                {dateStr}
              </div>
            </div>
            <button className="refresh-btn" style={{
              background: 'transparent',
              border: '1px solid var(--border-bright)',
              color: 'var(--text-dim)',
              padding: '7px 16px', borderRadius: 3,
              fontSize: 10, fontFamily: 'IBM Plex Mono, monospace', letterSpacing: 2,
            }} onClick={refreshAll}>
              REFRESH
            </button>
          </div>
        </header>

        {/* ════════════ TICKER ════════════ */}
        <TickerBar jobs={jobs.data} />

        {/* ════════════ ERROR ════════════ */}
        {stats.error && (
          <div style={{
            padding: '12px 16px', marginTop: 16,
            background: 'rgba(255,51,85,0.05)',
            border: '1px solid rgba(255,51,85,0.15)',
            borderLeft: '3px solid var(--red)',
            borderRadius: '0 4px 4px 0',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <span style={{ color: 'var(--red)', fontSize: 11, fontWeight: 600, letterSpacing: 1 }}>
              LINK DOWN
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>
              {stats.error}
            </span>
          </div>
        )}

        {/* ════════════ STATS BAR ════════════ */}
        {stats.data && (
          <div className="stats-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 1,
            marginTop: 16,
            marginBottom: 20,
            background: 'var(--border)',
            borderRadius: 4,
            overflow: 'hidden',
            border: '1px solid var(--border)',
          }}>
            <StatCell value={stats.data.jobs_discovered} label="Discovered" />
            <StatCell value={stats.data.jobs_scored} label="Scored" />
            <StatCell value={stats.data.bids_submitted} label="Bids Sent" />
            <StatCell value={stats.data.bids_won} label="Wins" accent />
            <StatCell
              value={`${stats.data.win_rate}%`}
              label="Win Rate"
              color={stats.data.win_rate >= 30 ? 'var(--neon)' : 'var(--amber)'}
            />
            <StatCell value={stats.data.active_projects} label="Active" />
            <StatCell
              value={`$${Number(stats.data.total_revenue || 0).toLocaleString()}`}
              label="Revenue" accent
            />
          </div>
        )}

        {/* ════════════ VM FLEET ════════════ */}
        <SectionFrame
          title="ORGO VM FLEET"
          accent="var(--cyan)"
          badge={vmList.length > 0 ? (
            <>
              <PulseDot active={runningCount > 0} />
              <span>{runningCount} ONLINE / {vmList.length} TOTAL</span>
            </>
          ) : null}
        >
          {vmList.length > 0 ? (
            <div className="vm-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 14, padding: 14,
            }}>
              {vmList.map((vm, i) => <VMCard key={vm.id} vm={vm} index={i} />)}
            </div>
          ) : (
            <div style={{
              textAlign: 'center', padding: '32px 20px',
              color: 'var(--text-muted)', fontSize: 11, letterSpacing: 1,
            }}>
              <span style={{ fontFamily: 'VT323, monospace', fontSize: 16, color: 'var(--text-dim)' }}>
                NO ACTIVE INSTANCES
              </span>
              <div style={{ marginTop: 6, fontSize: 10 }}>
                Deploy with: <span style={{ color: 'var(--cyan)' }}>python deploy_cloud.py</span>
              </div>
            </div>
          )}
        </SectionFrame>

        {/* ════════════ TWO-COLUMN: JOBS + BIDS ════════════ */}
        <div className="two-col" style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20,
        }}>
          {/* JOBS */}
          <SectionFrame
            title="RECENT JOBS"
            accent="var(--amber)"
            badge={jobs.data ? `${jobs.data.length} RECORDS` : null}
          >
            {jobs.loading ? (
              <LoadingState />
            ) : jobs.data && jobs.data.length > 0 ? (
              <div style={{ overflowX: 'auto', maxHeight: 480, overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, fontFamily: 'IBM Plex Mono, monospace' }}>
                  <thead>
                    <tr>
                      <Th>Platform</Th>
                      <Th>Title</Th>
                      <Th>Score</Th>
                      <Th>Status</Th>
                      <Th align="right">Found</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.data.slice(0, 25).map((job, i) => (
                      <tr key={job.id} className="data-row" style={{
                        animation: `fade-in-up 0.3s ease-out ${i * 25}ms both`,
                      }}>
                        <Td>
                          <span style={{ color: 'var(--cyan)', fontSize: 9, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>
                            {job.platform}
                          </span>
                        </Td>
                        <Td style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {job.title || '\u2014'}
                        </Td>
                        <Td><ScoreRing score={job.score} /></Td>
                        <Td><Badge status={job.status} /></Td>
                        <Td style={{ color: 'var(--text-muted)', fontSize: 10, textAlign: 'right' }}>
                          {timeAgo(job.discovered_at)}
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState text="NO JOBS DISCOVERED" sub="START ORCHESTRATOR" />
            )}
          </SectionFrame>

          {/* BIDS */}
          <SectionFrame
            title="RECENT BIDS"
            accent="var(--magenta)"
            badge={bids.data ? `${bids.data.length} RECORDS` : null}
          >
            {bids.loading ? (
              <LoadingState />
            ) : bids.data && bids.data.length > 0 ? (
              <div style={{ overflowX: 'auto', maxHeight: 480, overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, fontFamily: 'IBM Plex Mono, monospace' }}>
                  <thead>
                    <tr>
                      <Th>Platform</Th>
                      <Th>Job</Th>
                      <Th>Amount</Th>
                      <Th>Score</Th>
                      <Th>Status</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {bids.data.slice(0, 20).map((bid, i) => (
                      <tr key={bid.id} className="data-row" style={{
                        animation: `fade-in-up 0.3s ease-out ${i * 25}ms both`,
                      }}>
                        <Td>
                          <span style={{ color: 'var(--cyan)', fontSize: 9, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>
                            {bid.platform}
                          </span>
                        </Td>
                        <Td style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {bid.title || '\u2014'}
                        </Td>
                        <Td>
                          <span style={{
                            color: 'var(--neon)', fontFamily: 'Orbitron, monospace',
                            fontSize: 13, fontWeight: 700,
                            textShadow: '0 0 8px rgba(0,255,136,0.2)',
                          }}>
                            ${bid.bid_amount}
                          </span>
                        </Td>
                        <Td><ScoreRing score={bid.score} /></Td>
                        <Td><Badge status={bid.status} /></Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState text="NO BIDS SUBMITTED" sub="AWAITING QUALIFIED LEADS" />
            )}
          </SectionFrame>
        </div>

        {/* ════════════ FOOTER ════════════ */}
        <footer style={{
          textAlign: 'center', padding: '20px 0', marginTop: 20,
          borderTop: '1px solid var(--border)',
          position: 'relative',
        }}>
          {/* Center line accent */}
          <div style={{
            position: 'absolute', top: -1, left: '30%', right: '30%', height: 1,
            background: 'linear-gradient(90deg, transparent, var(--neon)20, transparent)',
          }} />
          <div style={{
            fontSize: 9, color: 'var(--text-muted)', letterSpacing: 3, textTransform: 'uppercase',
          }}>
            FreelanceAutopilot v2.0 {'\u00B7'} Autonomous Acquisition Pipeline
          </div>
          <div style={{
            fontSize: 10, color: 'var(--text-muted)', marginTop: 6, letterSpacing: 1,
          }}>
            Built by <span style={{ color: 'var(--neon)', fontWeight: 600 }}>Chris Gentile</span>
            {' '}/{' '}
            <span style={{ color: 'var(--text-dim)' }}>NewDawn AI</span>
          </div>
        </footer>
      </div>
    </>
  )
}

// ─── TABLE PRIMITIVES ───────────────────────────────

function Th({ children, align }) {
  return (
    <th style={{
      textAlign: align || 'left', padding: '9px 14px',
      borderBottom: '1px solid var(--border)',
      color: 'var(--text-muted)', fontSize: 9,
      textTransform: 'uppercase', letterSpacing: 2, fontWeight: 500,
      position: 'sticky', top: 0, background: 'var(--bg-deep)',
      zIndex: 1,
    }}>{children}</th>
  )
}

function Td({ children, style = {} }) {
  return (
    <td style={{
      padding: '8px 14px',
      borderBottom: '1px solid rgba(21,21,40,0.5)',
      color: 'var(--text)',
      ...style,
    }}>{children}</td>
  )
}

function LoadingState() {
  return (
    <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontSize: 12 }}>
      <span style={{ fontFamily: 'VT323, monospace', fontSize: 18, letterSpacing: 3 }}>
        LOADING
      </span>
      <span style={{ animation: 'blink-cursor 0.8s infinite', display: 'inline-block', width: 10, height: 16, background: 'var(--text-muted)', verticalAlign: 'middle', marginLeft: 4 }} />
    </div>
  )
}

function EmptyState({ text, sub }) {
  return (
    <div style={{ textAlign: 'center', padding: '36px 20px' }}>
      <div style={{
        fontFamily: 'VT323, monospace', fontSize: 16, color: 'var(--text-dim)',
        letterSpacing: 2,
      }}>
        {text}
      </div>
      {sub && (
        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 6, letterSpacing: 1 }}>
          {sub}
        </div>
      )}
    </div>
  )
}

function SysIndicator({ label, value, color, dot }) {
  return (
    <div style={{
      padding: '10px 18px',
      borderRight: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', gap: 8,
      minWidth: 0,
    }}>
      {dot && <PulseDot active size={6} />}
      <div>
        <div style={{ fontSize: 8, color: 'var(--text-muted)', letterSpacing: 2, textTransform: 'uppercase', lineHeight: 1 }}>
          {label}
        </div>
        <div style={{
          fontSize: 12, color, fontFamily: 'Orbitron, monospace',
          fontWeight: 600, letterSpacing: 1, lineHeight: 1.4,
        }}>
          {value}
        </div>
      </div>
    </div>
  )
}
