import { corsHeaders } from '../shared/_cors.ts'
import { sendPush } from './sendPush.ts'

console.log('Starting push-notifications function...')

Deno.serve(async (req) => {
  console.log('Start sending notification...')
  const payload = req.headers
    .get('Authorization')
    .replace(/^Bearer /, '')
    .split('.')[1]
  const decodedPayload = JSON.parse(window.atob(payload))

  console.log('Service role? ', decodedPayload.role)
  // Only allow the service role to call this edge function:
  if (decodedPayload.role !== 'service_role') {
    return new Response(JSON.stringify({}), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 401,
    })
  }

  // Check if there are any fields that are < 1 day remaining
  // For each field, notify the users with "should_push" that share the same team as that field
  // There should only be one push for each user regardless of how many fields

  sendPush()

  // Record the push in the database so we don't send it again in the same day

  return new Response()
})
