import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { getWeather } from './getWeather.ts'
import { corsHeaders } from '../shared/_cors.ts'
import { PaintTeam } from './types.ts'

// Just signal that we were called
console.log(`${new Date().toISOString()}: version: ${Deno.version.deno}`)

Deno.serve(async (req: Request) => {
  try {
    // hmm, doesn't feel right... But the JWT validation happens before this is invoked
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

    // TODO: call to get all "groups" and for each group use the ZIP on that group
    // For each of the ZIP codes on the groups call the weather and update
    // the fields in that group
    // Right now ZIP is at a paint team level, so we use that for now
    const paintteams: { data: PaintTeam[] } = await supabaseClient
      .from('paintteam')
      .select('*')

    const twentyHoursAgo = new Date().getTime() - 20 * 60 * 60 * 1000
    const history = await supabaseClient
      .from('rainfall_history')
      .select('*')
      .gte('created_at', new Date(twentyHoursAgo).toISOString())

    if (history.data?.length) {
      // We've already run this, don't do it again!
      return new Response(JSON.stringify({}), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 429,
      })
    }

    // Now for each team, call out the weather!
    for (const paintTeam of paintteams.data) {
      const weather = await getWeather({ locationZip: paintTeam.zipcode })

      console.log(
        `Rainfall for ${paintTeam.zipcode} is ${weather.precipitation.total}mm`,
      )

      // If rainfall for the day is above 4mm (0.16in), mark it as a rainfall day
      if (weather.precipitation.total > 4) {
        console.log(`Rainfall will be incremented for ${paintTeam.zipcode}`)
        // Increment the rainfall for the fields in this zipcode:
        const { error } = await supabaseClient.rpc('increment_rainfall', {
          paint_team_id: paintTeam.id,
          zipcode: paintTeam.zipcode,
        })

        // Downside is one fails they all fail, todo for this later
        if (error) throw error
      }

      // Log that we did this for each zipcode
      const { error: logError } = await supabaseClient.rpc(
        'weather_fetch_log',
        {
          zipcode: paintTeam.zipcode,
          quantity: Math.round(Number(weather.precipitation.total)),
        },
      )
      if (logError) throw logError
    }

    // TODO
    // Collect the average rainfall for the last 3 years for the next
    // 14 days at this location (max_dry_days typically)
    // Then using that we can more accurately calculate the predicted date
    // Not just by current rainfall and factor, but by potential rain that's yet to fall

    // The Predicted date is re-calculated whenever a row is updated via Postgres triggers

    return new Response(JSON.stringify({}), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      error,
      status: 400,
    })
  }
})
