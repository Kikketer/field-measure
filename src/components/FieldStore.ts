// import { createClient } from '@supabase/supabase-js'

// const supabase = createClient(
//   import.meta.env.VITE_PUBLIC_SUPABASE_URL,
//   import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY,
// )

export const getFields = async () => {
  // const { data } = await supabase.from('fields').select('*')
  await new Promise((resolve) => setTimeout(resolve, 1000))
  const data = [
    {
      id: 'a18e716b-8d31-48a5-b1f4-a2b566db618e',
      created_at: '2023-09-02T14:02:54.319276+00:00',
      code: 'JPW-23',
      name: 'JPW-23',
      description: 'Jaycee Park near shed',
      degrade_factor: 1,
      rainfall_total: 0,
      last_painted: '2023-08-26T12:00:00',
      playable: 1,
      archived: 0,
      sort_order: 0,
      paint_factor: 0,
    },
    {
      id: 'a18e716b-8d31-48a5-b1f4-a2b566db6181',
      created_at: '2023-09-02T14:02:54.319276+00:00',
      code: 'NKE-14',
      name: 'NKE-14',
      description: 'Neverwood Knoll',
      degrade_factor: 1,
      rainfall_total: 0,
      last_painted: '2023-08-26T12:00:00',
      playable: 1,
      archived: 0,
      sort_order: 1,
      paint_factor: 0,
    },
  ]

  return data
}
