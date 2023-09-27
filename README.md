# Field Measurement (SolidJS)

Like most of my projects this is an excuse to learn a different technology stack. This app I'm going to focus on SolidJS, html canvas and offline app.

Apple has improved push notifications on home screen apps as well, so I'd like to explore that.

The app itself will allow me to dynamically get the measurements needed for Soccer fields (in feet since we are calling it Soccer). There are often issues where we as the field painting crew need to make a field fit in a space. There's a lot of trig needed to calculate the distances that can be incredibly difficult when you are standing in an open field with your hands full of ropes, paint and measuring tape.

## Learnings

After spending a lot of time working and learning SolidJS I've decided to shift this project to React again. There were several gotchas and hiccups that I simply don't have time to resolve during my free time.

- There's an odd issue with resuable components, you will see me having to check for "typeof function" in a couple components because the results of a resource are different than a signal. This means when you access a sub-attribute of a resource (say from a network call) it doesn't react and re-draw properly when sent to a component.
- There was a very strange bug around having to add `&nbsp` around the title (related to the first bullet point) where I had to surround an accessor with useless static text for it to simply appear.
- Testing! This was the final straw. I typically don't like testing very much but feel it's a needed evil given the fact that I want other people to use my app, not just me. I could not get solid-js router working or the vite environment config to work properly in the tests.
- Attempted to use Ionic Framework failed since they don't officially support it and using their web-components directly really didn't improve the app much given the fact that I would have had to re-create the entire router and page transition logic.
- VSCode would continuusly complain about the typings of the Ionic Framework web components and I spent hours trying to fix it. Eventually it just turned into adding them globally as "any" types, which doesn't help anything.
- Routing seems to be haphazard. The login page directing to /fields will render a blank page also with other `navigate` calls. The url changes and refreshing the browser works but landing there doesn't work initially.
- VSCode (not just Solid issue) really doesn't like jest and I could not figure out how to get it to stop throwing errors around the idea of global `describe`.
- VSCode (not just Solid issue) doesn't really do the test suites nicely like WebStorm. More than once I had to somehow kill the terminal because it insisted on watching the tests. Also attempting to set a keybinding for "re-run the tests" failed as well.

With all of these findings, I now know why React will not be replaced by Solid. The ergonomics were great originally but when the application grew to any reasonable size things just started to get out of hand. I'm also not going to spend hours refining and expertly crafting the code since this is my free-time project and I simply want to get an idea working, not debug build operations and false-positive errors.

The React branch will be my go forward branch.

------- Original Goals --------

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
