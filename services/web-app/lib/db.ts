export interface Claim {
  id: string
  source: string
  url: string
  content_type: string
  claim: string
  category: string
  verification_status: 'verified' | 'false' | 'partially_true' | 'disputed' | 'unverifiable'
  confidence: number
  evidence: string
  sources: string[]
  images?: string[]
  videos?: string[]
  created_at: string
}

export async function queryClaims(limit: number = 50, offset: number = 0): Promise<Claim[]> {
  try {
    const { Pool } = await import('pg')
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    })

    const result = await pool.query(`
      SELECT 
        id, source, url, content_type, claim, category,
        verification_status, confidence, evidence, verification_sources as sources,
        images, videos, created_at
      FROM crawled_content
      WHERE claim IS NOT NULL
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `, [limit, offset])

    await pool.end()

    return result.rows.map(row => ({
      ...row,
      sources: Array.isArray(row.sources) ? row.sources : [],
      images: Array.isArray(row.images) ? row.images : [],
      videos: Array.isArray(row.videos) ? row.videos : [],
    }))
  } catch {
    return []
  }
}
