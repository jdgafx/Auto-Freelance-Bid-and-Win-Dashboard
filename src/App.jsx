import { useState, useEffect } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8787'

const styles = {
  app: {
    maxWidth: 1400,
    margin: '0 auto',
    padding: '24px 16px',
  },
  header: {
    textAlign: 'center',
    marginBottom: 32,
    padding: '24px 0',
    borderBottom: '1px solid #1a1a2e',
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: '#00ff88',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    background: '#12121f',
    border: '1px solid #1a1a2e',
    borderRadius: 8,
    padding: '16px 14px',
    textAlign: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 700,
    color: '#00ff88',
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 4,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#888',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 13,
  },
  th: {
    textAlign: 'left',
    padding: '10px 12px',
    borderBottom: '1px solid #1a1a2e',
    color: '#666',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  td: {
    padding: '10px 12px',
    borderBottom: '1px solid #0f0f1a',
    color: '#c0c0cc',
  },
  badge: (color) => ({
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: 4,
    fontSize: 11,
    fontWeight: 600,
    background: color + '20',
    color: color,
  }),
  loading: {
    textAlign: 'center',
    padding: 60,
    color: '#444',
  },
  error: {
    textAlign: 'center',
    padding: 40,
    color: '#ff4444',
    background: '#1a0000',
    borderRadius: 8,
    border: '1px solid #330000',
    marginBottom: 20,
  },
  refreshBtn: {
    background: 'none',
    border: '1px solid #333',
    color: '#888',
    padding: '6px 14px',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: 12,
    marginTop: 8,
  },
  // VM monitoring styles
  vmGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: 16,
    marginBottom: 28,
  },
  vmCard: {
    background: '#12121f',
    border: '1px solid #1a1a2e',
    borderRadius: 10,
    overflow: 'hidden',
  },
  vmHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    borderBottom: '1px solid #1a1a2e',
  },
  vmName: {
    fontSize: 14,
    fontWeight: 600,
    color: '#e0e0e8',
  },
  vmSpecs: {
    fontSize: 11,
    color: '#666',
    padding: '8px 16px',
    display: 'flex',
    gap: 16,
  },
  vmScreenshot: {
    width: '100%',
    height: 200,
    objectFit: 'cover',
    cursor: 'pointer',
    background: '#0a0a12',
  },
  vmActions: {
    padding: '8px 16px',
    display: 'flex',
    gap: 8,
  },
  vmBtn: {
    background: 'none',
    border: '1px solid #333',
    color: '#888',
    padding: '4px 10px',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: 11,
  },
  vmLink: {
    color: '#4488ff',
    fontSize: 11,
    textDecoration: 'none',
    padding: '4px 10px',
  },
  pulseGreen: {
    display: 'inline-block',
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#00ff88',
    marginRight: 6,
    boxShadow: '0 0 6px #00ff88',
  },
  pulseRed: {
    display: 'inline-block',
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#ff4444',
    marginRight: 6,
  },
}

const statusColors = {
  discovered: '#4488ff',
  scored: '#ffaa00',
  bid_queued: '#ff8800',
  bid: '#ff6600',
  won: '#00ff88',
  delivered: '#00cc66',
  rejected: '#ff4444',
  lost: '#cc3333',
  pending: '#ffaa00',
  submitted: '#4488ff',
  awarded: '#00ff88',
  in_progress: '#ffaa00',
  running: '#00ff88',
  stopped: '#ff4444',
}

function Badge({ status }) {
  const color = statusColors[status] || '#666'
  return <span style={styles.badge(color)}>{status}</span>
}

function useFetch(endpoint) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const refetch = () => {
    setLoading(true)
    fetch(`${API_BASE}${endpoint}`)
      .then(r => r.json())
      .then(d => { setData(d); setError(null) })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { refetch() }, [endpoint])
  return { data, error, loading, refetch }
}

