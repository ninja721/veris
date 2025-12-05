import { NextResponse } from 'next/server'
import { queryClaims } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit
    
    const claims = await queryClaims(limit, offset)
    
    return NextResponse.json({
      success: true,
      claims,
      page,
      limit,
      hasMore: claims.length === limit
    })
  } catch {
    return NextResponse.json({
      success: false,
      claims: [],
      error: 'Failed to fetch claims'
    }, { status: 500 })
  }
}
