import fs from 'fs'

// Read the fieldSchedule.json file and parse it as a JSON document:
const fieldSchedule = JSON.parse(fs.readFileSync('./fieldSchedule.json'))

// Each base item in the fieldSchedule are a "facility"
// Each facility has "fields" which are the actual fields
// Each field then has "games" which are the games scheduled on that field

// List out each facility:
const mappedFields = fieldSchedule.map((facility) =>
  facility.fields.map((field) => ({
    identifier: field.identifier,
    size: field.name,
    games: field.games.map((game) => game.start_datetime),
  })),
)

// Flatten out the array of arrays:
const flattenedFields = mappedFields.flat()

// This now has each field identifier with each game date listed, but flip it over
// so that we can list each date and which fields are needed on those dates:
const fieldsByDate = flattenedFields.reduce((acc, field) => {
  field.games.forEach((date) => {
    // Remove the time, as we will only group by yyyy-mm-dd
    date = date.split('T')[0]
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(field.identifier)
  })
  return acc
}, {})

// And sort by each key which is a date:
const sortedKeys = Object.keys(fieldsByDate).sort((a, b) => {
  return new Date(a).getTime() - new Date(b).getTime()
})

// And put the data back into the sorted keys:
const sortedFieldsByDate = sortedKeys.reduce((acc, key) => {
  acc[key] = fieldsByDate[key]
  return acc
}, {})

// console.log(JSON.stringify(fieldsByDate, null, 2))

fs.writeFileSync(
  './fieldsByDate.json',
  JSON.stringify(sortedFieldsByDate, null, 2),
)