function VMCard({ vm }) {
  const [screenshotUrl, setScreenshotUrl] = useState(null)
  const [screenshotLoading, setScreenshotLoading] = useState(false)

  const takeScreenshot = () => {
    setScreenshotLoading(true)
    fetch(`${API_BASE}/api/vms/${vm.id}/screenshot`)
      .then(r => r.blob())
      .then(blob => {
        setScreenshotUrl(URL.createObjectURL(blob))
        setScreenshotLoading(false)
      })
      .catch(() => setScreenshotLoading(false))
  }

  return (
    <div style={styles.vmCard}>
      <div style={styles.vmHeader}>
        <div style={styles.vmName}>
          <span style={vm.status === 'running' ? styles.pulseGreen : styles.pulseRed} />
          {vm.name}
        </div>
        <Badge status={vm.status} />
      </div>
      <div style={styles.vmSpecs}>
        <span>CPU: {vm.cpu}</span>
        <span>RAM: {vm.ram}GB</span>
        <span>WS: {vm.workspace}</span>
      </div>
      {screenshotUrl ? (
        <img
          src={screenshotUrl}
          alt={`${vm.name} screenshot`}
          style={styles.vmScreenshot}
          onClick={takeScreenshot}
          title="Click to refresh screenshot"
        />
      ) : (
        <div
          style={{...styles.vmScreenshot, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', fontSize: 12}}
          onClick={takeScreenshot}
        >
          {screenshotLoading ? 'Loading...' : 'Click to capture screenshot'}
        </div>
      )}
      <div style={styles.vmActions}>
        <button style={styles.vmBtn} onClick={takeScreenshot}>
          {screenshotLoading ? '...' : 'Screenshot'}
        </button>
        <a href={vm.url} target="_blank" rel="noopener noreferrer" style={styles.vmLink}>
          Open VNC
        </a>
        <span style={{...styles.vmLink, color: '#666'}}>
          {vm.id.slice(0, 8)}
        </span>
      </div>
    </div>
  )
}

export default function App() {
  const stats = useFetch('/api/stats')
  const jobs = useFetch('/api/jobs')
  const bids = useFetch('/api/bids')
  const vms = useFetch('/api/vms')

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

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <h1 style={styles.title}>FREELANCE AUTOPILOT</h1>
        <p style={styles.subtitle}>AI-Powered Acquisition Pipeline + VM Fleet</p>
        <button style={styles.refreshBtn} onClick={refreshAll}>Refresh All</button>
      </header>

      {stats.error && (
        <div style={styles.error}>
          API unreachable: {stats.error}<br/>
          <small>Ensure api_server.py is running at {API_BASE}</small>
        </div>
      )}

      {stats.data && (
        <div style={styles.statsGrid}>
          <StatCard value={stats.data.jobs_discovered} label="Jobs Found" />
          <StatCard value={stats.data.jobs_scored} label="Jobs Scored" />
          <StatCard value={stats.data.bids_submitted} label="Bids Sent" />
          <StatCard value={stats.data.bids_won} label="Bids Won" />
          <StatCard value={`${stats.data.win_rate}%`} label="Win Rate" />
          <StatCard value={stats.data.active_projects} label="Active" />
          <StatCard value={`$${stats.data.total_revenue.toLocaleString()}`} label="Revenue" />
        </div>
      )}

      {/* Bird's Eye VM Fleet */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>
          Orgo VM Fleet
          {vms.data && Array.isArray(vms.data) && (
            <span style={{color: '#00ff88', fontSize: 12, marginLeft: 8}}>
              {vms.data.filter(v => v.status === 'running').length} running
            </span>
          )}
        </h2>
        {vms.data && Array.isArray(vms.data) ? (
          vms.data.length > 0 ? (
            <div style={styles.vmGrid}>
              {vms.data.map(vm => <VMCard key={vm.id} vm={vm} />)}
            </div>
          ) : (
            <p style={{color: '#444', fontSize: 13}}>No VMs running. Deploy with: python deploy_cloud.py</p>
          )
        ) : null}
      </div>

      {/* Jobs Table */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Recent Jobs</h2>
        {jobs.loading ? (
          <p style={styles.loading}>Loading...</p>
        ) : jobs.data && jobs.data.length > 0 ? (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Platform</th>
                <th style={styles.th}>Title</th>
                <th style={styles.th}>Score</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Found</th>
              </tr>
            </thead>
            <tbody>
              {jobs.data.slice(0, 20).map(job => (
                <tr key={job.id}>
                  <td style={styles.td}>{job.platform}</td>
                  <td style={styles.td}>{(job.title || '').slice(0, 60)}</td>
                  <td style={styles.td}>{job.score ?? '-'}</td>
                  <td style={styles.td}><Badge status={job.status} /></td>
                  <td style={styles.td}>{timeAgo(job.discovered_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{color: '#444', fontSize: 13}}>No jobs discovered yet. Start the orchestrator.</p>
        )}
      </div>

      {/* Bids Table */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Recent Bids</h2>
        {bids.loading ? (
          <p style={styles.loading}>Loading...</p>
        ) : bids.data && bids.data.length > 0 ? (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Platform</th>
                <th style={styles.th}>Job</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Score</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {bids.data.slice(0, 15).map(bid => (
                <tr key={bid.id}>
                  <td style={styles.td}>{bid.platform}</td>
                  <td style={styles.td}>{(bid.title || '').slice(0, 50)}</td>
                  <td style={styles.td}>${bid.bid_amount}</td>
                  <td style={styles.td}>{bid.score ?? '-'}</td>
                  <td style={styles.td}><Badge status={bid.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{color: '#444', fontSize: 13}}>No bids submitted yet.</p>
        )}
      </div>

      <footer style={{ textAlign: 'center', color: '#333', fontSize: 11, padding: 20 }}>
        FreelanceAutopilot v1.0 &middot; Built with Claude Code
      </footer>
    </div>
  )
}

function StatCard({ value, label }) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statValue}>{value}</div>
      <div style={styles.statLabel}>{label}</div>
    </div>
  )
}

function timeAgo(dateStr) {
  if (!dateStr) return '-'
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}
