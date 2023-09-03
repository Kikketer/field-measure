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
