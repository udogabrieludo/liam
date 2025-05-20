import { createClient } from '@/libs/db/server'
import { createNewVersion } from '@/libs/schema/createNewVersion'
import { create } from 'domain'
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

  const requestParams = await request.json()
  const parsedRequestParams = v.safeParse(requestParamsSchema, requestParams)

  if (!parsedRequestParams.success) {
    return NextResponse.json(
      { error: 'Invalid request parameters' },
      { status: 400 },
    )
  }

  const supabase = await createClient()
  createNewVersion(
    supabase,
    parsedRequestParams.output.latestVersionNumber,
    parsedRequestParams.output.title, 
  )
}
