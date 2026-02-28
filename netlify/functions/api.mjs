/**
 * Netlify Function — FreelanceAutopilot API Gateway
 * Routes /api/* to Supabase (data) + Orgo API (VMs)
 */

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://zxmmdqskagwdawhmspsv.supabase.co'
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const ORGO_KEY = process.env.ORGO_API_KEY
const ORGO_BASE = 'https://www.orgo.ai/api'

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
}

async function supabaseQuery(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  return res.json()
}

async function supabaseRpc(fnName) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fnName}`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
    },
  })
  return res.json()
}

async function orgoFetch(path) {
  const res = await fetch(`${ORGO_BASE}${path}`, {
    headers: {
      'Authorization': `Bearer ${ORGO_KEY}`,
      'Content-Type': 'application/json',
    },
  })
  return res
}

export default async (req) => {
  const url = new URL(req.url)
  const path = url.pathname

  if (req.method === 'OPTIONS') {
    return new Response('', { headers })
  }

  try {
    // --- Stats ---
    if (path === '/api/stats') {
      const data = await supabaseRpc('get_dashboard_stats')
      return new Response(JSON.stringify(data), { headers })
    }

    // --- Jobs ---
    if (path === '/api/jobs') {
      const data = await supabaseQuery(
        'freelance_jobs?select=id,platform,title,score,win_probability,status,discovered_at&order=discovered_at.desc&limit=100'
      )
      return new Response(JSON.stringify(data), { headers })
    }

    // --- Bids (with job title via join) ---
    if (path === '/api/bids') {
      const data = await supabaseQuery(
        'freelance_bids?select=id,platform,bid_amount,status,submitted_at,job_id,freelance_jobs(title,score)&order=submitted_at.desc&limit=50'
      )
      // Flatten the joined data
      const flat = data.map(b => ({
        id: b.id,
        platform: b.platform,
        bid_amount: b.bid_amount,
        status: b.status,
        submitted_at: b.submitted_at,
        title: b.freelance_jobs?.title || '',
        score: b.freelance_jobs?.score || null,
      }))
      return new Response(JSON.stringify(flat), { headers })
    }

    // --- Projects ---
    if (path === '/api/projects') {
      const data = await supabaseQuery(
        'freelance_projects?select=id,client_name,status,revenue,started_at,delivered_at,job_id,freelance_jobs(title,platform)&order=started_at.desc&limit=50'
      )
      const flat = data.map(p => ({
        ...p,
        title: p.freelance_jobs?.title || '',
        platform: p.freelance_jobs?.platform || '',
        freelance_jobs: undefined,
      }))
      return new Response(JSON.stringify(flat), { headers })
    }

    // --- Profiles ---
    if (path === '/api/profiles') {
      const data = await supabaseQuery('freelance_profiles?select=*')
      return new Response(JSON.stringify(data), { headers })
    }

    // --- VM Screenshot (proxy Orgo API) ---
    const screenshotMatch = path.match(/^\/api\/vms\/([^/]+)\/screenshot$/)
    if (screenshotMatch) {
      const vmId = screenshotMatch[1]
      const res = await orgoFetch(`/computers/${vmId}/screenshot`)
      const data = await res.json()
      if (data.image) {
        // Orgo returns a URL to the screenshot image
        if (data.image.startsWith('http')) {
          const imgRes = await fetch(data.image)
          const imgBytes = await imgRes.arrayBuffer()
          return new Response(imgBytes, {
            headers: {
              ...headers,
              'Content-Type': imgRes.headers.get('Content-Type') || 'image/jpeg',
              'Cache-Control': 'no-cache',
            },
          })
        }
        // Legacy: base64 encoded
        const b64 = data.image.includes(',') ? data.image.split(',')[1] : data.image
        const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0))
        return new Response(bytes, {
          headers: { ...headers, 'Content-Type': 'image/png' },
        })
      }
      return new Response(JSON.stringify({ error: 'No screenshot data' }), { status: 500, headers })
    }

    // --- VMs (proxy Orgo workspaces API) ---
    if (path === '/api/vms') {
      if (!ORGO_KEY) {
        return new Response(JSON.stringify([]), { headers })
      }
      const res = await orgoFetch('/workspaces')
      const data = await res.json()
      const vms = []
      for (const ws of (data.workspaces || [])) {
        for (const d of (ws.desktops || [])) {
          vms.push({
            id: d.id,
            name: d.name,
            status: d.status,
            cpu: d.cpu,
            ram: d.ram,
            url: d.url,
            workspace: ws.name,
            workspace_id: ws.id,
            created_at: d.created_at,
          })
        }
      }
      return new Response(JSON.stringify(vms), { headers })
    }

    // --- Root / health ---
    return new Response(JSON.stringify({
      status: 'ok',
      service: 'FreelanceAutopilot API',
      endpoints: ['/api/stats', '/api/jobs', '/api/bids', '/api/projects', '/api/profiles', '/api/vms'],
    }), { headers })

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers,
    })
  }
}

export const config = {
  path: ['/api/*', '/api'],
}
