## React Scrollable

Scrollable components for advanced mobile scrolling with React.js

#### Build

    $ npm run build

#### Development

    $ npm run watch


### TODO notes

  * While changing the code to use DOM directly instead of React, I actually
    wrote some code to cleanup previous styles. I am not sure the lib should
    do it, so I left it commented for now. There are very low perceived
    issues on iPhone 4 with the cleanup, (guessing from 60 to 40 fps?)

  * I was lazy and didn't complete the consumption mode example, will need to
    finish later. For not it has only top and bottom sidebar handling, but no
    consumption transition itself.

  * Styles are currently only on the examples, need to figure out a way to
    be in JavaScript and still be able to override via some API.

  * Figure out the best way to require the components and at the same time provide
    a package that whoever is not using CommonJS can still have a good API.

  * Forcing `<Scroller>` to declare scrollingX and scrollingY for now. There is
    potential to inferring this based on itemSizes, but Zynga's API don't provide
    a way of updating this value in runtime.
