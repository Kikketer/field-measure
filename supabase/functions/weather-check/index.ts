console.log('Hello from Functions!')

Deno.serve(async (req) => {
  const { time } = await req.json()
  const data = {
    message: `I was called at ${time}!`,
  }

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  })
})
