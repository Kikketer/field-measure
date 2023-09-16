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

- Typical 14 day to start for all-dry conditions.
- If the user marks the field unplayable in less than 14 days adjust the rain_factor to make the days until paint needed to be the number of days since the last paint.
- If the user marks the field unplayable and there hasn't been any rain in that time, adjust the max days (originall 14) to the number of days since the last paint. But also adjust the rain_factor of the previous time to adjust the dry_days and match the number of days + rainfall for that time.
  - 10 actual days, 3 rain days, marked unplayable = adjust the rain_factor to ((14 - 3) \* rainFactor = 10) rainFactor becomes 0.90909090909
  - 10 actual days, 0 rain days, 0.9090909090 rainFactor, marked unplayable = adjust the maxDryDays to 10, adjust the rainFactor to ((14 - 0) \* rainFactor = 10) rainFactor becomes 0.71428571428 (14 being the previous actual days)
