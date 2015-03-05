## React Scrollable

Scrollable components for advanced mobile scrolling with React.js

#### Build

    $ npm run build

#### Development

    $ npm run watch


### TODO notes

  * WebkitTransform -> MozTransform -> transform detection

  * Styles are currently only on the examples, need to figure out a way to
    be in JavaScript and still be able to override via some API.

  * Figure out the best way to require the components and at the same time
    provide a package that whoever is not using CommonJS can still have a
    nice API for bower or manual download.

  * Forcing `<Scroller>` to declare scrollingX and scrollingY for now. There
    is potential to inferring this based on itemSizes, but Zynga's API don't
    provide a way of updating this value in runtime.
