import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { getWeather } from './getWeather.ts'
import { corsHeaders } from './_cors.ts'

// Just signal that we were called
console.log(`${new Date().toISOString()}: version: ${Deno.version.deno}`)

Deno.serve(async (req: Request) => {
  try {
    // This is needed if you're planning to invoke your function from a browser.
    console.log('Method ', req.method)
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders })
    }

    // Create a Supabase client with the Auth context of the logged in user.
    const supabaseClient = createClient(
      // Supabase API URL - env var exported by default.
      Deno.env.get('SUPABASE_URL') ?? '',
      // Supabase API ANON KEY - env var exported by default.
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      // Create client with Auth context of the user that called the function.
      // This way your row-level-security (RLS) policies are applied.
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      },
    )
    // Now we can get the session or user object
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    console.log('Getting weather for user ', {
      email: user?.email,
      id: user?.id,
    })

    const weather = await getWeather({ locationZip: '53575' })

    // If rainfall for the day is above 3, mark it as a rainfall day
    const { data: fields, error } = await supabaseClient
      .update('')
      .from('fields')
      .select('*')
    if (error) throw error

    return new Response(
      JSON.stringify({
        user,
        fields,
        weather,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      error,
      status: 400,
    })
  }
})
