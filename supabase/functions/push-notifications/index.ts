import admin from 'https://esm.sh/firebase-admin'
import { corsHeaders } from '../shared/_cors.ts'

console.log('Starting push-notifications function...')

Deno.serve(async (req) => {
  const payload = req.headers
    .get('Authorization')
    .replace(/^Bearer /, '')
    .split('.')[1]
  const decodedPayload = JSON.parse(window.atob(payload))

  // Only allow the service role to call this edge function:
  if (decodedPayload.role !== 'service_role') {
    return new Response(JSON.stringify({}), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 401,
    })
  }

  // Get the google auth keys from our "file"
  const keysEnvVar = Deno.env.get('GOOGLE_CLOUD_KEYS')
  if (!keysEnvVar) {
    throw new Error('The proper environment variable was not found!')
  }
  const keys = JSON.parse(keysEnvVar)

  // Find all users that have fields that need painting today and have not yet received a notification today

  // Perform the push for those users
  console.log('Doing the keys ', keys.project_id)
  admin
    .initializeApp({
      credential: admin.credential.cert(keys),
    })
    .messaging()
    .send({
      token:
        'dJNmEiyKRse1PjFdQ8_Y3S:APA91bEI88wqnodStf3gY5dlYjQIhNqIxP-hzm8hDAY4_fiyT8BP3-eIiAYWePELw3kqiWRTZlH-ZefIptoFf9PzUa9467vl507lkb5D9Ot237e3fYH-4IR8N4Hm9noDn8qmft_06QQi',
      notification: {
        title: 'Test from CLI',
        body: 'Hello World!',
      },
      webpush: {
        fcmOptions: {
          link: 'https://localhost:3000',
        },
      },
    })
    .then((r) => {
      console.log('Result:', r)
    })
    .catch((e) => {
      console.error('Error:', e)
    })

  // Record the push in the database so we don't send it again in the same day

  return new Response()
})
