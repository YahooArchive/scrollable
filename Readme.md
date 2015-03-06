## React Scrollable

A library for layer composition with scrolling interactions.

#### Tests and coverage

    $ npm test

#### Build

    $ npm run build

#### Development

    $ npm run dev

#### Development auto-watch unit tests (without coverage)

    $ karma start

### TODO notes

  * Size/Position dependencies in lower level, look at ExtJS anchorTo for
    a higher level API

  * FPS meter on examples, maybe optional parameter

  * WebkitTransform -> MozTransform -> transform detection

  * Styles are currently only on the examples, need to figure out a way to
    be in JavaScript and still be able to override via some API.

  * Figure out the best way to require the components and at the same time
    provide a package that whoever is not using CommonJS can still have a
    nice API for bower or manual download.

  * Requiring `<Scroller>` to declare scrollingX and scrollingY for now. There
    is potential to inferring this based on itemSizes, but Zynga's API don't
    provide a way of updating this value in runtime.
