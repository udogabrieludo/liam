import { createClient } from '@/libs/db/server'
import { type NextRequest, NextResponse } from 'next/server'
import * as v from 'valibot'

const requestParamsSchema = v.object({
  designSessionId: v.string(),
})

export async function POST(request: NextRequest) {
  const requestParams = await request.json()
  const parsedRequestParams = v.safeParse(requestParamsSchema, requestParams)

  if (!parsedRequestParams.success) {
    return NextResponse.json(
      { error: 'Invalid request parameters' },
      { status: 400 },
    )
  }

  const supabase = await createClient()

  const { data: designSession, error: existingSchemaError } = await supabase
    .from('design_sessions')
    .select('id')
    .eq('id', parsedRequestParams.output.designSessionId)
    .single()
  if (!designSession || existingSchemaError) {
    return NextResponse.json(
      { error: 'Design session not found' },
      { status: 404 },
    )
  }

  // Create a new schema
  const { data: buildingSchema, error } = await supabase
    .from('building_schemas')
    .insert({
      design_session_id: designSession.id,
      schema: {}, // TODO: Add initial schema data from designSession git sha
      created_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating schema:', error)
    return NextResponse.json(
      { error: 'Failed to create schema' },
      { status: 500 },
    )
  }

  return NextResponse.json(buildingSchema)
}
