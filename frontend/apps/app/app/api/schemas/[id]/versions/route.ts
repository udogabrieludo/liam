import { createClient } from '@/libs/db/server'
import { createNewVersion } from '@/libs/schema/createNewVersion'
import { type NextRequest, NextResponse } from 'next/server'
import * as v from 'valibot'

// export async function GET(
//   request: NextRequest,
// ) {
// }

const requestParamsSchema = v.object({
  latestVersionNumber: v.string(),
  title: v.string(),
  patch: v.string(), // object
})

export async function POST(
  request: NextRequest,
) {

  const body = await request.json()
  const { latestVersionNumber, title, patch } = body
}
