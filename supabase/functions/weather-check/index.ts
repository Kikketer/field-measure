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

    const weather = await getWeather({ locationZip: '53575' })

    console.log('Total weather for', {
      locationZip: '53575',
      weather,
    })

    console.log(`Rainfall for ${'53575'} is ${weather.precipitation.total}mm`)

    // If rainfall for the day is above 4mm (0.16in), mark it as a rainfall day
    if (weather.precipitation.total > 4) {
      console.log('Rainfall will be incremented!')
      const { error } = await supabaseClient.rpc('increment_rainfall', {
        paint_team_id: 1,
      })

      if (error) throw error
    }

    return new Response(JSON.stringify({}), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      error,
      status: 400,
    })
  }
})
