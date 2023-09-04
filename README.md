# Field Measurement

Like most of my projects this is an excuse to learn a different technology stack. This app I'm going to focus on SolidJS, html canvas and offline app.

Apple has improved push notifications on home screen apps as well, so I'd like to explore that.

The app itself will allow me to dynamically get the measurements needed for Soccer fields (in feet since we are calling it Soccer). There are often issues where we as the field painting crew need to make a field fit in a space. There's a lot of trig needed to calculate the distances that can be incredibly difficult when you are standing in an open field with your hands full of ropes, paint and measuring tape.

## Proposed Process

1. Select the field type (Full, 11-13, 9-10, 7-8, Kinder)
2. Present a "standard" field and measurements
3. Allow input the length and width you have to work with
4. Auto adjust the field measurements based on the changes

## Soft Goals

1. The map should be usable while actively measuring:
   1. Screen should remain on while it's active
   2. Measurements need to be very clear and large enough to read at a glance
   3. High contrast
   4. Don't allow mistake touches, don't move the screen or interact without a sort of double-tap procedure (we often tuck the diagrams under our arms)

## Stretch Goals

1. Make it a SPA so we can "install" it on your phone (offline as well)
2. Printable? Maybe? 😃

## Notes

paint_factor = should we paint the field, once it reaches 1 it should be painted
degrade_factor = the per-field degrade factor along with total_rainfall determines the paint_factor
rain_days = similar to "man hours" but for rain, the more rain days the more the field degrades

- This is also useful for determining a potential "when will it need to be painted" date

A typical field will degrade in 14 days if there is minimal to no rain.
A typical field will degrade in 7 days with "average" rainfall.

At each paint, the paintFactor is set to 14
Every day the paintFactor is reduced by the degradeFactor (starts at 1)
Rainfall within the day will increase the paintFactor slightly more, any rainfall over .5 inches adjust the rainFactor by 1 (meaning it'll reduce paint time by 1 day)
DegradeFactor will remain relatively static, it's set by our abnormally dry year of 14 base days. PVE may have about 10.

(rainFactor \* rainDays) - (days \* degradeFactor) = paintFactor

typical dry field = 14 days = 1/14 degradeFactor
degradeFactor = 0.07142857142857142
typical field 1 day of rain = 1 day lost
rainfactor = degradefactor

(1 \* 0) - (7 \* (1/14)) = 0.5 -- Not yet
(1 \* 0) - (10 \* (1/14)) = 0.714 -- Not yet... close
(1 \* 0) - (14 \* (1/14)) = 1 --- YES SHOULD PAINT
One day of rain reduces the date by one (so this should equal 0.5):
Math.abs((1/14 \* 1) - (8 \* (1/14))) = 0.5

Clicking the "unplayable" button before the field is determined to be unplayable using the equasions will determine the max dry days based on "undoing" the rain factor for that period and adjusting the dry days to match how many days it would take to get to that point.

5 days into a field painting
14 days is the typical "dry_days" for this field
0 rain days
= set the "dry_days" to 5

5 days into a field painting
14 days is the typical "dry_days" for this field
3 rain days
14dry - 3rain - 5days = 6 is what it should have been... so we adjust the dry_days to 13 (difference between 6 and 5 = 1, so subtract that 1 from the dry_days to make up the difference)

daysSinceLastPaint = today - lastPainted
rainDays
maxDryDays

shouldPaint = (maxDryDays - daysSinceLastPaint - (rainDays \* rainFactor)) / maxDryDays
(14 - 0 - 0) / 14 = 1
(14 - 7 - 0) / 14 = 0.5
(10 - 7 - 0) / 14 = 0.214
(7 - 7 - 0) / 14 = 0 PAINT!!
(8 - 7 - 0) / 14 = -0.7 PAINT!!

RAIN should be the changing factor when you push the "unplayable" button. It should adjust the total paint time using the rainDays factor to make the shouldPaint equal to the number of days since last paint.

So a 14 day field, at day 10 we say "unplayable". We then look at the total rainfallDays and adjust a "rainfallFactor" number to then account for a single day of rainfall actually reduces this field by more than 1 day (rainfallFactor > 1 in this case)
