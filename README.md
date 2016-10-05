# himawari-history

> Download all Himawari 8 images in a date range.

[![npm][npm-image]][npm-url]
[![standard][standard-image]][standard-url]

[npm-image]: https://img.shields.io/npm/v/himawari-history.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/himawari-history
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: http://npm.im/standard

## Install

Warning: requires :zap: **magick** :zap:

* [graphicsmagick](http://www.graphicsmagick.org)
* [node.js](https://nodejs.org/en/download/)

If you have [homebrew](http://brew.sh/) installed, you can use that to quickly install `graphicsmagick`. The rest of the program can be easily installed with [`npm`](https://www.npmjs.com/).

```
brew install graphicsmagick
npm install himawari-history
```

If you want to use the video scripts in `examples`, you'll also need [`ffmpeg`](https://www.ffmpeg.org), which can also be installed with homebrew.

```
brew ffmpeg
```

## Usage

Here's an example showing all options:

```js
var hh = require('himawari-history')
var moment = require('moment')

hh({
  start: new Date(moment().subtract(1, 'days').format()),
  end: new Date(),
  interval: 10,
  outdir: path.resolve('images'),
  debug: false,
  concurrency: 10,
  zoom: 1,
  infrared: false,
  parallel: false,
  onFileSuccess: function (outfile) {
    console.log(`✅  ${outfile}`)
  }
}, function () {
  console.log('✅  all done')
})
```

Here's how I downloaded all Himawari 8 images at the base zoom level (1d). This is kind of intense, not recommended for your first spin.

```js
var hh = require('himawari-history')

// Site states:
// "Himawari-8 started operation at 02 UTC on 7 July 2015."
// http://www.data.jma.go.jp/mscweb/en/himawari89/
// All I see is 404s until this date:
var THE_BEGINNING = new Date('Tue, 07 Jul 2015 9:00:00 GMT')

hh({
  debug: true,
  start: THE_BEGINNING,
  concurrency: 20,
  onFileSuccess: function (outfile) {
    console.log(`✅  ${outfile}`)
  }
}, function () {
  console.log('✅  all done')
})
```

The `examples` directory has all the scripts I'm working with, including `video.js` for visible light and `video-infrared.js` for infrared. The video scripts require images downloaded from the other scripts. This is very thrown together and experimental. Please let me know if you're interested in taking it further!

## Contributing

Contributions welcome! Please read the [contributing guidelines](CONTRIBUTING.md) first.

## Acknowledgements

Example video scripts are based on the [himawari.js](https://github.com/jakiestfu/himawari.js) video script.

## See Also

- [hi8](https://github.com/ungoldman/hi8): See Earth from Himawari-8 on your desktop every 10 minutes.
- [himawari-bg](https://github.com/ungoldman/himawari-bg): Set the latest image from Himawari 8 as your desktop background.
- [himawari-urls](https://github.com/ungoldman/himawari-urls): Get URLs for Himawari 8 image tiles based on a given date.

## License

[ISC](LICENSE.md)
