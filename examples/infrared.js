var hh = require('../')
var moment = require('moment')

var start = new Date(moment().subtract(7, 'days').format())

hh({
  start: start,
  infrared: true,
  zoom: 2,
  parallel: true,
  debug: true,
  onFileSuccess: function (outfile) {
    console.log(`✅  ${outfile}`)
  }
}, function () {
  console.log('✅  all done')
})
