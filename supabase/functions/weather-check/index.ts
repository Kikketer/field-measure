import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from './_cors.ts'

// Just signal that we were called
console.log(`${new Date().toISOString()}: version: ${Deno.version.deno}`)

Deno.serve(async (req: Request) => {
  try {
    // This is needed if you're planning to invoke your function from a browser.
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders })
    }

    // 12.7 mm = .5 inches = 1 rain day
    // So at least 12.7mm adds 1 to the rainfallDays
    const weatherApiKey = Deno.env.get('WEATHER_API_KEY')
    // TODO Call the weather API to get this users location data
    console.log(`Call weather: ${weatherApiKey.substring(0, 5)}`)

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

    // And we can run queries in the context of our authenticated user
    const { data: fields, error } = await supabaseClient
      .from('fields')
      .select('*')
    if (error) throw error

    // const resp = await fetch("https://api.github.com/users/denoland", {
    //   // The init object here has an headers object containing a
    //   // header that indicates what type of response we accept.
    //   // We're not specifying the method field since by default
    //   // fetch makes a GET request.
    //   headers: {
    //     accept: "application/json",
    //   },
    // });
    // return new Response(resp.body, {
    //   status: resp.status,
    //   headers: {
    //     "content-type": "application/json",
    //   },
    // });

    return new Response(JSON.stringify({ user, fields }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
