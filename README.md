# Field Measurement (SolidJS)

Like most of my projects this is an excuse to learn a different technology stack. This app I'm going to focus on SolidJS, html canvas and offline app.

Apple has improved push notifications on home screen apps as well, so I'd like to explore that.

The app itself will allow me to dynamically get the measurements needed for Soccer fields (in feet since we are calling it Soccer). There are often issues where we as the field painting crew need to make a field fit in a space. There's a lot of trig needed to calculate the distances that can be incredibly difficult when you are standing in an open field with your hands full of ropes, paint and measuring tape.

## Learnings

Some of the things that I learned while building this app. There are times where I want to ditch SolidJS and VSCode but eventually I got to a point where the app is "good enough".  I may explore other technologies in the future but this project will remain SolidJS. I did however switch back to WebStorm for the git client and testing functionality.

- There's an odd issue with resuable components, you will see me having to check for "typeof function" in a couple components because the results of a resource are different than a signal. This means when you access a sub-attribute of a resource (say from a network call) it doesn't react and re-draw properly when sent to a component.
- ~~There was a very strange bug around having to add `&nbsp` around the title (related to the first bullet point) where I had to surround an accessor with useless static text for it to simply appear.~~
- ~~Testing! This was the final straw. I typically don't like testing very much but feel it's a needed evil given the fact that I want other people to use my app, not just me. I could not get solid-js router working or the vite environment config to work properly in the tests.~~
  - VSCode: There are still issues around testing but mostly around VSCode and it's garbage heap of "garage band" plugins to attempt to get it to work correctly. WebStorm still takes the cake when it comes to DX around tests.
- Attempted to use Ionic Framework failed since they don't officially support it and using their web-components directly really didn't improve the app much given the fact that I would have had to re-create the entire router and page transition logic.
- VSCode: would continuusly complain about the typings of the Ionic Framework web components and I spent hours trying to fix it. Eventually it just turned into adding them globally as "any" types, which doesn't help anything.
- ~~Routing seems to be haphazard. The login page directing to /fields will render a blank page also with other `navigate` calls. The url changes and refreshing the browser works but landing there doesn't work initially.~~
  - I'm not sure what fixed this really, but I re-did the root routing in App.tsx and it seemed to fix the redirects.
- ~~VSCode: (not just Solid issue) really doesn't like jest and I could not figure out how to get it to stop throwing errors around the idea of global `describe`.~~
  - I had to update the `tsConfig.json` to include the `jest` types and then add the `jest` types. Easy to do but the 10 things required to just get testing to work properly really discourages a developer from doing the "right" thing.
- VSCode: (not just Solid issue) doesn't really do the test suites nicely like WebStorm. ~~More than once I had to somehow kill the terminal because it insisted on watching the tests.~~ Also attempting to set a keybinding for "re-run the tests" failed as well.
  - I was able to stop the "auto watch" which is a bit of an assumption (created by a plugin with many assumptions on your working environment). But I still can't get the simple "re-run the last test" to work, even using the UI button that exists let alone a keyboard binding. This issue is really driving me away from VSCode.
- VSCode: testing setup was a horrible experience combining several blog/stack-overflow posts to just get them to work. See `babel.config.js` and `jest.config.js` for notes on the complications.

With all of these findings, I now know why React will not be replaced by Solid. The ergonomics were great originally but when the application grew to any reasonable size things just started to get out of hand. I'm also not going to spend hours refining and expertly crafting the code since this is my free-time project and I simply want to get an idea working, not debug build operations and false-positive errors.

The React branch will be my go forward branch.

------- Original Goals --------

## Features

- Get measurements for any field size to fit in any space
- Know when you need to paint a field next given rainfall and time factors
- Each field degradation is independently tracked and learns based on your painting routine

## TODOs

- Push notifications using Web Push
- Connect to the game schedule sheets and use that in repaint factors

## Stretch Goals

1. Make it a SPA so we can "install" it on your phone (offline as well)
2. Printable? Maybe? 😃
