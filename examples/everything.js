var hh = require('../')

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
