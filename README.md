# Field Measurement (SolidJS)

## Abandoned Path

This path (and SolidJS) was abandoned due to the low support that SolidJS has and my "I just now want to get this to work". The tipping point was push notifications. If you want to look at the learnings below you can see other technical rantings I had about SolidJS.

1. Push notifications with OneSignal were not "officially" supported and caused infinite loop reloads on Chrome!
2. There was a constant "just wrap it in a function" problem with SolidJS that made the app feel clustered and hard to read.  The DX of SolidJS isn't the greatest.
3. SolidJS was never listed in Vercel, Supabase or OneSignal... Using these "should be better but aren't supported" libraries are nice to explore but when I need to actually get something done it's worth just using the more mainstream technologies.

This project is now going to be written using Remix + Chakra to make it easier to get it to production and "just get it done".

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
