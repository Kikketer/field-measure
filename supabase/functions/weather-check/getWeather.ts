import { Weather } from './types.ts'

export const getWeather = async ({
  locationZip,
}: {
  locationZip: string
}): Weather => {
  // 12.7 mm = .5 inches = 1 rain day
  // So at least 12.7mm adds 1 to the rainfallDays
  const weatherApiKey = Deno.env.get('WEATHER_API_KEY')

  const locationResponse = await fetch(
    `http://api.openweathermap.org/geo/1.0/zip?zip=${locationZip},US&appid=${weatherApiKey}`,
    {
      headers: {
        accept: 'application/json',
      },
    },
  )

  const location = await locationResponse.json()

  // Calling the weather api to get the rainfall for yesterday
  // Fun thing is that with day 0 it uses the previous month, nice!
  const yesterday = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate() - 1,
  )
  const yesterdayString = `${yesterday.getFullYear()}-${
    yesterday.getMonth() + 1
  }-${String(yesterday.getDate()).padStart(2, '0')}`

  console.log(
    `https://api.openweathermap.org/data/3.0/onecall/day_summary?lat=${location.lat}5&lon=${location.lon}&date=${yesterdayString}`,
  )

  const weather = await fetch(
    `https://api.openweathermap.org/data/3.0/onecall/day_summary?lat=${location.lat}5&lon=${location.lon}&date=${yesterdayString}&units=imperial&appid=${weatherApiKey}`,
    {
      headers: {
        accept: 'application/json',
      },
    },
  )

  return await weather.json()
}
